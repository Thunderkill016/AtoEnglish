import { createServer, type Server } from "node:http";

import { chromium, type BrowserContextOptions } from "@playwright/test";

const VIDEO_ID = "M7lc1UVf-VE";
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

interface ProbeResult {
  name: string;
  status: "passed";
  detail: Record<string, string | number | boolean>;
}

function requireCondition(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) throw new Error(message);
}

function listen(server: Server) {
  return new Promise<number>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not resolve local verification server port."));
        return;
      }
      resolve(address.port);
    });
  });
}

function close(server: Server) {
  return new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function htmlFor(origin: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>AtoEnglish YouTube verification</title>
  <style>
    html, body { margin: 0; min-height: 100%; font-family: sans-serif; }
    main { width: min(100%, 720px); margin: 0 auto; padding: 16px; box-sizing: border-box; }
    #player-shell { width: 100%; aspect-ratio: 16 / 9; min-height: 200px; }
    #player, iframe { width: 100%; height: 100%; min-height: 200px; }
  </style>
</head>
<body>
  <main>
    <div id="player-shell"><div id="player"></div></div>
  </main>
  <script>
    window.__ytVerification = {
      apiReady: false,
      playerReady: false,
      playbackObserved: false,
      errorCode: null,
      videoId: null,
      state: null
    };
    window.onYouTubeIframeAPIReady = function () {
      window.__ytVerification.apiReady = true;
      window.__ytPlayer = new YT.Player('player', {
        videoId: '${VIDEO_ID}',
        playerVars: {
          enablejsapi: 1,
          playsinline: 1,
          origin: '${origin}'
        },
        events: {
          onReady: function (event) {
            window.__ytVerification.playerReady = true;
            window.__ytVerification.videoId = event.target.getVideoData().video_id;
            window.__ytVerification.state = event.target.getPlayerState();
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: function (event) {
            window.__ytVerification.state = event.data;
            if (event.data === 1 || event.data === 3) {
              window.__ytVerification.playbackObserved = true;
              setTimeout(function () { event.target.pauseVideo(); }, 1000);
            }
          },
          onError: function (event) {
            window.__ytVerification.errorCode = event.data;
          }
        }
      });
    };
  </script>
  <script src="https://www.youtube.com/iframe_api"></script>
</body>
</html>`;
}

async function verifyBrowserProfile(params: {
  name: string;
  baseUrl: string;
  context: BrowserContextOptions;
}): Promise<ProbeResult> {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext(params.context);
    const page = await context.newPage();
    await page.goto(params.baseUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.waitForFunction(
      () => {
        const verification = (
          window as typeof window & {
            __ytVerification?: {
              playerReady: boolean;
              playbackObserved: boolean;
              errorCode: number | null;
            };
          }
        ).__ytVerification;
        return Boolean(
          verification?.errorCode !== null ||
            (verification?.playerReady && verification.playbackObserved),
        );
      },
      undefined,
      { timeout: 60_000 },
    );

    const state = await page.evaluate(() =>
      (
        window as typeof window & {
          __ytVerification: {
            apiReady: boolean;
            playerReady: boolean;
            playbackObserved: boolean;
            errorCode: number | null;
            videoId: string | null;
            state: number | null;
          };
        }
      ).__ytVerification,
    );
    const iframe = page.locator("iframe");
    await iframe.waitFor({ state: "attached", timeout: 20_000 });
    const box = await iframe.boundingBox();
    const src = await iframe.getAttribute("src");

    requireCondition(state.apiReady, `${params.name}: IFrame API did not load.`);
    requireCondition(
      state.playerReady,
      `${params.name}: player did not become ready; error ${state.errorCode}.`,
    );
    requireCondition(
      state.errorCode === null,
      `${params.name}: YouTube player error ${state.errorCode}.`,
    );
    requireCondition(
      state.videoId === VIDEO_ID,
      `${params.name}: wrong video loaded (${state.videoId ?? "none"}).`,
    );
    requireCondition(
      state.playbackObserved,
      `${params.name}: muted playback state was not observed.`,
    );
    requireCondition(
      Boolean(src?.includes(`/embed/${VIDEO_ID}`)),
      `${params.name}: iframe source does not contain the official video ID.`,
    );
    requireCondition(
      Boolean(box && box.width >= 200 && box.height >= 200),
      `${params.name}: embedded player is smaller than 200x200.`,
    );

    await context.close();
    return {
      name: `youtube_iframe_${params.name}`,
      status: "passed",
      detail: {
        videoId: state.videoId,
        playerReady: state.playerReady,
        playbackObserved: state.playbackObserved,
        finalState: state.state ?? -999,
        width: Math.round(box?.width ?? 0),
        height: Math.round(box?.height ?? 0),
      },
    };
  } finally {
    await browser.close();
  }
}

async function run() {
  const probes: ProbeResult[] = [];
  const oEmbedResponse = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(WATCH_URL)}&format=json`,
    { signal: AbortSignal.timeout(30_000) },
  );
  requireCondition(
    oEmbedResponse.ok,
    `YouTube oEmbed returned HTTP ${oEmbedResponse.status}.`,
  );
  const metadata = (await oEmbedResponse.json()) as {
    title?: string;
    author_name?: string;
    author_url?: string;
    provider_name?: string;
  };
  requireCondition(metadata.title?.trim(), "oEmbed title is missing.");
  requireCondition(metadata.author_name?.trim(), "oEmbed author is missing.");
  requireCondition(
    metadata.provider_name === "YouTube",
    `Unexpected oEmbed provider: ${metadata.provider_name ?? "missing"}.`,
  );
  requireCondition(
    metadata.author_url?.startsWith("https://"),
    "oEmbed author URL is not HTTPS.",
  );
  probes.push({
    name: "youtube_oembed_metadata",
    status: "passed",
    detail: {
      provider: metadata.provider_name,
      titlePresent: true,
      authorPresent: true,
      authorUrlHttps: true,
    },
  });

  let origin = "";
  const server = createServer((_request, response) => {
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy":
        "default-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://s.ytimg.com; script-src 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com; frame-src https://www.youtube.com https://www.youtube-nocookie.com; img-src 'self' data: https:; connect-src 'self' https:; media-src https:;",
    });
    response.end(htmlFor(origin));
  });

  try {
    const port = await listen(server);
    origin = `http://127.0.0.1:${port}`;
    const baseUrl = `${origin}/`;

    probes.push(
      await verifyBrowserProfile({
        name: "desktop",
        baseUrl,
        context: {
          viewport: { width: 1280, height: 800 },
          locale: "en-US",
        },
      }),
    );
    probes.push(
      await verifyBrowserProfile({
        name: "mobile",
        baseUrl,
        context: {
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          locale: "en-US",
          userAgent:
            "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36",
        },
      }),
    );
  } finally {
    if (server.listening) await close(server);
  }

  console.log(
    JSON.stringify(
      {
        status: "passed",
        officialVideoId: VIDEO_ID,
        mediaDownloadedOrStored: false,
        applicationDeployment: false,
        probes,
      },
      null,
      2,
    ),
  );
}

run().catch((error: unknown) => {
  console.error(
    JSON.stringify(
      {
        status: "failed",
        mediaDownloadedOrStored: false,
        applicationDeployment: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected YouTube verification failure.",
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
