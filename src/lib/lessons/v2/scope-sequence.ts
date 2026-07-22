import type { CefrLevel } from "./schema";

export type CurriculumStage =
  | "foundation"
  | "expansion"
  | "integration"
  | "checkpoint";

export interface MissionScopeSequence {
  legacyUnitId: string;
  level: CefrLevel;
  stage: CurriculumStage;
  communicativeFunctions: string[];
  corePatterns: string[];
  lexicalFields: string[];
  pronunciationFocus: string[];
  discourseAndStrategyFocus: string[];
  recyclesMissionIds: string[];
  performanceEvidenceVi: string;
}

type MissionScopeRow = readonly [
  legacyUnitId: string,
  level: CefrLevel,
  stage: CurriculumStage,
  communicativeFunctions: readonly string[],
  corePatterns: readonly string[],
  lexicalFields: readonly string[],
  pronunciationFocus: readonly string[],
  discourseAndStrategyFocus: readonly string[],
  recyclesMissionIds: readonly string[],
  performanceEvidenceVi: string,
];

/**
 * Detailed scope-and-sequence for the 50 legacy routes.
 *
 * Every mission adds a small set of communicative functions, explicitly
 * recycles earlier missions, raises discourse demands, and ends with
 * observable performance evidence.
 */
const MISSION_ROWS: readonly MissionScopeRow[] = [
  ["unit-a0-1", "PRE_A1", "foundation", ["say_name", "spell_name", "ask_slow_repeat"], ["My name is...", "How do you spell that?", "Please say that again/slowly."], ["names", "alphabet"], ["letter names", "final consonant in name"], ["repair: repeat/slow"], [], "20-second supported introduction and repair exchange"],
  ["unit-a0-2", "PRE_A1", "foundation", ["understand_number", "ask_price", "pay"], ["How much is it?", "It is...", "Cash or card?"], ["numbers 0-100", "money"], ["teen/ty contrast", "number stress"], ["confirm number/price"], ["unit-a0-1"], "complete a 3-turn payment exchange"],
  ["unit-a0-3", "PRE_A1", "expansion", ["identify_object", "describe_colour_size"], ["This one.", "The red/blue one.", "It is big/small."], ["colours", "common objects", "size"], ["initial consonants in colour words"], ["point and confirm"], ["unit-a0-2"], "identify the correct object from a short description"],
  ["unit-a0-4", "PRE_A1", "expansion", ["greet", "respond", "thank_apologize", "close"], ["Hi/Hello.", "I am fine, thanks.", "Sorry/Thank you.", "Goodbye/See you."], ["greetings", "basic feelings"], ["sentence stress in formulaic phrases"], ["open and close exchange"], ["unit-a0-1"], "perform a 4-turn greeting and closing"],
  ["unit-a0-5", "PRE_A1", "integration", ["give_personal_details", "read_form"], ["I am ... years old.", "I am from...", "I live in..."], ["age", "countries", "cities"], ["from vs form", "word stress in country names"], ["ask for missing detail"], ["unit-a0-1", "unit-a0-2"], "give four personal details with prompts"],
  ["unit-a0-6", "PRE_A1", "integration", ["identify_family", "say_relationship"], ["This is my...", "His/Her name is..."], ["family", "people"], ["he/she contrast", "final -s in names"], ["confirm person"], ["unit-a0-3", "unit-a0-5"], "describe two people in a photo"],
  ["unit-a0-7", "PRE_A1", "integration", ["understand_time", "confirm_appointment"], ["What time?", "At ... o'clock.", "Monday is OK."], ["clock time", "days", "dates"], ["time number clarity"], ["confirm/correct time"], ["unit-a0-2", "unit-a0-4"], "confirm a simple appointment"],
  ["unit-a0-8", "PRE_A1", "checkpoint", ["ask_help", "state_emergency_need", "give_location"], ["Help, please.", "I am lost/hurt.", "Call...", "I am at..."], ["places", "body pain", "emergency"], ["key-word stress", "clear final consonants"], ["repeat location"], ["unit-a0-1", "unit-a0-5", "unit-a0-7"], "complete a supported survival call"],
  ["unit-1", "A1", "foundation", ["introduce_self", "greet_colleague", "ask_basic_followup"], ["I am...", "I work/study at...", "What about you?"], ["jobs", "workplaces", "countries"], ["final consonants in job words", "thought groups"], ["ask one follow-up"], ["unit-a0-1", "unit-a0-4", "unit-a0-5"], "40-second colleague introduction"],
  ["unit-2", "A1", "foundation", ["ask_personal_work_info", "answer_wh_questions"], ["Where do you live/work?", "What do you do?", "I work as..."], ["personal details", "roles", "departments"], ["do/you reduction awareness", "question intonation"], ["clarify a question"], ["unit-1"], "6-turn information exchange"],
  ["unit-3", "A1", "foundation", ["introduce_other_person", "describe_basic_traits"], ["This is...", "He/She is...", "He/She has..."], ["family", "appearance", "personality basics"], ["he/she", "his/her", "final -s"], ["correct a detail"], ["unit-2"], "introduce a person from a photo"],
  ["unit-4", "A1", "expansion", ["describe_routine", "say_frequency_time"], ["I usually...", "I start at...", "Then I..."], ["daily tasks", "time", "frequency"], ["third-person -s awareness", "content-word stress"], ["sequence routine"], ["unit-a0-7", "unit-2"], "describe a workday in 5–6 sentences"],
  ["unit-5", "A1", "expansion", ["express_likes", "invite", "accept_decline"], ["I like...", "Would you like to...?", "Yes, I would./Sorry, I cannot."], ["hobbies", "days", "places"], ["like vs would like rhythm"], ["invite and respond"], ["unit-4"], "make and respond to an invitation"],
  ["unit-6", "A1", "expansion", ["describe_place", "locate_object"], ["There is/are...", "It is next to...", "Where is...?"], ["rooms", "workplace objects", "positions"], ["there/they're distinction", "plural -s"], ["ask location"], ["unit-a0-3"], "guide someone to an object"],
  ["unit-7", "A1", "integration", ["ask_price_size_quantity", "choose_item", "pay"], ["How much are...?", "Do you have...?", "I will take it."], ["clothes/products", "sizes", "quantities"], ["plural endings", "number clarity"], ["request alternative"], ["unit-a0-2", "unit-a0-3"], "complete a purchase with one change"],
  ["unit-8", "A1", "integration", ["order_food", "specify_quantity", "make_simple_request"], ["I would like...", "Can I have...?", "No..., please."], ["food", "drinks", "quantities"], ["would like rhythm", "final consonants"], ["correct order"], ["unit-5", "unit-7"], "order a meal and correct one detail"],
  ["unit-9", "A1", "integration", ["ask_location", "give_short_directions", "confirm_route"], ["How do I get to...?", "Go straight/turn...", "Is it near...?"], ["places", "directions", "distance"], ["street/place stress", "left/right clarity"], ["repeat route back"], ["unit-6"], "give and confirm a short route"],
  ["unit-10", "A1", "integration", ["state_ability", "ask_help", "offer_help"], ["I can/cannot...", "Can you help me...?", "I can show you."], ["skills", "tools", "work tasks"], ["can/can't contrast", "final /t/"], ["say what support is needed"], ["unit-2", "unit-4"], "handle a simple task-support exchange"],
  ["unit-11", "A1", "integration", ["state_feeling_symptom", "understand_simple_advice"], ["I feel...", "I have...", "You should..."], ["feelings", "body", "basic health"], ["ship/sheep or relevant vowel contrasts", "sentence stress"], ["ask for repetition of advice"], ["unit-a0-8", "unit-10"], "describe a symptom and respond to advice"],
  ["unit-12", "A1", "checkpoint", ["combine_a1_tasks", "manage_simple_day"], ["reviewed A1 chunks"], ["integrated A1 domains"], ["intelligible key information"], ["open, maintain, close; repair"], ["unit-1", "unit-2", "unit-7", "unit-9", "unit-10"], "multi-stage first-day-at-work mission"],
  ["unit-13", "A2", "foundation", ["narrate_past_event", "sequence_events", "express_reaction"], ["I went...", "First/then/after that...", "It was..."], ["weekend", "travel", "work events"], ["-ed endings", "past time stress"], ["ask/answer follow-up"], ["unit-4"], "70-second past-event narrative"],
  ["unit-14", "A2", "foundation", ["state_plan", "suggest_time", "agree_change"], ["I am going to...", "How about...?", "Could we move it to...?"], ["plans", "calendar", "meetings"], ["future chunk rhythm", "date/time clarity"], ["negotiate a time"], ["unit-a0-7", "unit-5"], "schedule and reschedule a meeting"],
  ["unit-15", "A2", "foundation", ["compare_options", "recommend", "justify_briefly"], ["X is cheaper/better than Y.", "I recommend... because..."], ["products", "services", "criteria"], ["comparative endings", "contrast stress"], ["ask preference"], ["unit-7"], "compare three options and recommend one"],
  ["unit-16", "A2", "expansion", ["request_travel_service", "explain_problem", "seek_solution"], ["I have a reservation.", "There is a problem with...", "Could you...?"], ["transport", "hotel", "documents"], ["polite request intonation", "consonant clusters"], ["clarify details"], ["unit-9", "unit-11"], "solve a travel-service problem"],
  ["unit-17", "A2", "expansion", ["describe_experience", "state_achievement", "say_not_yet"], ["I have worked...", "I have already...", "I have not... yet."], ["skills", "experience", "projects"], ["contracted have", "word stress in job terms"], ["give example"], ["unit-10", "unit-13"], "give a short experience profile"],
  ["unit-18", "A2", "checkpoint", ["integrate_plan_compare_problem_solve"], ["reviewed A2 patterns"], ["travel/work planning"], ["connected speech with time markers"], ["negotiate and repair"], ["unit-13", "unit-14", "unit-15", "unit-16", "unit-17"], "multi-stage changed-travel-plan mission"],
  ["unit-19", "B1", "foundation", ["narrate_challenge", "set_background", "state_result_lesson"], ["I was... when...", "The main problem was...", "In the end..."], ["work incidents", "actions", "results"], ["pause at clause boundaries", "past endings"], ["invite clarification"], ["unit-13"], "110-second workplace story"],
  ["unit-20", "B1", "foundation", ["summarise_news", "sequence_prior_events", "report_source"], ["According to...", "Before that...", "The main point is..."], ["news", "events", "sources"], ["prominence on main point"], ["check source/detail"], ["unit-13", "unit-19"], "oral summary of a short report"],
  ["unit-21", "B1", "foundation", ["describe_trend", "predict_impact", "support_reason"], ["X has been increasing.", "This will probably...", "One reason is..."], ["trends", "technology", "work"], ["number/percentage stress", "stance stress"], ["respond to prediction"], ["unit-14", "unit-15"], "discuss a familiar trend"],
  ["unit-22", "B1", "expansion", ["explain_rule", "distinguish_obligation_permission_advice"], ["You must/have to...", "You are allowed to...", "You should..."], ["workplace rules", "safety", "policy"], ["modal stress contrast"], ["check understanding"], ["unit-10", "unit-11"], "explain a policy to a colleague"],
  ["unit-23", "B1", "expansion", ["state_real_condition", "explain_consequence", "propose_contingency"], ["If..., then...", "Unless...", "In that case..."], ["risk", "operations", "planning"], ["condition/result grouping"], ["challenge condition"], ["unit-14", "unit-21"], "discuss a practical contingency"],
  ["unit-24", "B1", "expansion", ["explain_process", "sequence_passive_steps", "highlight_control"], ["First, ... is...", "After that...", "Finally..."], ["processes", "quality", "service"], ["weak forms in passive", "sequence prominence"], ["answer process question"], ["unit-4", "unit-20"], "explain a work process"],
  ["unit-25", "B1", "expansion", ["describe_precisely", "define_identify", "add_relevant_detail"], ["The person who...", "The place where...", "The item that..."], ["people", "places", "equipment"], ["relative clause phrasing"], ["repair vague reference"], ["unit-3", "unit-6"], "identify a person/item from detailed description"],
  ["unit-26", "B1", "integration", ["state_preference", "compare_values", "defend_choice"], ["I would rather...", "The main advantage is...", "For example..."], ["work styles", "learning", "services"], ["contrastive stress"], ["acknowledge alternative"], ["unit-15", "unit-21"], "defend a preference in discussion"],
  ["unit-27", "B1", "integration", ["assign_task", "report_status", "request_followup"], ["Could you take care of...?", "I have finished...", "We still need to..."], ["tasks", "deadlines", "ownership"], ["phrasal verb stress", "turn-taking intonation"], ["confirm owner/deadline"], ["unit-4", "unit-14"], "run a short team check-in"],
  ["unit-28", "B1", "integration", ["report_duration_progress", "describe_ongoing_issue"], ["We have been... for...", "So far...", "We are still..."], ["projects", "progress", "blockers"], ["duration phrase stress"], ["ask for evidence"], ["unit-17", "unit-27"], "give a project progress update"],
  ["unit-29", "B1", "integration", ["analyse_problem", "explain_cause_impact", "propose_solution"], ["The issue is...", "This is caused by...", "I suggest..."], ["problems", "causes", "solutions"], ["prominence on cause/solution"], ["ask why and respond"], ["unit-23", "unit-28"], "problem-solution meeting contribution"],
  ["unit-30", "B1", "integration", ["state_opinion", "develop_reason_example", "respond_other_view"], ["In my view...", "This is because...", "However..."], ["health", "environment", "society"], ["discourse marker phrasing"], ["agree/disagree politely"], ["unit-21", "unit-26", "unit-29"], "two-minute familiar-topic discussion"],
  ["unit-31", "B1", "integration", ["make_proposal", "justify_action", "request_decision"], ["I propose...", "The benefit would be...", "Could you approve...?"], ["proposals", "benefits", "actions"], ["formal tone and sentence stress"], ["handle one objection"], ["unit-27", "unit-29", "unit-30"], "present a professional proposal"],
  ["unit-32", "B1", "checkpoint", ["integrate_b1_problem_cycle"], ["reviewed B1 discourse"], ["workplace scenario"], ["sustained comprehensibility"], ["clarify, negotiate, close"], ["unit-19", "unit-20", "unit-27", "unit-29", "unit-31"], "end-to-end B1 work problem assessment"],
  ["unit-33", "B2", "foundation", ["analyse_hypothetical", "prioritise_action", "explain_consequence"], ["If that happened...", "My first priority would be...", "That could lead to..."], ["interviews", "management", "risk"], ["conditional phrasing", "certainty stress"], ["probe assumptions"], ["unit-23", "unit-29"], "respond to a hypothetical interview case"],
  ["unit-34", "B2", "foundation", ["evaluate_past_decision", "construct_counterfactual", "derive_lesson"], ["If we had...", "We might have...", "The lesson is..."], ["decisions", "failure", "learning"], ["modal perfect rhythm"], ["challenge hindsight"], ["unit-19", "unit-33"], "post-mortem analysis"],
  ["unit-35", "B2", "foundation", ["negotiate_condition", "set_limit_exception", "offer_fallback"], ["Provided that...", "We could agree if...", "Otherwise..."], ["contracts", "resources", "deadlines"], ["polite firmness intonation"], ["reframe offer"], ["unit-23", "unit-31", "unit-33"], "negotiate terms and fallback"],
  ["unit-36", "B2", "expansion", ["report_source_neutrally", "distance_claim", "compare_positions"], ["It was reported that...", "The data suggests...", "By contrast..."], ["research", "reports", "claims"], ["reporting structure phrasing"], ["qualify source confidence"], ["unit-20", "unit-24"], "brief a stakeholder from source material"],
  ["unit-37", "B2", "expansion", ["select_key_points", "compress_complex_info", "adapt_for_audience"], ["The key takeaway is...", "In practical terms...", "What matters for us is..."], ["briefing", "analysis", "audiences"], ["information focus"], ["check audience need"], ["unit-20", "unit-36"], "deliver an executive summary"],
  ["unit-38", "B2", "expansion", ["build_persuasion", "emphasise_priority", "support_with_evidence"], ["What is especially important is...", "Not only... but also...", "The evidence shows..."], ["persuasion", "strategy", "evidence"], ["contrastive prominence"], ["address counterargument"], ["unit-30", "unit-31", "unit-37"], "persuasive proposal pitch"],
  ["unit-39", "B2", "integration", ["infer_from_evidence", "grade_certainty", "revise_inference"], ["It must/might/cannot have...", "It appears that...", "I may be wrong, but..."], ["evidence", "incidents", "diagnosis"], ["certainty intonation"], ["ask for missing evidence"], ["unit-21", "unit-34", "unit-36"], "evidence-based incident discussion"],
  ["unit-40", "B2", "integration", ["frame_argument", "concede_counter", "link_evidence_conclusion"], ["The central issue is...", "Although...", "Therefore..."], ["argument", "policy", "professional topics"], ["thought groups in long turns"], ["summarise opponent fairly"], ["unit-30", "unit-38", "unit-39"], "structured 3-minute argument"],
  ["unit-41", "B2", "integration", ["adapt_lexis_by_topic", "discuss_complex_issue", "define_terms"], ["topic-specific frames"], ["technology", "environment", "education", "health", "society"], ["technical term stress"], ["paraphrase specialist term"], ["unit-36", "unit-37", "unit-40"], "topic transfer missions, one theme per session"],
  ["unit-42", "B2", "checkpoint", ["integrate_b2_modes"], ["reviewed B2 discourse and stance"], ["multi-source workplace case"], ["sustained intelligibility and stance"], ["mediate, negotiate, present"], ["unit-33", "unit-35", "unit-36", "unit-38", "unit-40"], "separate B2 reception, interaction, production and mediation assessments"],
];

export const MISSION_SCOPE_SEQUENCE: MissionScopeSequence[] =
  MISSION_ROWS.map(
    ([
      legacyUnitId,
      level,
      stage,
      communicativeFunctions,
      corePatterns,
      lexicalFields,
      pronunciationFocus,
      discourseAndStrategyFocus,
      recyclesMissionIds,
      performanceEvidenceVi,
    ]) => ({
      legacyUnitId,
      level,
      stage,
      communicativeFunctions: [...communicativeFunctions],
      corePatterns: [...corePatterns],
      lexicalFields: [...lexicalFields],
      pronunciationFocus: [...pronunciationFocus],
      discourseAndStrategyFocus: [...discourseAndStrategyFocus],
      recyclesMissionIds: [...recyclesMissionIds],
      performanceEvidenceVi,
    }),
  );

export const EXPECTED_SCOPE_SEQUENCE_COUNT = 50;

export function getMissionScope(
  legacyUnitId: string,
): MissionScopeSequence | undefined {
  return MISSION_SCOPE_SEQUENCE.find(
    (mission) => mission.legacyUnitId === legacyUnitId,
  );
}

export function getLevelScope(level: CefrLevel): MissionScopeSequence[] {
  return MISSION_SCOPE_SEQUENCE.filter((mission) => mission.level === level);
}

export function getCheckpointMissions(): MissionScopeSequence[] {
  return MISSION_SCOPE_SEQUENCE.filter(
    (mission) => mission.stage === "checkpoint",
  );
}
