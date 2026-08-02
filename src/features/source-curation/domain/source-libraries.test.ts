import { describe, expect, it } from "vitest";

import { FREE_SOURCE_LIBRARY_REGISTRY } from "@/features/source-curation/data/free-source-libraries";
import {
  canUseSourceLibraryRegistry,
  rankSourceLibrariesForGap,
  validateSourceLibraryRegistry,
} from "@/features/source-curation/domain/source-libraries";

describe("Free source library registry", () => {
  it("passes registry validation", () => {
    expect(validateSourceLibraryRegistry(FREE_SOURCE_LIBRARY_REGISTRY)).toEqual([]);
    expect(canUseSourceLibraryRegistry(FREE_SOURCE_LIBRARY_REGISTRY)).toBe(true);
  });

  it("never marks an external library as automatically preferred core media", () => {
    expect(
      FREE_SOURCE_LIBRARY_REGISTRY.libraries.every(
        (library) => library.coreSuitability !== "preferred",
      ),
    ).toBe(true);
  });

  it("requires item-level rights, audio, transcript, timing, and pedagogical review everywhere", () => {
    const mandatoryReviews = [
      "item_identity",
      "license_and_allowed_uses",
      "third_party_material",
      "privacy_and_publicity",
      "audio_and_playback",
      "transcript_and_speakers",
      "clip_window",
      "pedagogical_fit",
    ] as const;

    for (const library of FREE_SOURCE_LIBRARY_REGISTRY.libraries) {
      for (const review of mandatoryReviews) {
        expect(library.requiredReviews).toContain(review);
      }
    }
  });

  it("keeps Openverse as discovery evidence rather than reusable media", () => {
    const openverse = FREE_SOURCE_LIBRARY_REGISTRY.libraries.find(
      (library) => library.id === "openverse",
    );

    expect(openverse?.rightsModel).toBe("discovery_index_only");
    expect(openverse?.coreSuitability).toBe("discovery_only");
  });

  it("prioritizes conversation-bearing archives above silent stock footage for multi-turn gaps", () => {
    const ranked = rankSourceLibrariesForGap(FREE_SOURCE_LIBRARY_REGISTRY, {
      capabilityId: "a0.request_repetition",
      needsMultiTurnConversation: true,
      needsAuthenticAudio: true,
    });

    const positions = new Map(
      ranked.map(({ library }, index) => [library.id, index]),
    );

    expect(positions.get("wikimedia_commons")).toBeLessThan(
      positions.get("pexels") ?? Number.POSITIVE_INFINITY,
    );
    expect(positions.get("dvids")).toBeLessThan(
      positions.get("pixabay") ?? Number.POSITIVE_INFINITY,
    );
    expect(positions.has("openverse")).toBe(false);
  });

  it("allows stock libraries only as context-first fallbacks", () => {
    for (const id of ["pexels", "pixabay"]) {
      const library = FREE_SOURCE_LIBRARY_REGISTRY.libraries.find(
        (candidate) => candidate.id === id,
      );
      expect(library?.coreSuitability).toBe("context_only");
    }
  });
});
