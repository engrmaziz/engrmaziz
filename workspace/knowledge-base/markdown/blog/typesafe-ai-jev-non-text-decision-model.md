---
title: "Jev: TypeSafe AI’s Non-Text Decision Model"
description: "Jev returns typed choices, scores, and probabilities in one pass. Use it for routing and game logic, not for prose."
category: "Decision Models"
date: "2026-09-22"
author: "Engr. Musharraf Aziz"
readingTime: "12 min read"
difficulty: "Advanced"
featured: true
coverImage: "/images/blog/cover-jev.webp"
coverAlt: "Cyan question lattice resolving into gold choice, score, and confidence glyphs on a navy grid"
directAnswer: "Jev is a transformer that refuses to write text. TypeSafe AI, led by former OpenAI RLHF researcher Diogo Almeida, describes it as a System 1 model: it scores a fixed set of questions against state in one parallel pass and returns choices, numeric scores, and probabilities with a confidence rating. Public figures put latency at 70–500 ms and input cost near $0.042 per million tokens, with outputs priced at zero. Those numbers are vendor-reported. Measure them on your own traffic before you budget a product around them."
tags:
  - Jev
  - TypeSafe AI
  - decision models
  - agent routing
  - typed outputs
related_services:
  - ai-agents/ai-call-agents
faqs:
  - q: "What is Jev from TypeSafe AI?"
    a: "Jev is a transformer decision model that does not generate text. It evaluates predefined questions against state in one parallel pass and returns typed choices, scores, and probabilities with a confidence rating."
  - q: "When should you use Jev instead of a chat model?"
    a: "Use it when the next step is a closed decision: route, click, wait, score, or pick among known actions. Keep a language model for anything that must be written in sentences."
  - q: "Are Jev’s latency and price figures guaranteed?"
    a: "No. The 70–500 ms band and roughly $0.042 per million input tokens are figures reported with the launch. Confirm them on your payload size, region, and question count."
---

> **Jev does not write.** It classifies a fixed question set against state and returns typed primitives. That is the whole product, and it is why routing, game logic, and sub-second agent steps are the fit — not emails, summaries, or support replies.

## Understanding Jev

A chat model is an autoregressive writer. Every extra token is another sample, another chance to drift, and another parse step if you asked for JSON. Jev, launched out of stealth by TypeSafe AI, drops that loop. Diogo Almeida, who previously worked on RLHF at OpenAI, has framed it as a System 1 model: fast judgment over a question you already wrote, not a System 2 essay.

The engineering claim is specific. You define the questions. The model sees state — a game frame, a tool trace, a router payload — and answers every question in one forward pass. The return type is a primitive: a choice, a score, a probability, plus a confidence rating. There is no sentence to regex.

People noticed it because the economics flip. Reported latency sits in a 70–500 ms band. Reported input price is about $0.042 per million tokens, and outputs are described as free because there is no generated token stream to bill. Treat both as launch claims. A 500 ms tail is a different product from a 70 ms median, and “free outputs” only helps if your cost was the completion, not the prompt.

Public demos have used it for high-frequency routing and for game loops in the spirit of classic shooters and platformers: the model picks an action from a legal set instead of narrating what it might do. That is the right test. If the action set is closed, a writer is the wrong machine.

## The engineering framework

Three constraints decide whether Jev belongs in a stack.

**The action set is finite.** “Transfer to billing,” “press jump,” “retry the tool,” “abstain.” If the correct behavior is a paragraph, Jev is the wrong call. Pair it with a writer only on the branch that needs words. The [split computer-use stack](/blog/decoupled-architectures-computer-use-agents) is the pattern: a fast decision model for the click, a large model for the sentence.

**The question is stable.** You are not discovering the schema at runtime. Product, eval, and legal review the questions before traffic hits them. That is also how you stop a “helpful” model from inventing a fourth option.

**Confidence is a control, not a badge.** A low confidence rating should fall through to a human, a rules engine, or a slower model. If you ignore it, you have rebuilt a classifier without a reject option.

![Flow chart of Jev: live state enters one forward pass and exits as choice, score, and confidence](/images/blog/diagram-jev.webp)

For California clinics and Florida service desks, the practical version is a voice or chat router that must pick a queue in well under a second. A prose model that “explains” the route adds latency and a parse failure mode. A typed decision does not. I build those routers as [production call-agent systems](/services/ai-agents/ai-call-agents), remote, with Pacific and Eastern overlap — the decision model is a component, not the whole agent.

## What one forward pass changes

An autoregressive model is a sequence of bets. The first token conditions the second, the second conditions the third, and a router that asked for a label still has to read a sentence, find the label, and hope the sentence did not add a caveat. Jev’s claim is that the bet happens once. Every question in the set is scored against the same state, in parallel, and the only legal outputs are the primitives you declared: a choice, a score, a probability, and a confidence rating.

That changes the failure you can have. You can still pick the wrong queue. You cannot pick a queue that was not in the list, because there is no text channel in which to invent one. You also stop paying an output-token tax on a decision that was never supposed to be prose. The launch figures — roughly 70 to 500 milliseconds, and about $0.042 per million input tokens with outputs described as free — are the vendor’s account of that shape. They are not a measurement I took on your traffic. A long state blob, a long question list, or a far region will move both the latency and the bill.

The useful mental model is a clerk with a printed form, not a novelist with a blank page. The form is the product. If you keep editing the form in the hot path, you have left the regime the model is for.

## A router you can score on Monday

Take a voice or chat front door with six legal destinations: billing, scheduling, a human, a recorded answer, a retry, and abstain. Write one question per destination, plus one question for “none of these fit.” Freeze that list. For a day, log the state you would have sent — the last user turn, the account flags you already trust, the hour, the queue depths — and the primitive that came back.

Score three rates and nothing else. Right destination, wrong destination, abstain. Do not average them into a single “accuracy” number that hides a model which never abstains. A system that is confidently wrong is worse than a system that hands the turn to a person. Confidence is the switch for that handoff. If the rating is low, the next step is a rule or a human, not a second call that asks the same model to “try harder” in sentences.

I use this shape inside [production call-agent systems](/services/ai-agents/ai-call-agents) for teams that need a queue decision before the caller notices a pause. The language model still writes the sentence the caller hears. It does not choose the queue. That split is the same idea as the [decoupled computer-use stack](/blog/decoupled-architectures-computer-use-agents), applied to a phone line instead of a mouse.

## Game loops, without borrowing a character

The demos that traveled farthest were game loops: a closed action set, a frame of state, a next action. Think “move, turn, fire, wait,” not a paragraph about the level. That is a fair test of a non-text model, and it is why people reached for classic shooter and platformer loops. The lesson for a product team is the action set, not the costume. If your agent’s next step is one of twelve tools, you have a game loop with a worse name. If the next step is an email, you do not.

Sub-second here means the decision, not the whole product. Speech recognition, telephony, and a spoken reply still take time. The decision model’s job is to stop adding a multi-second writing pass in the middle of a choice that was closed before the call started.

## Open reproductions and what they do not copy

APUS OpenJev and the other open sketches are useful because they show the interface: questions in, primitives out, no completion string to parse. They do not automatically copy calibration. A confidence number from one stack is not a probability from another until you measure it on the same traces. Tokenization of “state” can differ. Latency will differ. Treat a reproduction as a way to learn the contract and to run tests without a bill. Treat the hosted model you will actually call as a separate system with its own p50, p95, and abstain rate.

If the question set changes every hour, neither the hosted model nor the reproduction will save you. You are asking for a schema the eval team has not seen. Freeze the questions, version them, and put the version id in the log next to the primitive. Six months from now that is the only way to explain why Tuesday’s router behaved differently from Monday’s.

## Key attributes and checklist

Before you swap a chat completion for Jev, or for an open reproduction such as the APUS OpenJev line people are circulating, run this list.

1. Write the question set on paper. If you cannot list every legal answer, you do not have a decision problem.
2. Log state, question, primitive, and confidence. You cannot eval what you did not store.
3. Measure p50 and p95 latency on your payload, in the region your users actually hit.
4. Price the input tokens at your real prompt size. Ignore the headline until the invoice matches.
5. Define the abstain path. Low confidence goes somewhere that is not a silent guess.
6. Keep a language model behind an explicit gate for prose. Do not ask the decision model to apologize.
7. Replay a day of production traces. Hallucinated menu items should be impossible; wrong menu items should be countable.

Open reproductions are useful for learning the interface. They are not a substitute for measuring the hosted model you will pay for. Weights, tokenization of “state,” and how confidence is calibrated can diverge even when the API shape looks the same.

## A week of rollout, written as a sequence

Day one is the question list and nothing else. Sit with the person who owns the queue and write every legal next step, including abstain. If the meeting produces a step you cannot name in four words, that step is prose and it does not belong on this model. Version the list. Put the version in the repo next to the prompt, not in a chat thread.

Day two is the log. State in, primitive out, confidence, latency, and the version id. No dashboard yet. If you cannot reconstruct one decision from the log, you are not ready for traffic. Day three is a shadow. The current router keeps serving. Jev, or the reproduction you are using to learn the shape, answers in parallel and writes the log. You do not let it steer. You count disagreements.

Day four you read the disagreements with the queue owner, not with the model. Some are labeling bugs in your old router. Some are questions you wrote badly. Fix the questions before you blame the weights. Day five you turn on the abstain path only: low confidence goes to the existing human or rules path, high confidence is still shadow. You are testing the handoff, not the heroics.

Only after that week do you let high-confidence primitives steer a single destination, during hours you can watch. Pacific overlap for a California desk, Eastern overlap for a Florida desk, which is the window I already keep for remote builds. Expand destination by destination. Never flip the whole menu because a demo felt fast. The reported 70–500 ms band is a reason to measure your p95, not a reason to skip the shadow week.

If the shadow week shows the model inventing nothing and still picking the wrong queue often, you have a features problem or a label problem. Adding a prose model in front of it will not repair the labels. It will add a parser. Keep the form. Fix the form.

## Frequently asked questions

### What is Jev from TypeSafe AI?

Jev is a transformer decision model that does not generate text. It evaluates predefined questions against state in one parallel pass and returns typed choices, scores, and probabilities with a confidence rating.

### When should you use Jev instead of a chat model?

Use it when the next step is a closed decision: route, click, wait, score, or pick among known actions. Keep a language model for anything that must be written in sentences.

### Are Jev’s latency and price figures guaranteed?

No. The 70–500 ms band and roughly $0.042 per million input tokens are figures reported with the launch. Confirm them on your payload size, region, and question count.

If you are designing that router for a California or Florida operation and want the decision path separated from the prose path, [send the channel and the action set](/contact?intent=freelance). The first question is always whether the action set is actually closed.
