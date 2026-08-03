const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env.local") });

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No GEMINI_API_KEY");
    return;
  }

  const { YoutubeTranscript } = require("youtube-transcript");
  console.log("Fetching transcript for 9ot4CFf0ix8...");
  const raw = await YoutubeTranscript.fetchTranscript("9ot4CFf0ix8");
  console.log("Transcript fetched. Items:", raw.length);

  const truncated = raw.slice(0, 60);
  const transcriptText = truncated
    .map((item) => `[${Math.floor(item.offset / 1000)}s] ${item.text}`)
    .join("\n");

  const prompt = `Bạn là giáo viên tiếng Anh chuyên gia cho người Việt mất gốc (A1-A2).
Dưới đây là transcript của video "What's In The Box Challenge":

${transcriptText}

Hãy tạo bài học hoàn chỉnh theo JSON schema sau:
{
  "title": "What's In The Box Challenge",
  "titleVi": "Thử thách Đoán đồ vật trong hộp kín",
  "level": "A1",
  "estimatedMinutes": 15,
  "canDoStatement": "I can understand reactions, informal expressions, and ask questions in fun challenges.",
  "canDoStatementVi": "Tôi có thể hiểu phản ứng, từ cảm thán và cách hỏi đáp trong các trò chơi thực tế.",
  "speakers": [
    { "label": "Host", "color": "#60a5fa" },
    { "label": "Jamal", "color": "#34d399" }
  ],
  "transcript": [
    {
      "index": 0,
      "speaker": "Host",
      "startTime": 0,
      "endTime": 5,
      "textEn": "Are you guys ready for what's in the box?",
      "textVi": "Các bạn đã sẵn sàng cho đồ vật trong hộp chưa?"
    }
  ],
  "preWatch": {
    "contextVi": "Trong video này, hai người bạn cùng tham gia trò chơi 'What's In The Box Challenge'. Người chơi phải bịt mắt và chạm tay vào đồ vật bí ẩn bên trong hộp để đoán xem đó là gì.",
    "vocabulary": [
      {
        "word": "blindfold",
        "phonetic": "/ˈblaɪnd.foʊld/",
        "definition": "a piece of cloth tied over eyes",
        "meaningVi": "băng che mắt",
        "contextSentence": "Jamal, put the blindfold on.",
        "timestamp": 7,
        "pronunciationNote": "Chú ý âm /d/ ở giữa và âm /ld/ ở cuối.",
        "l1InterferenceVn": "Người Việt hay quên bật âm /d/ ở cuối."
      },
      {
        "word": "take a chill pill",
        "phonetic": "/teɪk ə tʃɪl pɪl/",
        "definition": "calm down, relax",
        "meaningVi": "bình tĩnh lại, bớt căng thẳng đi",
        "contextSentence": "Just relax, bro. Take a chill pill, bro.",
        "timestamp": 25,
        "pronunciationNote": "Cụm từ nối âm: 'take a' = /teɪkə/.",
        "l1InterferenceVn": "Nói liền mạch, đừng ngắt từng từ."
      }
    ],
    "prediction": {
      "questionVi": "Bạn nghĩ người chơi sẽ cảm thấy thế nào khi thò tay vào hộp?",
      "options": ["Tự tin và bình tĩnh", "Hồi hộp, sợ hãi và giật mình", "Tức giận và khó chịu", "Tò mò nhưng không lo lắng"],
      "correctIndex": 1
    },
    "soundAlerts": [
      {
        "sound": "/k/ âm cuối",
        "explanationVi": "Âm /k/ xuất hiện nhiều trong các từ như 'relax', 'take', 'make', 'snake'.",
        "exampleWords": ["relax", "snake", "make"],
        "commonMistakeVi": "Người Việt hay bỏ quên âm bật /k/ ở cuối từ."
      }
    ]
  },
  "whileWatch": {
    "gistQuestion": {
      "questionVi": "Mục tiêu chính của trò chơi trong video là gì?",
      "options": ["Xem ai mở hộp nhanh nhất", "Bịt mắt và đoán đồ vật bên trong hộp bằng tay", "Trang trí chiếc hộp bí mật", "Đoán tên các loài động vật"],
      "correctIndex": 1
    },
    "focusPoints": [
      {
        "type": "discourse_marker",
        "pattern": "Take a chill pill",
        "explanationVi": "'Take a chill pill' là thành ngữ lóng rất phổ biến giữa bạn bè khi muốn bảo ai đó bình tĩnh lại.",
        "segmentIndices": [1]
      }
    ],
    "keyMoments": [
      {
        "timestamp": 25,
        "descriptionVi": "Jamal hoảng sợ khi chuẩn bị thò tay vào hộp",
        "listenForVi": "Lắng nghe cụm 'Take a chill pill'"
      }
    ]
  },
  "postWatch": {
    "comprehensionQuiz": [
      {
        "id": "q1",
        "questionVi": "Người dẫn chương trình yêu cầu Jamal làm gì đầu tiên?",
        "options": ["Mở hộp ra ngay", "Đeo băng che mắt (blindfold)", "Chạy ra ngoài", "Sờ vào đồ vật"],
        "correctIndex": 1,
        "explanationVi": "Cụm 'put the blindfold on' có nghĩa là đeo băng che mắt vào."
      }
    ],
    "fillInTheBlank": [
      {
        "id": "fib1",
        "sentence": "Just relax, bro. Take a ___ pill, bro.",
        "hintVi": "bình tĩnh lại (từ lóng)",
        "answer": "chill",
        "alternatives": ["chill"]
      }
    ],
    "speakingDrills": [
      {
        "id": "sd1",
        "phrase": "Take a chill pill, bro.",
        "meaningVi": "Bình tĩnh lại đi ông bạn.",
        "timestamp": 25,
        "tipVi": "Nối âm 'take a' thành /teɪkə/, nhấn mạnh vào từ 'chill'."
      }
    ],
    "culturalNotes": [
      {
        "titleVi": "Văn hóa YouTube Challenge",
        "contentVi": "'What's In The Box Challenge' là một thử thách trò chơi phổ biến trên YouTube phương Tây, tập trung vào phản ứng hài hước, tự nhiên của người chơi khi sờ vào những đồ vật lạ."
      }
    ]
  }
}`;

  console.log("Calling Gemini 3.6 Flash API...");
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
          maxOutputTokens: 8192,
        },
      }),
    }
  );

  if (!response.ok) {
    console.error("Gemini err:", response.status, await response.text());
    return;
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("GENERATED LESSON JSON RESULT:");
  console.log(text.slice(0, 500) + "...\n(Total chars: " + text.length + ")");

  fs.writeFileSync(
    path.join(__dirname, "generated_whats_in_the_box_lesson.json"),
    text
  );
  console.log("Saved to generated_whats_in_the_box_lesson.json!");
}

run().catch(console.error);
