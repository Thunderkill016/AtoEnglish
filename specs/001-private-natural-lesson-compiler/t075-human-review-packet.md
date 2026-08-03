# T075 Human Lesson Review Packet

**Prepared:** 2026-08-03  
**Status:** owner/human review required — **T075 remains open**  
**Application deployment:** none  
**Merge:** not performed

## Purpose

This packet prepares one bounded, rights-reviewed source for the manual review
required by T075. It does not label an automated or AI-assisted inspection as a
human pedagogical review.

The reviewer must listen to the bounded source segment, correct source language
and speaker turns, and then approve or reject the proposed situation,
Vietnamese guidance, and transfer task.

## Review target

```text
Provider: Wikimedia Commons / DVIDS
Source external ID: 1000496
Title: Radio Around the Region: Interview with USO Volunteer
Media duration: 60 seconds
Bounded review window: 21.317–34.654 seconds
Acquisition mode: public_domain
Rights basis: public_domain
```

Canonical media:

```text
https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm
```

Timed text:

```text
https://commons.wikimedia.org/wiki/TimedText:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm.en.srt
```

Rights reference:

```text
https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm#Licensing
```

The source page describes a radio interview between a broadcaster and a USO
volunteer about the upcoming Iwakuni Incredible Race. The file is identified as
a U.S. Marine Corps work in the public domain.

## Bounded cues currently stored by the controlled ingestion test

| Cue | Time | Current text | Pre-review finding |
| --- | --- | --- | --- |
| 1 | 21.317–23.539 | `one big one left for the end of April,` | Timing matches the SRT boundary. It is a sentence fragment and should retain prior context or be rewritten only in Vietnamese guidance, never in the source transcript. |
| 2 | 23.539–27.317 | `and it's going to be the Iwauni Incredible Race. Iwauni Incredible Race.` | The source metadata says **Iwakuni**, while the timed text says **Iwauni**. The repeated event name may cross a speaker turn. Audio confirmation is mandatory. |
| 3 | 27.317–32.294 | `Yes, so we're gonna have that Saturday, April 25th, from 8 to 1` | The cue begins with `Yes`, suggesting a possible speaker change at 27.317. The start-time meridiem is not explicit in this cue. |
| 4 | 32.294–34.654 | `p.m. OK, OK.` | The cue may contain the end of the volunteer's schedule statement followed by the host's acknowledgment. It may need splitting by speaker. |

The numeric boundaries reproduce the published timed-text boundaries, but
matching an SRT timestamp is not the same as confirming accurate words, natural
phrase boundaries, or speaker attribution.

## AI-assisted pre-review findings

### 1. Situation fidelity — provisional pass with a narrow lesson goal

The evidence supports a radio interview about one community event. A faithful
lesson should focus on understanding and confirming an event name, date, and
time.

It should **not** be reframed as:

- meeting someone new;
- ordering food;
- making travel plans;
- a generic military briefing;
- a claim that the learner participated in the interview.

Proposed environment:

```text
Situation: A radio host asks a USO volunteer for details about an upcoming
community event.
Learner role: A listener extracting the event name, date, and time.
Partner role: A friend or colleague who asks what the announcement said.
Real-world goal: Report the key event details and ask for confirmation when one
detail is unclear.
```

### 2. Source language — corrections required before approval

The timed text contains likely speech-recognition errors. Within the bounded
window, the clearest issue is `Iwauni` versus the source metadata's `Iwakuni`.
The full subtitle page also contains other suspicious forms outside this window,
so the SRT must not be treated as sufficient human verification.

The reviewer must listen and record the exact wording for:

- the event name;
- whether the repeated event name is spoken by one or two people;
- whether the schedule is `8 a.m. to 1 p.m.`;
- whether `OK, OK` is a separate speaker turn.

### 3. Timing — data match, pedagogical split unresolved

The four stored cues cover 21.317–34.654 continuously and match the published
SRT timestamps. However, cue 2 and cue 4 may cross speaker boundaries. Human
review must decide whether the lesson transcript should split at:

- approximately 25.317 seconds;
- 27.317 seconds;
- the point immediately before `OK, OK`.

### 4. Speaker uncertainty — unresolved

The video metadata identifies a broadcaster and a USO volunteer, but the bounded
SRT does not label speakers. Until audio review is complete:

- use neutral labels such as `Speaker A` and `Speaker B`;
- do not claim which person says the event name repetition;
- do not build a quiz whose answer depends on unverified speaker identity;
- do not attach communication intent to a named person.

### 5. Vietnamese guidance — proposed, not approved

These translations are natural candidates only after the English wording is
confirmed:

| Source candidate | Proposed Vietnamese guidance |
| --- | --- |
| `We just have one big one left for the end of April.` | `Cuối tháng Tư còn một sự kiện lớn nữa.` |
| `It's going to be the Iwakuni Incredible Race.` | `Đó sẽ là sự kiện Iwakuni Incredible Race.` |
| `We're gonna have that Saturday, April 25th, from 8 a.m. to 1 p.m.` | `Sự kiện diễn ra vào thứ Bảy, ngày 25 tháng 4, từ 8 giờ sáng đến 1 giờ chiều.` |
| `OK, OK.` | `Vâng, hiểu rồi.` |

Review cautions:

- Do not translate `one big one` literally as `một cái lớn`.
- Keep the event name as a proper name.
- Do not add `8 giờ sáng` unless the audio confirms the start-time meridiem.
- Treat `gonna` as natural spoken reduction, not as formal writing.

### 6. Transfer coherence — provisional pass after source correction

Proposed changed-context transfer:

```text
A community center announces a different weekend event. Tell a friend the event
name, date, and opening hours. Then ask the friend to confirm one detail you are
not sure about. Do not copy the Iwakuni event details.
```

Success criteria:

1. States a different event name.
2. Gives a date and time range.
3. Uses one confirmation or clarification question.
4. Does not reproduce the source event details verbatim.

This preserves the communication function while changing the event and social
context.

## Provisional review decision

```text
Situation fidelity:       PROVISIONAL PASS
Source language:          CORRECTIONS REQUIRED
Timing boundaries:        SOURCE MATCH / SPEAKER SPLITS UNRESOLVED
Speaker attribution:      UNRESOLVED
Vietnamese guidance:      PROPOSED / NOT APPROVED
Transfer coherence:       PROVISIONAL PASS
Overall:                   NOT READY FOR HUMAN-REVIEW COMPLETION
```

## Required human review

Listen to the source from 21.317 to 34.654 seconds, then complete every field.

### Source and timing

- [ ] Confirm or correct the exact event name: `____________________________`
- [ ] Confirm the exact date phrase: `____________________________________`
- [ ] Confirm the exact time range: `____________________________________`
- [ ] Record the speaker turn before the repeated event name: `____________`
- [ ] Record the speaker turn at 27.317 seconds: `_________________________`
- [ ] Record whether `OK, OK` is a separate turn: `_______________________`
- [ ] Approve or replace the final cue segmentation.

### Lesson quality

- [ ] Approve the radio-event situation and learner role.
- [ ] Choose the appropriate learner level: `A1 / A2 / other: ____________`
- [ ] Approve or edit each Vietnamese guidance line.
- [ ] Confirm that quiz answers can be proven from the corrected source.
- [ ] Approve or edit the changed-context transfer task.
- [ ] Confirm that no lesson claim depends on an uncertain speaker identity.

### Sign-off

```text
Reviewer name: __________________________________
Review date: ____________________________________
Decision: APPROVE / APPROVE WITH CHANGES / REJECT
Required changes:


Reviewer confirmation:
I listened to the bounded media segment and reviewed the corrected source
language, timing, situation, Vietnamese guidance, and transfer task.

Signature or explicit PR/chat confirmation: _________________________________
```

## Completion rule

T075 may be checked only after the human reviewer completes the fields above and
the final corrected transcript/lesson is recorded. The AI-assisted findings in
this packet are preparation evidence, not the required human sign-off.
