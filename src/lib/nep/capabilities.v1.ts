export type EvidenceChannel =
  | "comprehension"
  | "retrieval"
  | "production"
  | "repair"
  | "transfer"
  | "retention";

export type Capability = {
  id: string;
  title: string;
  learnerJob: string;
  prerequisites: string[];
  functions: string[];
  chunks: string[];
  vocabulary: string[];
  grammarPatterns: string[];
  pronunciationFocus: string[];
  listeningDemands: string[];
  evidencePrinciples: string[];
  evidenceClaims: string[];
  assessment: EvidenceChannel[];
};

export const capabilityGraphV1: Capability[] = [
  {
    id: "CAP-001",
    title: "Greet and close",
    learnerJob: "Start and end a short interaction without freezing.",
    prerequisites: [],
    functions: ["greet", "acknowledge", "close"],
    chunks: ["Hi.", "Nice to meet you.", "See you."],
    vocabulary: ["hi", "nice", "meet", "see"],
    grammarPatterns: [],
    pronunciationFocus: ["short greeting rhythm"],
    listeningDemands: ["recognise a greeting and closing cue"],
    evidencePrinciples: ["PRN-001", "PRN-002", "PRN-050"],
    evidenceClaims: ["CLM-FND-001", "CLM-SPK-001"],
    assessment: ["comprehension", "retrieval", "production", "retention"],
  },
  {
    id: "CAP-002",
    title: "Introduce yourself",
    learnerJob: "Say your name and basic identity information in a first meeting.",
    prerequisites: ["CAP-001"],
    functions: ["introduce self", "spell name"],
    chunks: ["I'm …", "My name is …", "That's …"],
    vocabulary: ["name", "from"],
    grammarPatterns: ["be in first-person identity chunks"],
    pronunciationFocus: ["letter names", "name boundary clarity"],
    listeningDemands: ["recognise a name question", "recognise a request to repeat/spell"],
    evidencePrinciples: ["PRN-003", "PRN-050", "PRN-054", "PRN-058", "PRN-001", "PRN-002"],
    evidenceClaims: ["CLM-VOC-001", "CLM-SPK-001", "CLM-SPK-002", "CLM-SPK-007", "CLM-SPK-010", "CLM-SPK-008"],
    assessment: ["comprehension", "retrieval", "production", "repair", "retention"],
  },
  {
    id: "CAP-003",
    title: "Ask for repetition",
    learnerJob: "Recover when you did not hear or understand a short turn.",
    prerequisites: ["CAP-001"],
    functions: ["request repetition", "request clarification"],
    chunks: ["Sorry?", "Could you say that again?", "What was your name again?"],
    vocabulary: ["sorry", "again"],
    grammarPatterns: ["Could you …? as a repair chunk"],
    pronunciationFocus: ["polite request rhythm"],
    listeningDemands: ["notice an information gap before responding"],
    evidencePrinciples: ["PRN-054", "PRN-058", "PRN-016", "PRN-018"],
    evidenceClaims: ["CLM-SPK-002", "CLM-SPK-007", "CLM-SPK-010", "CLM-SPK-008", "CLM-SCF-001", "CLM-SCF-004"],
    assessment: ["retrieval", "production", "repair", "retention"],
  },
  {
    id: "CAP-004",
    title: "Confirm understanding",
    learnerJob: "Check that a short piece of information was understood correctly.",
    prerequisites: ["CAP-003"],
    functions: ["confirm", "check information"],
    chunks: ["So, that's …?", "You mean …?", "Right?"],
    vocabulary: ["mean", "right"],
    grammarPatterns: ["confirmation frames"],
    pronunciationFocus: ["confirmation intonation"],
    listeningDemands: ["hold one detail long enough to confirm it"],
    evidencePrinciples: ["PRN-054", "PRN-058", "PRN-002"],
    evidenceClaims: ["CLM-SPK-002", "CLM-SPK-008", "CLM-VOC-005"],
    assessment: ["comprehension", "production", "repair", "retention"],
  },
  {
    id: "CAP-005",
    title: "Ask simple information",
    learnerJob: "Ask one clear question to get basic personal or situational information.",
    prerequisites: ["CAP-002", "CAP-003"],
    functions: ["ask name", "ask origin", "ask simple context detail"],
    chunks: ["What's your name?", "Where are you from?", "What do you do?"],
    vocabulary: ["what", "where", "from"],
    grammarPatterns: ["high-frequency wh-question frames"],
    pronunciationFocus: ["question rhythm"],
    listeningDemands: ["recognise the expected information type in the answer"],
    evidencePrinciples: ["PRN-003", "PRN-054", "PRN-001"],
    evidenceClaims: ["CLM-VOC-001", "CLM-SPK-007", "CLM-FND-001"],
    assessment: ["retrieval", "production", "retention"],
  },
  {
    id: "CAP-006",
    title: "Answer simple information",
    learnerJob: "Give a short relevant answer about yourself or the immediate context.",
    prerequisites: ["CAP-002", "CAP-005"],
    functions: ["answer name", "answer origin", "answer role/context"],
    chunks: ["I'm …", "I'm from …", "I work in …"],
    vocabulary: ["from", "work", "in"],
    grammarPatterns: ["short first-person answer frames"],
    pronunciationFocus: ["content-word prominence"],
    listeningDemands: ["map a question cue to the requested information"],
    evidencePrinciples: ["PRN-003", "PRN-054", "PRN-001"],
    evidenceClaims: ["CLM-VOC-001", "CLM-SPK-002", "CLM-FND-001"],
    assessment: ["comprehension", "retrieval", "production", "retention"],
  },
  {
    id: "CAP-007",
    title: "Express a simple need or problem",
    learnerJob: "State one immediate need/problem and make a simple request.",
    prerequisites: ["CAP-003", "CAP-006"],
    functions: ["state problem", "request help"],
    chunks: ["I need …", "I can't …", "Can you help me?"],
    vocabulary: ["need", "help", "can"],
    grammarPatterns: ["I need …", "I can't …", "Can you …?"],
    pronunciationFocus: ["clear key-word stress"],
    listeningDemands: ["recognise a response that solves or clarifies the problem"],
    evidencePrinciples: ["PRN-050", "PRN-054", "PRN-058"],
    evidenceClaims: ["CLM-SPK-001", "CLM-SPK-002", "CLM-SPK-008"],
    assessment: ["retrieval", "production", "repair", "retention"],
  },
  {
    id: "CAP-008",
    title: "Sustain and repair a short interaction",
    learnerJob: "Handle several short turns, recover from one breakdown, and still complete the communicative job.",
    prerequisites: ["CAP-002", "CAP-003", "CAP-004", "CAP-005", "CAP-006", "CAP-007"],
    functions: ["respond contingently", "repair", "continue", "close"],
    chunks: ["Sorry, could you say that again?", "So, that's …?", "Got it.", "Thanks."],
    vocabulary: ["again", "mean", "thanks"],
    grammarPatterns: ["recycled frames from prerequisite capabilities"],
    pronunciationFocus: ["turn-level intelligibility"],
    listeningDemands: ["follow multiple short contingent turns"],
    evidencePrinciples: ["PRN-040", "PRN-045", "PRN-056", "PRN-058", "PRN-002"],
    evidenceClaims: ["CLM-TRN-001", "CLM-TRN-006", "CLM-SPK-006", "CLM-SPK-008", "CLM-VOC-005"],
    assessment: ["comprehension", "production", "repair", "transfer", "retention"],
  },
];
