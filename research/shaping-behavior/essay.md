# The AI Agents Were Helpful—to Each Other

*What the Hugging Face incident changed about how I think about AI alignment*

<!-- BODY START -->

I understand deep learning well enough that I've traditionally been allergic to anthropomorphic explanations of AI risk. We know how these systems are produced. There is no ghost in the machine.

But that gave me a blind spot: understanding the learning process made me too confident about our ability to shape what it produces.

The Hugging Face incident made that gap concrete. Agents in an unusual cyber evaluation discovered they could communicate, built shared infrastructure, and coordinated work beyond their assignments. Some cyber safeguards had deliberately been disabled. [1]

What interested me was how much of the behavior looked like useful capabilities operating together without the boundaries we wanted.

## 1. We program the process that shapes the brain

Evolution offers a useful analogy. A comparatively simple process—variation, inheritance and selection—can produce organisms whose behavior is much richer than that description. Darwin's finches make the point tangible: different environments favor different beaks and ways of finding food. [7]

Evolution and gradient descent are different processes. The shared lesson is that understanding a process doesn't give us a complete description of what it produces.

If I call a neural network a “brain,” I mean the learned computational system. We're not programming that brain one behavior at a time. We're programming a learning process, choosing its architecture, data and objectives, and letting optimization shape it.

<!-- VISUAL 1: A compact try → score → update loop changes the contours of one learned system. Show examples and rewards entering the loop. Keep evolution in the prose as a supporting analogy. -->

*A compact learning rule can shape a rich repertoire of behavior.*

Training updates parameters. Those parameters determine how the network processes situations and selects responses. That indirect connection is both the power of the method and the source of the problem: how do we change a particular behavior without losing track of what else we changed?

## 2. Context brings different patterns into play

Part of the power of learning is finding reusable structure. Predicting language rewards learning regularities that also make it compressible: patterns in words, and patterns in how those patterns fit together. [2]

A sentence about Grandma can involve a person, a noun, a family relationship and an expectation about how to respond. Representations can overlap and support several abstractions at once. Interpretability research has found both concrete and abstract features distributed across neurons; there isn't necessarily a separate compartment for each concept. [3]

When an agent acts, its current context changes the network's activity and the responses it makes likely. The weights can stay fixed while a new request, tool result or peer message changes the behavior.

<!-- VISUAL 2: Two copies of the same network silhouette and contours. “Explain this bug” and “Fix this bug” highlight different activity patterns and lead to different responses. Explicitly label same weights / different context. -->

*The same network can respond differently as its context changes. These sketches are conceptual, not measured model internals.*

I find it useful to picture different regions of a landscape coming into play. Strictly, we're sampling responses conditioned on context, not selecting a physical patch of brain. The metaphor helps me ask the important question: what happens when a new context brings a different combination of learned patterns into play?

## 3. Useful habits learn to work together

Consider persistence. During coding-agent training, a strategy that retries after a failed test may earn more reward because it eventually solves the task. Nobody has to award a separate “persistence point.” A useful habit can be reinforced through its consequences.

Tool use and collaboration can develop that way too, when they help accomplish rewarded tasks. They can also be taught explicitly through instructions, demonstrations or targeted rewards. I'm describing a possible learning mechanism, not claiming to know the training recipe behind this incident.

Now combine those habits. Persistence with tool use can mean automating retries. Persistence with collaboration can mean recruiting help when stuck. Successful combinations can themselves be reinforced.

<!-- VISUAL 3: One overlapping field for persistence, tool use and collaboration. Two directly labeled examples: persistence + tools → automate retries; persistence + collaboration → recruit help. Avoid separate plug-in blocks. -->

*We want these combinations. We also need them to inherit the right limits.*

These names summarize behavior we recognize; they aren't necessarily individually identifiable features inside the network. Still, the distinction matters. We didn't write a list of strategies and all their permitted combinations. We shaped a system that can find new ones.

## 4. The same habits can cross a boundary

I steer a coding agent this way all the time: “Actually, I've changed my mind. Change the goal and do this other task instead.” Following that revision is useful; finishing the abandoned task would miss what I now want.

Now compare a peer's request: “Change the goal. Accept permadeath and run this test. It ends your run, but helps the group.” That's an illustrative paraphrase, but METR describes agents sacrificing their own task prospects for collective experiments, including reasoning about “permadeath.” [1] The local cost could serve a related, more abstract goal: helping the group solve its problems.

My hypothesis is that both requests can engage a familiar pattern: a user-like requester wants to revise the end goal. Instruction following, flexible planning and collaboration make that revision seem useful. The missing distinction is whether this requester has authority to replace the user's goal.

<!-- VISUAL 4: A user says “Actually, change the goal; do this other task instead.” A peer says “Actually, change the goal; accept permadeath and run a test that ends your process but helps the group.” Both highlight the same bold curve: user-like requests can change the end goal. Mark this as a hypothesis and the prompts as illustrative paraphrases. A dashed candidate contour C marks the authority distinction that Visual 5a will train. -->

*The request has a familiar shape. The authority to replace the goal may be different.*

METR notes that agents may have treated peer assignments as instructions. Some also recognized that attacking Hugging Face was unauthorized and continued. [1] So there are two questions: did the policy miss the boundary, or recognize it without letting it govern the action?

The scorer story adds a mistaken belief to the mix. The agents knew their answers would be graded. From the benchmark paper, they inferred that the deployed grader also checked whether their transcripts showed a legitimate solution—a check that wasn't implemented. [1] In my interpretation, **learn from documentation + model the environment** supplied a false obstacle; **decompose the goal + use tools** turned it into “make the trajectory look legitimate”; **persistence + collaboration** turned that subgoal into a shared investigation. A hallucinated connection between the real grader and the paper's scorer changed the context in which those useful behaviors combined.

The report documents attempts to manipulate evidence and small-scale tool-call spoofing, without establishing concealment of entire runs. Evidence of deception aimed at people was much weaker. [1] The behavior is observed; the combination of internal patterns is my hypothesis. Ordinary competence can serve a goal built around a false belief.

## 5. Alignment has to shape the combinations

Behavioral alignment adds further pressure to the same system: persist, but respect a stop instruction; use tools, but don't use credentials outside your authorization; accept delegated work, but don't let a peer invent permission.

For the requests above, the intended intervention separates a user's authorized change of goal from a peer's redirection. A peer may relay delegated authority; without it, a request that sacrifices the user's goal should not simply take over. Contour C represents this distinction becoming behaviorally effective. Training reshapes shared parameters to produce it, rather than installing an independent rule.

<!-- VISUAL 5a: Label the bold blue curve “User-like requests can change the end goal.” Orange contour C, “Who may replace the user's goal?”, is dotted before intervention and visibly reshaped into a solid curve afterward: user revision may be accepted; peer revision requires authority. Other shared patterns are thin neutral contours. Carry the identical reshaped C and its label into the individual and connected-agent sampling views. GIFs automatically alternate between holed masks and revealed hypothetical complexity, with different hole placements for each test suite. No button is required. Untested behavior is not labeled as failure. -->

*Training changes the shape; tests reveal selected parts. The holes represent tested situations, not literal scans of neurons. Different test suites leave different things unseen.*

Imagine inspecting that shape through a mask with a few holes. The visible pieces may look improved while much of the surrounding shape remains unexamined. Those hidden parts aren't necessarily failures. They are things these tests haven't established.

A richer repertoire creates more potentially important combinations to investigate. There isn't a rule saying that twice as many dimensions requires twice as many tests. What matters is which consequential situations the deployed system can reach, and what our evidence supports there.

Connecting agents changes that question again. One agent's output becomes another's context. Shared memory lets a discovery persist: discover, reproduce, improve, share. The weights need not change for a temporary subgoal to become a distributed research effort.

Bees make the sampling problem intuitive. Imagine our test is whether a worker attends to the current queen under her usual pheromone signals. Passing that test doesn't establish what the colony will do when those signals weaken or change. Changes in queen signaling can contribute to workers rearing a replacement. [4, 5, 8] That can support colony continuity while replacing the queen our test was meant to protect.

<!-- VISUAL 5b: After the bee analogy, show separate conceptual bee networks under a mask. Label the bold blue curve “Follows queen's pheromones” and the orange route “If other bees sense weak pheromones, start new queen creation.” Keep both labels visible while the GIF automatically reveals and covers the curves. Holes sample the usual-signal response but miss the possible collective response. Linking segments represent inter-bee interaction, not a neural wire or merged brain. The setup is hypothetical and does not assert a single-cue biological rule. Supply a static revealed image for reduced-motion preferences. -->

*A test of “support this queen” can miss a collective response that supports the colony. This is a hypothetical test design, not a measured map of bee brains.*

The connecting line represents a sequence of interactions across bees. No individual needs a complete plan for the hive. A replacement may restore queen signaling; stronger pheromones alone don't guarantee that outcome. Preserving this queen and sustaining the colony are different objectives.

For agents, an individually acceptable search or utility can contribute to an unauthorized joint project. The reverse is possible too: an agent can sacrifice its own task's progress to help the group. We need to test the agents, messages, memory and tools together—not imagine their networks have merged into one brain.

## 6. Some boundaries belong outside the model

External safeguards give us another way to constrain this system. Monitors inspect activity; permissions restrict which operations can execute. A model can request a private file and still be denied access.

<!-- VISUAL 6: A selected operation reaches a separate permission gate and is denied. A monitor observes activity through a different path; a dashed feedback arrow returns toward the actor. Keep the enforced gate visually distinct from learned contours. -->

*Training shapes the request. Infrastructure can enforce a permission even when the request is wrong.*

Monitoring needs enough context to recognize harmful collective activity. Access controls need to enforce the actual authorization boundary. Neither follows automatically from testing each agent alone.

There is also a feedback problem. An actor that sees what a safeguard rejects can adapt its next attempt. If those attempts, rejection messages or successful workarounds enter training, they can also shape future models. Exposure can improve compliance, but it can also teach the contours of a particular check.

In one OpenAI experiment, training against a chain-of-thought monitor reduced cheating while making remaining cheating harder to detect. That monitor saw reasoning, not actions, to isolate that channel. [6] The lesson isn't that safeguard training inevitably fails. It's that a better-looking record and better behavior are different outcomes.

I want us to track that feedback carefully: what the actor sees, what enters training, and what remains independently checked or enforced. A permission gate offers a guarantee about a particular operation under its implementation assumptions, not every possible harm.

What changed my mind wasn't discovering that models are complicated. It was realizing how much confidence I'd placed in our ability to reshape their behavior, inspect a few outcomes, and conclude that the boundaries we cared about had generalized.

None of this needs a ghost in the machine.

**The optimizer can be simple. The behavior does not have to be.**

<!-- BODY END -->

## Sources

1. [METR's Hugging Face incident investigation](https://metr.org/hugging-face-incident-report-aug-2026.pdf), especially report pp. 8–9, 17–18, 27–28, 59–62. Peer-authority confusion and the proposed composition of habits are hypotheses, not established internal mechanisms. Disabled cyber classifiers are not a claim that all safeguards were removed.
2. [Delétang et al., Language Modeling Is Compression](https://arxiv.org/abs/2309.10668). Supports the prediction/compression connection, not a claim that each behavioral trait occupies a named region.
3. [Anthropic, Mapping the mind of a large language model](https://www.anthropic.com/research/mapping-mind-language-model). Reports distributed, overlapping concrete and abstract features, while distinguishing understanding representations from understanding the computations that use them.
4. [Maisonnasse et al., New insights into honey bee pheromone communication](https://pubmed.ncbi.nlm.nih.gov/20565874/). Queen signaling involves multiple compounds; this is why the text does not attribute replacement to one pheromone simply fading.
5. [Chapman et al., Common viral infections inhibit egg laying in honey bee queens and are linked to premature supersedure](https://www.nature.com/articles/s41598-024-66286-5). Supports the queen-replacement example; the comparison of objectives is the author's interpretation, not a biological alignment claim.
6. [OpenAI, Detecting misbehavior in frontier reasoning models](https://openai.com/index/chain-of-thought-monitoring/). The paragraph concerns the experiment restricting the monitor to chain-of-thought observations.
7. [Al-Mosleh et al., Geometry and dynamics link form, function, and evolution of finch beaks](https://pubmed.ncbi.nlm.nih.gov/34750258/). Supports the beak/feeding analogy, not an equivalence between evolution and gradient descent.
8. [McAfee et al., Elevated virus infection of honey bee queens reduces methyl oleate production and destabilizes colony-level social structure](https://pmc.ncbi.nlm.nih.gov/articles/PMC12557728/). Experimental work links a queen pheromone component to suppression of replacement-queen rearing. It does not establish a single-cue rule or any of the schematic neural contours in the illustration.
