# GitHub Benchmark cho AtoEnglish

> Chốt nghiên cứu: 2026-08-01
>
> Phạm vi: AI coding workflow, curriculum, lesson authoring, SRS, speech, IELTS, content QA, research, accessibility và analytics.

## 1. Phạm vi và giới hạn

Không tồn tại một danh sách hữu hạn gồm "tất cả repo phù hợp" trên GitHub. Repo mới xuất hiện, repo cũ đổi giấy phép và số sao không chứng minh hiệu quả học tập. Benchmark này dùng một corpus đại diện, ưu tiên repo có ít nhất một trong các đặc điểm sau:

- Có kiến trúc hoặc data model dùng được cho AtoEnglish.
- Có test, eval, trace hoặc publication gate kiểm chứng được.
- Có quy trình curriculum/content rõ ràng.
- Có mô hình AI an toàn hơn việc sinh nội dung rồi publish trực tiếp.
- Có liên quan trực tiếp tới người học ngoại ngữ, IELTS hoặc self-study.

Mỗi repo được đánh giá theo bảy trục:

| Trục | Điểm tối đa | Câu hỏi chính |
|---|---:|---|
| Phù hợp mục tiêu | 20 | Có giúp người Việt A0 tiến bộ thật không? |
| Cơ sở giáo dục | 20 | Có alignment, retrieval, output, feedback hoặc delayed assessment không? |
| Chất lượng kỹ thuật | 15 | Có type/schema, test, CI và ranh giới module rõ không? |
| Data và khả năng kiểm chứng | 15 | Có stable ID, event/review log và provenance không? |
| AI safety/evaluation | 15 | Có structured output, golden set, trace và fail-closed không? |
| Bảo trì | 10 | Còn hoạt động, tài liệu đủ rõ và cộng đồng có thật không? |
| Giấy phép | 5 | Có thể tái sử dụng hợp pháp không? |

Quy tắc loại trừ:

- Không có giấy phép: chỉ tham khảo ý tưởng, không sao chép code hoặc nội dung.
- Chấm phát âm bằng transcript similarity: không được gọi là pronunciation score.
- Điểm IELTS không có tập chuẩn do giám khảo gán nhãn: không dùng làm bằng chứng band.
- Agent tự commit, push, merge, deploy hoặc publish content: không dùng cho dự án này.
- Demo dùng XP, streak hoặc completion làm mastery: không dùng làm thước đo năng lực.

## 2. Kết luận điều hành

AtoEnglish không cần ghép nhiều framework lớn. Bộ pattern có tác động cao nhất là:

1. **Spec Kit + OpenSpec:** mọi thay đổi bắt đầu từ outcome, phạm vi, acceptance criteria và task nhỏ.
2. **Aider + SWE-agent:** agent chỉ được cấp context cần thiết; mọi lần chạy phải để lại diff, lệnh kiểm tra và kết quả.
3. **Oppia + Learning Equality Studio:** lesson là nội dung có trạng thái, schema, validation và reviewer độc lập.
4. **Lumen:** AI authoring chia thành researcher, drafter, critic và reviser; lưu model, prompt, token, latency và lỗi.
5. **KoalaCards + ts-fsrs:** lưu cả trạng thái card và review log theo stable item ID.
6. **Playwright + axe-core:** test workflow thật và accessibility; automated accessibility không thay manual review.
7. **ASReview + Zotero:** nghiên cứu có protocol, nguồn, tiêu chí chọn/loại và claim registry.

Không cài BMAD, OpenHands, Langfuse, Open edX, Kolibri, H5P, PostHog hoặc GrowthBook trong pilot A0. Chúng giải quyết bài toán lớn hơn nhu cầu hiện tại và làm tăng vận hành trước khi learning loop được chứng minh.

## 3. AI tổ chức và viết code

| Repo | Điều đáng học | Áp dụng cho AtoEnglish | Quyết định |
|---|---|---|---|
| [GitHub Spec Kit](https://github.com/github/spec-kit) | Constitution, spec, clarify, plan, tasks, analyze, implement | Change packet có non-goals, acceptance tests và cross-check trước code | Áp dụng ngay |
| [OpenSpec](https://github.com/Fission-AI/openspec) | Proposal/spec/design/tasks gọn, hợp brownfield | Mỗi vertical slice có proposal và delta spec nhỏ | Áp dụng ngay |
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | Tách vai trò analyst, architect, developer, QA | Mượn role separation và independent review | Chỉ học pattern; framework quá nặng |
| [Aider](https://github.com/Aider-AI/aider) | Repo map, diff rõ, lint/test sau edit, Git-aware | Chỉ nạp file liên quan; ghi rõ test nào đã chạy | Áp dụng ngay |
| [SWE-agent](https://github.com/SWE-agent/SWE-agent) | Trajectory gồm thought/action/observation và config tái lập | Evidence log cho task khó và lỗi lặp lại | Áp dụng có chọn lọc |
| [OpenHands](https://github.com/OpenHands/OpenHands) | Runtime cô lập và agent sandbox | Giữ nguyên tắc isolation; không cài platform | Hoãn |
| [Continue](https://github.com/continuedev/continue) | Rules/prompts sống cùng repo | Quy tắc dự án nằm trong `AGENTS.md` và docs SSOT | Pattern đã có |

### Quy trình AI chuẩn của AtoEnglish

`research -> change packet -> implementation -> deterministic checks -> independent review -> human approval`

Một agent có thể đảm nhiệm nhiều vai, nhưng không được tự phê duyệt output của chính nó trong cùng context. Reviewer phải đọc requirement và diff từ đầu, tìm regression và xác nhận từng acceptance criterion bằng evidence.

## 4. Curriculum và lesson engine

| Repo | Điều đáng học | Không được sao chép | Thời điểm |
|---|---|---|---|
| [Mandarin Learning App](https://github.com/Andreaswt/mandarin-language-learning-app) | Mobile-first, một hoạt động mỗi màn hình, course data có chapter/lesson/question | Repo không có license; JSON bị cast thiếu runtime validation; transcript similarity không phải phát âm | A0 UI pattern ngay |
| [LibreLingo](https://github.com/kantord/LibreLingo) | Course-as-data, YAML -> validation -> build artifact, metadata ngôn ngữ và content license | Repo đã archive và dùng AGPL; không đưa engine vào codebase | Content pipeline pattern |
| [KoalaCards](https://github.com/RickCarlino/KoalaCards) | FSRS, review log, speaking/writing flow, owner-scoped data | Không bê nguyên product surface | SRS và feedback ngay |
| [Trane](https://github.com/trane-project/trane) | Course/lesson/exercise graph, prerequisites và reward propagation | AGPL và scheduler phức tạp quá mức cho pilot | B1+ hoặc khi có dữ liệu transfer |
| [Oppia](https://github.com/oppia/oppia) | Published-state validation, interaction allowlist, content ownership, learner-error tasks | Không cần graph exploration engine đầy đủ | QA gate ngay |
| [Learning Equality Studio](https://github.com/learningequality/studio) | Authoring/staging tách khỏi learner runtime, content nodes, assessment items, accessibility labels | Không xây CMS lớn trong pilot | Data model pattern |
| [Kolibri](https://github.com/learningequality/kolibri) | Offline-first delivery cho môi trường hạn chế | Platform quá lớn; AtoEnglish chưa có nhu cầu offline package | Nghiên cứu sau pilot |
| [H5P](https://github.com/h5p/h5p-php-library) | Semantic schema, sanitization, reusable activity types | Không thêm runtime/plugin system mới | Pattern activity schema |
| [Adapt Framework](https://github.com/adaptlearning/adapt_framework) | Responsive course authoring và plugin boundaries | Quá nặng cho lesson player hiện tại | Hoãn |
| [Open edX](https://github.com/openedx/edx-platform) | Mature authoring/publish/assessment separation | LMS architecture không phù hợp MVP tự học | Không áp dụng trực tiếp |

### Context-based learning, chỉ từ A2 trở lên

[Lute](https://github.com/LuteOrg/lute-v3), [LinguaCafe](https://github.com/simjanos-dev/LinguaCafe), [WordPecker](https://github.com/baturyilmaz/wordpecker-app), [Yomitan](https://github.com/yomidevs/yomitan), [asbplayer](https://github.com/killergerbah/asbplayer) và [Jiten](https://github.com/Sirush/Jiten) cho thấy giá trị của reader, sentence mining, subtitle và từ vựng trong ngữ cảnh. Chúng phù hợp khi người học đã có nền đủ để chọn input. Với A0, curriculum có hướng dẫn và controlled output vẫn phải là đường chính.

## 5. SRS, mastery và learning analytics

| Repo/spec | Pattern nên dùng | Ranh giới |
|---|---|---|
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | Lưu FSRS card và review log; validate persisted parameters ở boundary | Không tự đổi tham số hoặc major version khi chưa có migration/test |
| [KoalaCards](https://github.com/RickCarlino/KoalaCards) | Ghi rõ review history đầy đủ hay một phần; không giả vờ legacy data hoàn chỉnh | SRS chỉ là retention evidence |
| [xAPI Spec](https://github.com/adlnet/xAPI-Spec) | Event có actor/action/object/result/time | `learning_attempts` đủ cho pilot; chưa cần full xAPI |
| [Learning Locker](https://github.com/LearningLocker/learninglocker) | Learning record store và event querying | Hạ tầng quá nặng cho 20 người pilot |

Mastery của AtoEnglish phải tổng hợp ít nhất bốn bằng chứng: retrieval đúng, delayed recall, output task và transfer task. Completion, XP và streak chỉ mô tả hành vi sử dụng.

## 6. AI authoring, feedback và evaluation

| Repo | Điều đáng học | Cảnh báo | Quyết định |
|---|---|---|---|
| [Lumen](https://github.com/ahmedEid1/lumen) | Researcher -> outliner -> critic -> reviser -> drafter; trace, cost, latency; golden JSONL | Một số fallback chấp nhận output yếu hoặc publish tiếp; AtoEnglish phải fail-closed | Áp dụng kiến trúc, không chép fallback |
| [Promptfoo](https://github.com/promptfoo/promptfoo) | Prompt/model comparison, assertions, CI và red-team | Thêm dependency chỉ khi feedback AI bước vào pilot | Chuẩn bị golden fixtures trước |
| [DeepEval](https://github.com/confident-ai/deepeval) | Dataset, metrics và regression eval | Python stack riêng tạo thêm vận hành | Chỉ học pattern |
| [Langfuse](https://github.com/langfuse/langfuse) | Trace, prompts, datasets, evaluation | Self-hosting quá nặng ở giai đoạn A0 | Hoãn |
| [Instructor](https://github.com/instructor-ai/instructor) | Structured output, validation và retry | AtoEnglish đã có Zod; không cần dependency trùng chức năng | Không thêm |
| [OpenAI Knowledge Retrieval](https://github.com/openai/openai-knowledge-retrieval) | Config-first ingest/retrieval/eval, JSONL có source locator và citation | Chỉ cần khi xây trợ lý research/content có RAG | Pattern provenance |

Mọi `FeedbackResult` phải có `status`, `source`, `evidence` và evaluator version. Parse lỗi, model timeout hoặc thiếu evidence phải trả `unavailable`/`unscored`; tuyệt đối không điền điểm trung tính, điểm tối đa hoặc lời giải placeholder.

## 7. IELTS Writing và Speaking

| Repo | Điều đáng học | Lỗi/rủi ro | Quyết định |
|---|---|---|---|
| [Examinai](https://github.com/lengvietcuong/examinai) | Tách bốn tiêu chí writing, structured result, corrected essay và diff | Không có license; có normalization có thể suy ra band 9 khi thiếu weakness; chưa có calibration đáng tin cậy | Chỉ học UX/prompt decomposition |
| [OpenIELTS-AI](https://github.com/Shpaldik/OpenIELTS-AI) | Nói rõ không phải examiner, yêu cầu evidence từ bài viết, coi learner input là untrusted | Repo nhỏ, chưa chứng minh độ chính xác | Mượn prompt contract |

Chưa tìm thấy repo IELTS mã nguồn mở nào chứng minh được calibration đủ mạnh với hai giám khảo độc lập. Vì vậy:

- Không hiển thị IELTS band từ AI trước khi có expert-labeled gold set.
- Gate đề xuất: MAE không quá 0,5 band và ít nhất 90% kết quả nằm trong ±0,5 so với consensus của hai reviewer.
- Trước gate, UI chỉ đưa feedback theo tiêu chí, trích evidence và ghi `ước lượng chưa hiệu chuẩn` nếu thật sự cần.

## 8. Speech và pronunciation

| Repo | Năng lực thật | Ứng dụng đúng |
|---|---|---|
| [Whisper](https://github.com/openai/whisper) | Automatic speech recognition | Transcript và evidence về từ nhận diện được |
| [WhisperX](https://github.com/m-bain/whisperX) | Alignment và word-level timestamps | Timing evidence cho shadowing |
| [Montreal Forced Aligner](https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner) | Forced alignment với acoustic model và pronunciation dictionary | Phân tích timing/segment trong pipeline nghiên cứu |
| [SpeechBrain](https://github.com/speechbrain/speechbrain) | Research toolkit cho speech/audio | Prototype nghiên cứu, không đưa thẳng vào web pilot |

ASR trả lời "hệ thống nghe ra câu gì". Forced alignment trả lời "âm/từ nằm ở đâu trong tín hiệu". Không công cụ nào tự động biến kết quả đó thành pronunciation hoặc IELTS band đáng tin cậy nếu chưa hiệu chuẩn với người chấm chuyên môn.

## 9. Research và evidence management

| Repo | Pattern | Áp dụng |
|---|---|---|
| [ASReview](https://github.com/asreview/asreview) | Active-learning systematic screening, human remains oracle, reproducible runs | Dùng ngoài app khi literature corpus lớn |
| [Zotero](https://github.com/zotero/zotero) | Thu thập, tổ chức, deduplicate và cite nguồn | Source library cho curriculum/research |

Mỗi claim giáo dục trong tài liệu phải có record gồm:

```text
claim_id, claim, source_type, title, author_or_org, url_or_doi,
published_at, accessed_at, locator, evidence_summary, limitations, review_status
```

Ưu tiên nguồn theo thứ tự: official standard/rubric -> systematic review/meta-analysis -> peer-reviewed primary study -> authoritative implementation guide -> repo/documentation. GitHub repo là bằng chứng về implementation pattern, không phải bằng chứng rằng phương pháp giúp người học đạt IELTS 6.5.

### Protocol nghiên cứu bắt buộc

1. **Đặt câu hỏi:** viết population, intervention, comparison và outcome nếu phù hợp; ví dụ người Việt trưởng thành A0, self-study có corrective feedback, so với bài không feedback, đo delayed speaking transfer.
2. **Chốt protocol trước search:** database/repo cần tìm, query, khoảng thời gian, ngôn ngữ, inclusion/exclusion criteria và outcome quan trọng.
3. **Thu thập:** lưu DOI/URL, metadata, abstract và full-text status trong Zotero; deduplicate trước screening.
4. **Screening:** AI có thể xếp hạng và tóm tắt, nhưng người nghiên cứu quyết định include/exclude và ghi lý do.
5. **Extraction:** lấy sample, context, intervention, duration, outcome, effect/uncertainty, limitations và exact locator; không chỉ chép kết luận của abstract.
6. **Synthesis:** tách evidence trực tiếp, evidence gián tiếp và design inference. Không gộp nghiên cứu trẻ em, lớp học có giáo viên hoặc ngoại ngữ khác thành kết luận chắc chắn cho adult Vietnamese self-study.
7. **Translation to product:** mỗi recommendation phải chỉ ra feature/lesson decision, expected mechanism, measurement và kill criterion.
8. **Review/update:** claim rủi ro cao cần hai người kiểm tra; rà soát nguồn chính thức và software dependency ít nhất mỗi sáu tháng hoặc trước release liên quan.

### Nhật ký search tối thiểu

```text
research_question:
searched_at:
source/database:
exact_query:
filters:
results_count:
included_ids:
excluded_summary:
reviewer:
```

AI không được tạo citation từ trí nhớ rồi điền URL sau. Nếu không mở được source hoặc không xác nhận được locator, claim phải giữ trạng thái `unverified`.

## 10. Accessibility, browser QA và experimentation

| Repo | Pattern | Quyết định |
|---|---|---|
| [Playwright](https://github.com/microsoft/playwright) | Trace, DOM snapshot, desktop/mobile workflow | Đã có; bắt buộc cho luồng học chính |
| [axe-core](https://github.com/dequelabs/axe-core) | Automated WCAG rules | Nên thêm sau khi xác nhận dependency; vẫn cần manual keyboard/screen-reader review |
| [GrowthBook](https://github.com/growthbook/growthbook) | Feature flags và controlled experiments | Quá sớm cho pilot 20 người |
| [PostHog](https://github.com/PostHog/posthog) | Product analytics, flags, replay | Hoãn vì privacy và chi phí vận hành; dùng attempts + SQL trước |

## 11. Ma trận áp dụng cho AtoEnglish

### Áp dụng ngay, không thêm framework lớn

- Change packet theo Spec Kit/OpenSpec cho từng vertical slice.
- Independent review và requirement-by-requirement evidence.
- Lesson schema có version, stable ID, source refs và publication status.
- Automated lesson QA + pedagogical reviewer + pilot trước publish.
- Append-only attempt/review log và fail-closed feedback.
- Golden JSONL cho AI feedback, deterministic fixtures cho CI.
- Playwright desktop/mobile cho đường học và manual accessibility checklist.
- Claim registry cho mọi quyết định curriculum có ảnh hưởng lớn.

### Nghiên cứu hoặc thử nghiệm sau foundation pilot

- Promptfoo khi AI writing/speaking feedback có đủ gold examples.
- axe-core khi bổ sung test dependency được duyệt.
- Reader/sentence mining ở A2.
- Forced alignment khi có bộ audio và evaluator chuyên môn.
- RAG research assistant khi source registry đủ sạch.

### Không làm trong giai đoạn hiện tại

- Agent daemon 24/7 tự chọn task, push hoặc deploy.
- Full LMS/CMS, xAPI LRS hoặc self-hosted observability stack.
- AI tự publish bài học.
- AI IELTS band hoặc pronunciation score không hiệu chuẩn.
- Gamification được dùng như bằng chứng mastery.
- Sao chép code/content từ repo không có license hoặc license không tương thích.

## 12. Definition of Done cho một thay đổi do AI thực hiện

Một task chỉ hoàn tất khi có đủ:

1. Learner outcome và non-goals rõ ràng.
2. Source/evidence cho quyết định pedagogy liên quan.
3. Diff chỉ nằm trong scope đã nêu.
4. Test được thêm cùng thay đổi production không tầm thường.
5. Typecheck, lint, unit/content tests và build phù hợp đều pass.
6. Playwright desktop/mobile nếu thay đổi luồng người dùng.
7. Reviewer độc lập đối chiếu từng acceptance criterion.
8. Không còn fabricated score, silent fallback hoặc unverified mastery claim.
9. Human phê duyệt trước merge, migration production, deploy hoặc content publish.

## 13. Thứ tự triển khai đề xuất

1. Chuẩn hóa workflow trong `AGENT_AUTOPILOT.md` thành controlled AI workflow.
2. Dùng `LessonSpecV1` và QA gate cho sáu bài mẫu vàng.
3. Hoàn thiện attempts + FSRS review evidence và delayed checkpoint.
4. Tạo golden fixtures cho deterministic grading và AI explanation.
5. Pilot 28 ngày; phân tích completion, 7-day recall và transfer.
6. Chỉ sau pilot mới quyết định thêm AI eval tooling, accessibility dependency hoặc context reader.

## 14. Code evidence đã đọc sâu

Các kết luận rủi ro cao không chỉ dựa trên README. Những file sau là điểm kiểm tra lại khi benchmark được refresh:

- Mandarin Learning App: [course data type](https://github.com/Andreaswt/mandarin-language-learning-app/blob/main/constants/CourseData.ts), [lesson player](https://github.com/Andreaswt/mandarin-language-learning-app/blob/main/components/lesson/LessonContent.tsx), [course JSON](https://github.com/Andreaswt/mandarin-language-learning-app/blob/main/assets/data/course_content.json).
- LibreLingo: [course schema example](https://github.com/kantord/LibreLingo/blob/main/courses/test-1/course.yaml).
- KoalaCards: [FSRS review log](https://github.com/RickCarlino/KoalaCards/blob/main/koala/fsrs/review-log.ts).
- SWE-agent: [trajectory format](https://github.com/SWE-agent/SWE-agent/blob/main/docs/usage/trajectories.md).
- BMAD: [workflow map](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/docs/reference/workflow-map.md).
- Lumen: [agentic authoring workflow](https://github.com/ahmedEid1/lumen/blob/main/docs/agentic-authoring.md), [golden fixture loader](https://github.com/ahmedEid1/lumen/blob/main/apps/backend/app/evals/golden.py), [LLM call trace model](https://github.com/ahmedEid1/lumen/blob/main/apps/backend/app/models/llm_call.py).
- Examinai: [writing assessment route](https://github.com/lengvietcuong/examinai/blob/main/app/api/writing/assess/route.ts).
- OpenIELTS-AI: [writing config](https://github.com/Shpaldik/OpenIELTS-AI/blob/main/configs/writing-task-2.yaml), [prompt contracts](https://github.com/Shpaldik/OpenIELTS-AI/blob/main/src/prompts.ts).

Benchmark này là tài liệu quyết định, không phải lời khuyên nhập toàn bộ dependency. Trước mỗi lần tái sử dụng code, phải kiểm tra lại commit, license và tình trạng bảo trì tại thời điểm thực hiện.
