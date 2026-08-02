import type { NaturalMediaCandidate } from "@/features/source-curation/domain/natural-media";

const WHITE_HOUSE_DINING_ROOM_SOURCE =
  "https://commons.wikimedia.org/wiki/File:The_First_Lady_Surprises_Guests_in_the_Old_Family_Dining_Room_in_the_White_House.webm";
const WHITE_HOUSE_DINING_ROOM_TIMED_TEXT =
  "https://commons.wikimedia.org/wiki/TimedText:The_First_Lady_Surprises_Guests_in_the_Old_Family_Dining_Room_in_the_White_House.webm.en.srt";

const SCIENCE_FAIR_2013_SOURCE =
  "https://commons.wikimedia.org/wiki/File:Raw_Video-_At_The_White_House_Science_Fair_with_Kal_Penn_%26_Valerie_Jarrett.webm";
const SCIENCE_FAIR_2013_TIMED_TEXT =
  "https://commons.wikimedia.org/wiki/TimedText:Raw_Video-_At_The_White_House_Science_Fair_with_Kal_Penn_%26_Valerie_Jarrett.webm.en.srt";

const SCIENCE_FAIR_2014_SOURCE =
  "https://commons.wikimedia.org/wiki/File:President_Obama_Tours_the_2014_White_House_Science_Fair.webm";
const SCIENCE_FAIR_2014_TIMED_TEXT =
  "https://commons.wikimedia.org/wiki/TimedText:President_Obama_Tours_the_2014_White_House_Science_Fair.webm.en.srt";

const BRIEFING_2010_02_11_SOURCE =
  "https://commons.wikimedia.org/wiki/File:2-11-10-_White_House_Press_Briefing.webm";
const BRIEFING_2010_02_11_TIMED_TEXT =
  "https://commons.wikimedia.org/wiki/TimedText:2-11-10-_White_House_Press_Briefing.webm.en.srt";

const BRIEFING_2010_03_16_SOURCE =
  "https://commons.wikimedia.org/wiki/File:3-16-10-_White_House_Press_Briefing.webm";
const BRIEFING_2010_03_16_TIMED_TEXT =
  "https://commons.wikimedia.org/wiki/TimedText:3-16-10-_White_House_Press_Briefing.webm.en.srt";

const BRIEFING_2009_09_10_SOURCE =
  "https://commons.wikimedia.org/wiki/File:9-10-09-_White_House_Press_Briefing.webm";
const BRIEFING_2009_09_10_TIMED_TEXT =
  "https://commons.wikimedia.org/wiki/TimedText:9-10-09-_White_House_Press_Briefing.webm.en.srt";

const BRIEFING_2015_06_07_SOURCE =
  "https://commons.wikimedia.org/wiki/File:6-7-15-_White_House_Press_Briefing.webm";
const BRIEFING_2015_06_07_TIMED_TEXT =
  "https://commons.wikimedia.org/wiki/TimedText:6-7-15-_White_House_Press_Briefing.webm.en.srt";

export const NATURAL_A0_CANDIDATES_BATCH_2: NaturalMediaCandidate[] = [
  {
    id: "commons-dining-surprise-avery",
    title: "Surprise dining-room greeting and name exchange",
    sourcePageUrl: WHITE_HOUSE_DINING_ROOM_SOURCE,
    timedTextUrl: WHITE_HOUSE_DINING_ROOM_TIMED_TEXT,
    rightsEvidenceUrl: WHITE_HOUSE_DINING_ROOM_SOURCE,
    window: { startMs: 15_582, endMs: 24_591 },
    targetCapabilityIds: [
      "a0.greet_someone",
      "a0.ask_others_name",
      "a0.say_ones_name",
    ],
    spokenLanguage: "en",
    authenticity: {
      classification: "spontaneous_real_world",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "The source describes the interaction as a surprise visit to real White House guests.",
        "The timed text includes overlapping reactions, laughter, a spontaneous name question, and an immediate answer.",
      ],
      stagingSignals: [],
      editingRisk: "medium",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "Strong candidate for a first natural name exchange because the answer is short and the social purpose is visible.",
      "Verify that the selected window begins after the initial crowd reaction and preserves the full question-answer pair.",
    ],
  },
  {
    id: "commons-dining-surprise-origin-jack",
    title: "Surprise origin and name exchange with a guest",
    sourcePageUrl: WHITE_HOUSE_DINING_ROOM_SOURCE,
    timedTextUrl: WHITE_HOUSE_DINING_ROOM_TIMED_TEXT,
    rightsEvidenceUrl: WHITE_HOUSE_DINING_ROOM_SOURCE,
    window: { startMs: 654_687, endMs: 663_929 },
    targetCapabilityIds: [
      "a0.say_where_from",
      "a0.ask_others_name",
      "a0.say_ones_name",
      "a0.greet_someone",
    ],
    spokenLanguage: "en",
    authenticity: {
      classification: "spontaneous_real_world",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "The exchange occurs during the same surprise visit rather than a language exercise or reenactment.",
        "The timed text records an origin question, a short place answer, a greeting, and a name question in one live interaction.",
      ],
      stagingSignals: [],
      editingRisk: "medium",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "High-value candidate because it combines origin and name without a teaching script.",
      "Confirm whether crowd noise is manageable for A0 with scaffolded replay.",
    ],
  },
  {
    id: "commons-science-fair-2013-jessica",
    title: "Live science-fair greeting and name exchange",
    sourcePageUrl: SCIENCE_FAIR_2013_SOURCE,
    timedTextUrl: SCIENCE_FAIR_2013_TIMED_TEXT,
    rightsEvidenceUrl: SCIENCE_FAIR_2013_SOURCE,
    window: { startMs: 260_900, endMs: 270_867 },
    targetCapabilityIds: [
      "a0.greet_someone",
      "a0.ask_others_name",
      "a0.say_ones_name",
    ],
    spokenLanguage: "en",
    authenticity: {
      classification: "spontaneous_real_world",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "The source is raw event footage from a real science fair.",
        "The exchange contains reciprocal introductions, a direct name request, and a natural nice-to-meet-you closing.",
      ],
      stagingSignals: [],
      editingRisk: "medium",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "Good interaction candidate because both sides introduce themselves instead of one speaker delivering a monologue.",
      "Check whether names and voice overlap remain intelligible on mobile speakers.",
    ],
  },
  {
    id: "commons-science-fair-2014-peyton",
    title: "Live name and hometown exchange at a science fair",
    sourcePageUrl: SCIENCE_FAIR_2014_SOURCE,
    timedTextUrl: SCIENCE_FAIR_2014_TIMED_TEXT,
    rightsEvidenceUrl: SCIENCE_FAIR_2014_SOURCE,
    window: { startMs: 274_734, endMs: 287_034 },
    targetCapabilityIds: [
      "a0.ask_others_name",
      "a0.say_ones_name",
      "a0.say_where_from",
    ],
    spokenLanguage: "en",
    authenticity: {
      classification: "spontaneous_real_world",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "The questions are asked during an official live tour of student projects.",
        "The timed text contains a direct name question followed by a real hometown question and answer.",
      ],
      stagingSignals: [],
      editingRisk: "medium",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "Potential anchor or variation for asking where someone is from.",
      "The full response is longer than A0 needs; authoring may focus on the short place phrase after rights and transcript review.",
    ],
  },
  {
    id: "commons-science-fair-2014-name-repair",
    title: "Natural name clarification and confirmation",
    sourcePageUrl: SCIENCE_FAIR_2014_SOURCE,
    timedTextUrl: SCIENCE_FAIR_2014_TIMED_TEXT,
    rightsEvidenceUrl: SCIENCE_FAIR_2014_SOURCE,
    window: { startMs: 749_700, endMs: 759_500 },
    targetCapabilityIds: [
      "a0.ask_others_name",
      "a0.say_ones_name",
      "a0.request_repetition",
    ],
    spokenLanguage: "en",
    authenticity: {
      classification: "spontaneous_real_world",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "A real name is misheard or checked during a live conversation, producing clarification and confirmation behavior.",
        "The timed text ends with a natural confirmation equivalent to understanding the corrected form.",
      ],
      stagingSignals: [],
      editingRisk: "medium",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "Useful as an interaction example of repair, but not necessarily as the first model for the explicit phrase 'Could you say that again?'.",
      "Playback review must determine the exact wording and whether the repair is audible without visual context.",
    ],
  },
  {
    id: "commons-briefing-2010-pardon",
    title: "Live press question repaired with 'Pardon?'",
    sourcePageUrl: BRIEFING_2010_02_11_SOURCE,
    timedTextUrl: BRIEFING_2010_02_11_TIMED_TEXT,
    rightsEvidenceUrl: BRIEFING_2010_02_11_SOURCE,
    window: { startMs: 92_700, endMs: 97_510 },
    targetCapabilityIds: ["a0.request_repetition"],
    spokenLanguage: "en",
    authenticity: {
      classification: "live_unscripted_q_and_a",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "The repair occurs inside a live press briefing after a reporter's question is not heard or understood.",
        "The reporter immediately repeats the phrase after the spontaneous 'Pardon?' request.",
      ],
      stagingSignals: [],
      editingRisk: "low",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "Very short and genuinely motivated repair, but the surrounding topic is formal and lexically difficult.",
      "Use the repair turn as a variation after a simpler licensed anchor, not as the absolute beginner's first cold listen.",
    ],
  },
  {
    id: "commons-briefing-2010-say-again",
    title: "Live request to say a press question again",
    sourcePageUrl: BRIEFING_2010_03_16_SOURCE,
    timedTextUrl: BRIEFING_2010_03_16_TIMED_TEXT,
    rightsEvidenceUrl: BRIEFING_2010_03_16_SOURCE,
    window: { startMs: 2_138_767, endMs: 2_142_000 },
    targetCapabilityIds: ["a0.request_repetition"],
    spokenLanguage: "en",
    authenticity: {
      classification: "live_unscripted_q_and_a",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "A press-briefing speaker interrupts a live question with 'Say it again?' and receives an immediate repeat.",
        "The repair is caused by a real comprehension or hearing problem, not a language-teaching prompt.",
      ],
      stagingSignals: [],
      editingRisk: "low",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "The current window is just over three seconds and must be checked for a complete repeated turn.",
      "Natural and useful, but its direct register needs a politeness comparison in the licensed lesson core.",
    ],
  },
  {
    id: "commons-briefing-2009-repeat-last",
    title: "Live request to repeat the last question",
    sourcePageUrl: BRIEFING_2009_09_10_SOURCE,
    timedTextUrl: BRIEFING_2009_09_10_TIMED_TEXT,
    rightsEvidenceUrl: BRIEFING_2009_09_10_SOURCE,
    window: { startMs: 117_967, endMs: 122_370 },
    targetCapabilityIds: ["a0.request_repetition"],
    spokenLanguage: "en",
    authenticity: {
      classification: "live_unscripted_q_and_a",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "A real press exchange contains 'Can you repeat that last one?' followed by agreement and repetition.",
        "The request is functionally necessary in the live interaction rather than inserted for instruction.",
      ],
      stagingSignals: [],
      editingRisk: "low",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "Strong lexical variation for repetition repair.",
      "Check whether 'that last one' is understandable from the selected window alone or needs a short lead-in.",
    ],
  },
  {
    id: "commons-briefing-2015-repeat-beginning",
    title: "Live request to repeat the beginning of a question",
    sourcePageUrl: BRIEFING_2015_06_07_SOURCE,
    timedTextUrl: BRIEFING_2015_06_07_TIMED_TEXT,
    rightsEvidenceUrl: BRIEFING_2015_06_07_SOURCE,
    window: { startMs: 604_904, endMs: 617_448 },
    targetCapabilityIds: ["a0.request_repetition"],
    spokenLanguage: "en",
    authenticity: {
      classification: "live_unscripted_q_and_a",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: [
        "The speaker explicitly says the question was hard to hear and asks for the beginning to be repeated.",
        "The reporter then restarts the question in a live briefing setting.",
      ],
      stagingSignals: [],
      editingRisk: "low",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "shortlist_for_manual_review",
    rejectionReasons: [],
    notes: [
      "Provides a transparent reason for repair and a more specific repetition request.",
      "Likely too dense for an A0 anchor but valuable for later natural-speech exposure.",
    ],
  },
  {
    id: "commons-yash-mandeali-interview-reject",
    title: "Unscripted language interview with English subtitles only",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Yash_Mandeali_language_Interview.webm",
    timedTextUrl:
      "https://commons.wikimedia.org/wiki/TimedText:Yash_Mandeali_language_Interview.webm.en.srt",
    rightsEvidenceUrl:
      "https://commons.wikimedia.org/wiki/File:Yash_Mandeali_language_Interview.webm",
    window: { startMs: 0, endMs: 30_000 },
    targetCapabilityIds: ["a0.say_ones_name", "a0.say_where_from"],
    spokenLanguage: "non_en",
    authenticity: {
      classification: "semi_structured_unscripted_interview",
      status: "needs_playback_review",
      scoreOutOfFive: 4,
      evidence: [
        "The file is described as an interview rather than a reenacted English-learning dialogue.",
      ],
      stagingSignals: ["The interview questions are structured in advance."],
      editingRisk: "medium",
    },
    sourceRights: {
      claim: "cc_by_sa",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: true,
      sensitiveContext: false,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "reject",
    rejectionReasons: [
      "The spoken audio is not English; English appears only in subtitles.",
      "It cannot provide English listening evidence for the A0 core.",
    ],
    notes: ["Potentially useful for multilingual research, not this English listening pilot."],
  },
  {
    id: "commons-border-crossing-interview-reject",
    title: "Real border-crossing interview with non-English audio",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Chinese_migrants_crossing_the_US-Mexico_border.webm",
    rightsEvidenceUrl:
      "https://commons.wikimedia.org/wiki/File:Chinese_migrants_crossing_the_US-Mexico_border.webm",
    window: { startMs: 0, endMs: 30_000 },
    targetCapabilityIds: ["a0.say_where_from"],
    spokenLanguage: "non_en",
    authenticity: {
      classification: "spontaneous_real_world",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: ["The footage documents a real-world encounter rather than staged language practice."],
      stagingSignals: [],
      editingRisk: "medium",
    },
    sourceRights: {
      claim: "unknown",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: false,
      sensitiveContext: true,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "reject",
    rejectionReasons: [
      "The spoken audio is not English.",
      "The migration and border-enforcement context is unnecessarily sensitive for the first A0 pilot.",
    ],
    notes: [],
  },
  {
    id: "commons-cowlings-call-reject",
    title: "Authentic emergency phone call in a crisis context",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Al_Cowlings_911_call.ogg",
    rightsEvidenceUrl:
      "https://commons.wikimedia.org/wiki/File:Al_Cowlings_911_call.ogg",
    window: { startMs: 0, endMs: 30_000 },
    targetCapabilityIds: ["a0.request_repetition"],
    spokenLanguage: "en",
    authenticity: {
      classification: "spontaneous_real_world",
      status: "needs_playback_review",
      scoreOutOfFive: 5,
      evidence: ["The recording is an authentic emergency call rather than a performed dialogue."],
      stagingSignals: [],
      editingRisk: "low",
    },
    sourceRights: {
      claim: "public_domain",
      status: "claim_recorded",
    },
    suitability: {
      ageAppropriate: false,
      sensitiveContext: true,
      audioReviewStatus: "needs_playback_review",
      transcriptReviewStatus: "needs_playback_review",
    },
    decision: "reject",
    rejectionReasons: [
      "The recording involves an acute crisis, weapons, and potentially distressing language.",
      "Naturalness alone does not justify using harmful or distracting context for A0 learners.",
    ],
    notes: [],
  },
];

export const SHORTLISTED_NATURAL_A0_CANDIDATES =
  NATURAL_A0_CANDIDATES_BATCH_2.filter(
    (candidate) => candidate.decision === "shortlist_for_manual_review",
  );

export const REJECTED_NATURAL_A0_CANDIDATES =
  NATURAL_A0_CANDIDATES_BATCH_2.filter(
    (candidate) => candidate.decision === "reject",
  );
