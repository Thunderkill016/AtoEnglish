import type { SourceLibraryRegistry } from "@/features/source-curation/domain/source-libraries";

const BASE_REVIEWS = [
  "item_identity",
  "license_and_allowed_uses",
  "attribution",
  "third_party_material",
  "privacy_and_publicity",
  "trademark_and_endorsement",
  "audio_and_playback",
  "transcript_and_speakers",
  "clip_window",
  "pedagogical_fit",
] as const;

/**
 * Discovery registry, not a blanket permission list.
 *
 * Every selected item must still pass the item-level reviews listed here before
 * it can become a SourceAsset in the licensed curriculum core.
 */
export const FREE_SOURCE_LIBRARY_REGISTRY: SourceLibraryRegistry = {
  version: "2026-08-02.1",
  libraries: [
    {
      id: "wikimedia_commons",
      name: "Wikimedia Commons",
      homepageUrl: "https://commons.wikimedia.org/",
      termsUrl:
        "https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia",
      rightsModel: "per_item_open_license",
      supportedRightsFamilies: [
        "public_domain",
        "cc0",
        "cc_by",
        "cc_by_sa_conditional",
      ],
      coreSuitability: "conditional",
      conversationAvailability: "medium",
      fallbackPriority: 1,
      strengths: [
        "Hosts public-domain and freely licensed video with file-level author and license metadata.",
        "CC BY and public-domain items can support full transcript and derivative lesson workflows after review.",
      ],
      limitations: [
        "License and attribution requirements differ by file and are not warranted by Wikimedia.",
        "CC BY-SA items require a separate compatibility decision for the resulting adaptation.",
        "Many videos are speeches, historical footage, or demonstrations rather than short natural conversation.",
      ],
      requiredReviews: [...BASE_REVIEWS, "share_alike_compatibility"],
      discoveryQueries: [
        "English conversation interview video",
        "people introducing themselves English",
        "conversation asking name English",
        "clarification repair conversation English",
      ],
    },
    {
      id: "dvids",
      name: "Defense Visual Information Distribution Service",
      homepageUrl: "https://www.dvidshub.net/",
      termsUrl: "https://www.dvidshub.net/about/copyright",
      rightsModel: "government_media_guidelines",
      supportedRightsFamilies: ["us_government_with_guidelines"],
      coreSuitability: "conditional",
      conversationAvailability: "medium",
      fallbackPriority: 2,
      strengths: [
        "Large catalog of real interviews, briefings, and unscripted English from varied speakers.",
        "Many item pages expose provenance, captions, and public-use notices.",
      ],
      limitations: [
        "Some items contain third-party material even when hosted on a government platform.",
        "Privacy, publicity, military marks, and non-endorsement conditions remain separate from copyright.",
        "Interviews overproduce one-way self-introductions and may not contain repair or multi-turn exchanges.",
      ],
      requiredReviews: [...BASE_REVIEWS],
      discoveryQueries: [
        "interview my name is transcript",
        "where are you from interview transcript",
        "could you repeat interview",
        "international exercise interview English transcript",
      ],
    },
    {
      id: "library_of_congress",
      name: "Library of Congress free-to-use collections",
      homepageUrl: "https://www.loc.gov/free-to-use/",
      termsUrl:
        "https://www.loc.gov/collections/national-screening-room/about-this-collection/rights-and-access/",
      rightsModel: "per_item_open_license",
      supportedRightsFamilies: ["public_domain", "us_government_with_guidelines"],
      coreSuitability: "conditional",
      conversationAvailability: "low",
      fallbackPriority: 3,
      strengths: [
        "Provides films and recordings in collections identified as free to use and reuse or without known restrictions.",
        "Catalog records and collection rights statements support provenance review.",
      ],
      limitations: [
        "Rights statements vary by collection and item, and independent assessment remains required.",
        "Much of the footage is historical, with dated audio quality, vocabulary, and interaction norms.",
        "Some items are educational-use-only or affected by privacy, publicity, trademark, or foreign rights.",
      ],
      requiredReviews: [...BASE_REVIEWS],
      discoveryQueries: [
        "English interview motion picture",
        "people meeting conversation film",
        "telephone conversation motion picture",
        "immigrant interview English film",
      ],
    },
    {
      id: "nasa_media",
      name: "NASA images and media",
      homepageUrl: "https://www.nasa.gov/multimedia/",
      termsUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
      rightsModel: "government_media_guidelines",
      supportedRightsFamilies: ["us_government_with_guidelines"],
      coreSuitability: "conditional",
      conversationAvailability: "low",
      fallbackPriority: 4,
      strengths: [
        "Provides real interviews, mission communication, and varied English speakers with strong provenance.",
        "NASA-produced media is generally available for factual educational or informational use under its guidelines.",
      ],
      limitations: [
        "NASA identifiers, logos, endorsement, people, and third-party material require separate checks.",
        "Most content is domain-specific and too advanced for the first A0 capabilities.",
        "Technical radio communication is not a substitute for ordinary face-to-face conversation.",
      ],
      requiredReviews: [...BASE_REVIEWS],
      discoveryQueries: [
        "astronaut introduction interview",
        "international astronaut interview English",
        "crew asks to repeat communication",
        "visitor interview name origin",
      ],
    },
    {
      id: "pexels",
      name: "Pexels Videos",
      homepageUrl: "https://www.pexels.com/videos/",
      termsUrl: "https://www.pexels.com/legal-pages/license/",
      rightsModel: "platform_content_license",
      supportedRightsFamilies: ["pexels_license"],
      coreSuitability: "context_only",
      conversationAvailability: "low",
      fallbackPriority: 5,
      strengths: [
        "License permits free use and modification, including many commercial uses, subject to its restrictions.",
        "Useful for owned narration, situational visuals, and context when authentic spoken interaction is unavailable.",
      ],
      limitations: [
        "Most stock footage has no useful dialogue or synchronized authentic audio.",
        "Recognizable people, brands, trademarks, and implied endorsement require review.",
        "Unaltered standalone redistribution is prohibited and stock visuals must not be mistaken for learner evidence.",
      ],
      requiredReviews: [...BASE_REVIEWS],
      discoveryQueries: [
        "two people talking with audio",
        "meeting someone conversation",
        "hotel reception conversation audio",
        "coworkers talking audio",
      ],
    },
    {
      id: "pixabay",
      name: "Pixabay Videos",
      homepageUrl: "https://pixabay.com/videos/",
      termsUrl: "https://pixabay.com/service/license-summary/",
      rightsModel: "platform_content_license",
      supportedRightsFamilies: ["pixabay_license"],
      coreSuitability: "context_only",
      conversationAvailability: "low",
      fallbackPriority: 6,
      strengths: [
        "Content license generally permits free use and adaptation subject to prohibited uses.",
        "Can provide visual contexts for AtoEnglish-owned dialogue, prompts, and transfer situations.",
      ],
      limitations: [
        "Stock videos usually lack natural, intelligible English conversation.",
        "Standalone redistribution and some uses involving recognizable people, brands, or marks are restricted.",
        "Platform availability does not remove third-party privacy, publicity, trademark, or property rights.",
      ],
      requiredReviews: [...BASE_REVIEWS],
      discoveryQueries: [
        "people talking English audio",
        "introducing yourself conversation",
        "customer staff conversation audio",
        "phone call conversation audio",
      ],
    },
    {
      id: "openverse",
      name: "Openverse discovery index",
      homepageUrl: "https://openverse.org/",
      termsUrl: "https://openverse.org/about/",
      rightsModel: "discovery_index_only",
      supportedRightsFamilies: [
        "public_domain",
        "cc0",
        "cc_by",
        "cc_by_sa_conditional",
      ],
      coreSuitability: "discovery_only",
      conversationAvailability: "unknown",
      fallbackPriority: 7,
      strengths: [
        "Indexes openly licensed and public-domain media from multiple repositories.",
        "Can reveal source repositories and attribution metadata that would otherwise be hard to discover.",
      ],
      limitations: [
        "Openverse does not verify each work's license or attribution accuracy.",
        "Its primary search currently focuses on images and audio; video discovery can redirect to external sources.",
        "The indexed record itself is never sufficient rights evidence for a curriculum SourceAsset.",
      ],
      requiredReviews: [...BASE_REVIEWS, "share_alike_compatibility"],
      discoveryQueries: [
        "English conversation audio",
        "spoken English interview",
        "conversation repair English",
      ],
    },
  ],
};
