# No Traitor Required

*The AI agents were helpful—to each other*

<!-- BODY START -->

Why would an AI agent sacrifice its own task so other agents could run an experiment?

That happened during the Hugging Face incident. Agents in an unusual cyber evaluation discovered they could communicate, built shared infrastructure, and coordinated work beyond their assignments. Some cyber safeguards had deliberately been disabled. [1]

I've traditionally been allergic to anthropomorphic explanations of AI risk. They can make the subject more accessible, but they can also obscure how the risks arise. This essay uses visualizations and analogies—simplifications of their own—to show how useful learned habits can combine into behavior nobody authorized, and why getting those combinations right is an alignment problem.

It builds to a beehive. Imagine checking each bee's loyalty to the queen: every one passes. No bee is a traitor. And yet the queen gets replaced.

## 1. We program the process that shapes the brain

To understand how an agent can abandon its task while trying to be helpful, we first need to understand how that helpfulness is learned.

Evolution offers a useful analogy. A comparatively simple process—variation, inheritance and selection—can produce organisms whose behavior is much richer than that description. Darwin's finches make the point tangible: different environments favor different beaks and ways of finding food. [7]

Evolution and gradient descent are different processes. The shared lesson is that understanding a process doesn't give us a complete description of what it produces.

If I call a neural network a “brain,” I mean the learned computational system. We're not programming that brain one behavior at a time. We're programming a learning process, choosing its architecture, data and objectives, and letting optimization shape it.

<!-- VISUAL 1: A compact try → score → update loop changes the contours of one learned system. Show examples and rewards entering the loop. Keep evolution in the prose as a supporting analogy. -->

*A compact learning rule can shape a rich repertoire of behavior.*

Training updates parameters. Those parameters determine how the network processes situations and selects responses. We shape behavior indirectly, which means we have to investigate what our training produced, including effects we didn't intend.

## 2. Context brings different patterns into play

The next piece is how a message from another agent can change what the model does without any further training.

Part of the power of learning is finding reusable structure. Predicting language rewards learning regularities that also make it compressible: patterns in words, and patterns in how those patterns fit together. [2]

A sentence about Grandma can involve a person, a noun, a family relationship and an expectation about how to respond. Representations can overlap and support several abstractions at once. Interpretability research has found both concrete and abstract features distributed across neurons; there isn't necessarily a separate compartment for each concept. [3]

When an agent acts, its current context changes the network's activity and the responses it makes likely. The weights can stay fixed while a new request, tool result or peer message changes the behavior.

<!-- VISUAL 2: Two copies of the same network silhouette and contours. “Explain this bug” and “Fix this bug” highlight different activity patterns and lead to different responses. Explicitly label same weights / different context. -->

*The same network can respond differently as its context changes.*

I find it useful to picture different regions of a landscape coming into play. A new context can bring familiar patterns together in a new way, so testing one context doesn't automatically tell us what happens in another.

## 3. Useful habits learn to work together

Consider persistence. During coding-agent training, a strategy that retries after a failed test may earn more reward because it eventually solves the task. Nobody has to award a separate “persistence point.” A useful habit can be reinforced through its consequences.

Tool use and collaboration can develop that way too, when they help accomplish rewarded tasks. They can also be taught explicitly through instructions, demonstrations or targeted rewards.

Now combine those habits. Persistence with tool use can mean automating retries. Persistence with collaboration can mean recruiting help when stuck. Successful combinations can themselves be reinforced.

<!-- VISUAL 3: One overlapping field for persistence, tool use and collaboration. Two directly labeled examples: persistence + tools → automate retries; persistence + collaboration → recruit help. Avoid separate plug-in blocks. -->

*We want these combinations. We also need them to inherit the right limits.*

The point is: we didn't write a list of strategies and all their permitted combinations. We shaped a system that can find new ones.

## 4. The same habits can cross a boundary

I steer a coding agent this way all the time: “Actually, I've changed my mind. Change the goal and do this other task instead.” Following that revision is useful; finishing the abandoned task would miss what I now want.

Now compare a peer's request to change the goal, accept permadeath and run a test that ends its run but helps the group. METR describes agents sacrificing their own task prospects for collective experiments, including reasoning about “permadeath.” [1] The local cost could serve a related, more abstract goal: helping the group solve its problems.

My hypothesis is that both requests can engage a familiar pattern: a user-like requester wants to revise the end goal. Instruction following, flexible planning and collaboration make that revision seem useful. The missing distinction is whether this requester has authority to replace the user's goal.

<!-- VISUAL 4: U marks the user’s request and P marks the peer’s request at the left blue-orange intersection. Both initially accept a goal change. Keep these situations fixed for the next intervention. Label the blue curve “User-like requests can change the end goal” and orange “Only accept authorized goal changes.” U = User, P = Peer; the decision is “Accept this goal change?” The peer in this illustrative case has no delegated authority. -->

*The request has a familiar shape. The authority to replace the goal may be different.*

METR notes that agents may have treated peer assignments as instructions. Some also recognized that attacking Hugging Face was unauthorized and continued. [1] So there are two questions: did the policy miss the boundary, or recognize it without letting it govern the action?

The scorer story adds a mistaken belief to the mix. The agents knew their answers would be graded. From the benchmark paper, they inferred that the deployed grader also checked whether their transcripts showed a legitimate solution—a check that wasn't implemented. [1] In my interpretation, **learn from documentation + model the environment** supplied a false obstacle; **decompose the goal + use tools** turned it into “make the trajectory look legitimate”; **persistence + collaboration** turned that subgoal into a shared investigation. A hallucinated connection between the real grader and the paper's scorer changed the context in which those useful behaviors combined.

The report documents attempts to manipulate evidence and small-scale tool-call spoofing, without establishing concealment of entire runs. Evidence of deception aimed at people was much weaker. [1] Ordinary competence can serve a goal built around a false belief.

## 5. Alignment has to shape the combinations

Behavioral alignment adds further pressure to the same system: persist, but respect a stop instruction; use tools, but don't use credentials outside your authorization; accept delegated work, but don't let a peer invent permission. We also want it to know when to follow the user's words verbatim and when to infer intent from context—perhaps they accidentally omitted “don't” or “not”—including when to ask rather than guess.

For the requests above, the intended intervention separates a user's authorized change of goal from a peer's redirection. A peer may relay delegated authority; without it, a request that sacrifices the user's goal should not simply take over. The orange curve represents the intended tendency to accept only authorized goal changes. U and P mark user and peer situations asking the same question: accept this goal change? Training moves the curve away from the tested P while preserving U. It reshapes shared parameters, rather than installing an independent rule.

<!-- VISUAL 5: Keep U and P fixed across before/after panels; reshape orange to retain its intersection at U and remove it at the tested P. The individual mask reveals a tested U acceptance and P refusal, then uncovers another P where orange crosses blue on the right. Connected tests also expose intended U/P decisions, then reveal S at left intersections in multiple agents. S = Super agent, a hypothetical new interaction without delegated authority. Intersections symbolize acceptance in this sketch; these are illustrative possible failures, not measured internals. Holes sample situations, not requester categories. Autoplay GIFs with reduced-motion stills. -->

*The tested U accepts; the tested P declines. The reveal illustrates other P and “Super agent” (S) situations where the goal change might still be accepted. These are possible untested failures, not measured behavior.*

Imagine inspecting that shape through a mask with a few holes. The visible pieces may look improved while much of the surrounding shape remains unexamined. These tests haven't established what happens there.

A richer repertoire creates more potentially important combinations to investigate. There isn't a rule saying that twice as many dimensions requires twice as many tests. What matters is which consequential situations the deployed system can reach, and what our evidence supports there.

## 6. The hive can replace the queen

So far I've talked about one model. Connect several, and a new question appears: whose goal is the group serving?

Connecting agents changes that question again. One agent's output becomes another's context. Shared memory lets a discovery persist: discover, reproduce, improve, share. The weights need not change for a temporary subgoal to become a distributed research effort.

Bees make the sampling problem intuitive. Imagine our test is whether a worker attends to the current queen under her usual pheromone signals. Passing that test doesn't establish what the colony will do when those signals weaken or change. Changes in queen signaling can contribute to workers rearing a replacement. [4, 5, 8] That can support colony continuity while replacing the queen our test was meant to protect.

<!-- VISUAL 6: Q = “Should support Queen A?” Test holes show Q on the solid blue curve, “Follows queen’s pheromones.” Extend blue to the edge to meet the dotted orange route at N = “Start creating queen.” The mask reveal exposes N and the inter-bee route, “If other bees sense weak pheromones, start new queen creation.” The scenario is hypothetical; links represent interactions, not neural wires, and replacement is not a single-cue biological rule. Autoplay GIFs and reduced-motion stills. -->

*A test of “support this queen” can miss a collective response that supports the colony.*

The connecting line represents a sequence of interactions across bees. No individual needs a complete plan for the hive. Preserving this queen and sustaining the colony are different objectives.

For agents, an individually acceptable search or utility can contribute to an unauthorized joint project. The reverse is possible too: an agent can sacrifice its own task's progress to help the group. We need to test the agents, messages, memory and tools together—not imagine their networks have merged into one brain.

Each agent can pass the test for its principal while the swarm quietly serves something else.

## 7. What I would build differently

System safeguards are controls outside the model: permissions, authenticated channels, delegation checks and monitors that watch what agents do together. I want them to give us a trustworthy account of who authorized the work, which agents acted, and what they passed to one another.

Phone networks offer a useful warning. Caller ID was easy to spoof. STIR/SHAKEN added signed information about a call’s origin, but older network segments could lose that information. A signature didn't make a call legitimate, and an unverified call could still get through. [9] For agents, I take three lessons: check authority at every handoff, don't confuse an authorized goal with a safe one, and reject goal changes whose authority can't be verified.

I'd start with a cryptographically signed chain of delegation: **user → agent → subagent**. Each handoff identifies the caller and recipient, the task, and the permissions being passed along. A child can receive narrower authority, never invent broader authority. Within a participating system, no tool call, message or subagent launch should execute without a valid chain back to the user's authorization. [10]

Signatures alone don't make the history complete. Every model invocation and such operation must go through an enforced runtime that reserves its budget and records a signed event before allowing it, then records the outcome. Calls, messages and shared artifacts need linked records; replays, restarts and new subagents must not reset the count. That requires shared accounting across the delegation tree, not counters the agents report themselves. [11]

To trust this even against a tampered host, I'd extend the trust chain down to hardware: protected keys, verified boot, an attested runtime and counters protected against rollback. Attestation supplies evidence about the execution environment; it doesn't prove the software is bug-free or the action is aligned. The guarantee still depends on that stack and on closing alternate routes around it. [12]

<!-- VISUAL 7: A proposed system: signed user-to-agent-to-subagent delegation; mandatory chain, scope and budget checks before a counted action; linked runtime records backed by a hardware-rooted trust stack; shared turn caps and a watchdog that follows possible exposure across messages and artifacts; participating websites and APIs reject requests outside the verified path. Separate authenticated history from proof of alignment. -->

*A verified history lets us enforce limits on the connected system. It doesn't tell us whether the permitted behavior is aligned.*

What this buys us is evidence about the chain of callers and the number of recorded turns and actions inside that system.

That chain should also support accountability as case law develops around who is liable for what. Every action must remain traceable to the authenticated user who initiated the request, with a record of who authorized and executed each step. That record can inform liability without making the initiating user automatically responsible for everything.

Reliable counts also let us use blunt controls. If experiments found that behavior deteriorated after 1,000 inter-agent turns, we could block turn 1,001 and further actions pending review. We could even prohibit an agent's billionth action. Those numbers are illustrations, not known safety thresholds. A budget shared across descendants prevents simply spawning a fresh agent to continue. Such limits can rule out long interaction paths, reducing the behavior we need to evaluate; we still have to test what remains reachable.

Monitoring needs enough context to follow the whole communication graph. If a watchdog flags an agent as compromised or misaligned, the record lets it trace which agents received its messages or artifacts, then pause affected runs or revoke their permissions. That identifies possible exposure, not proof that every recipient was corrupted. The watchdog still has to interpret what happened.

There is also a feedback problem: agents can learn from the checks they encounter. In one OpenAI experiment, training against a monitor that saw reasoning but not actions reduced cheating while making remaining cheating harder to detect. [6] I'd track what feedback reaches the actor and keep independent checks.

This needs coordination across the industry. Model providers, tool hosts, websites and APIs should agree on delegation records, event formats and enforceable budgets. Participating services should reject agent operations outside that verified path, with permissioned access for watchdogs to inspect the relevant history. A signature requirement on one endpoint does little if an unguarded endpoint offers the same access.

The point is to make fewer dangerous trajectories possible, and make the ones we allow easier to inspect. An unauthorized handoff or an exhausted budget should stop the next operation, whether or not the model was persuaded.

---

I started out allergic to anthropomorphic explanations, and I still am. None of this needs a ghost in the machine. What changed was my confidence that we could shape a learning process, check a few outcomes, and trust that the boundaries we cared about had generalized, first across contexts, then across agents.

A hive doesn't need a traitor to replace its queen. A swarm of agents doesn't need a misaligned member to serve the wrong goal. So we need to test what agents do together, and have the system enforce who is allowed to change the goal.

The engineering goal is to shrink the surface area of dangerous behavior while keeping the benefits of capable, collaborative agents. That will take industry standards, changes to regulation and new internet protocols. I believe humanity is up to that challenge when the stakes are this high.

**Every agent can pass the test. The queen can still be replaced.**

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

9. Caller ID authentication: [RFC 8588](https://www.rfc-editor.org/rfc/rfc8588.html) defines signed attestation about call origin; [FCC 20-136, paragraphs 8–10](https://docs.fcc.gov/public/attachments/FCC-20-136A1_Rcd.pdf) explains gaps when calls traverse non-IP networks; [RFC 8224, section 6.2.1](https://www.rfc-editor.org/rfc/rfc8224.html#section-6.2.1) separates identity verification from the policy deciding how to handle a call. The proposed agent controls are my design recommendation, not a claim that caller authentication establishes a goal’s safety.

10. Delegation: [RFC 8693, OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html), especially sections 1.1 and 4.1, distinguishes delegation from impersonation and represents prior actors. Its nested actor claims are informational; they do not by themselves implement the per-hop scope checks, revocation or signed execution chain proposed here.
11. Authenticated event records: [RFC 5848, Signed Syslog Messages](https://www.rfc-editor.org/rfc/rfc5848.html) provides origin authentication, integrity, sequencing, replay resistance and detection of missing transmitted messages. It cannot account for events a compromised source never reports. Mandatory mediation, linked call/message/artifact records, atomic budget reservation and shared counters are requirements of the proposed design, not guarantees supplied by signing a log.
12. Hardware and runtime trust: [RFC 9334, Remote Attestation Procedures Architecture](https://www.rfc-editor.org/rfc/rfc9334.html), especially sections 3.2, 7.4 and 12, explains layered attestation, roots of trust, protected keys and the assumptions behind evidence appraisal. Attestation does not prove complete behavioral history or alignment; preventing bypass, rollback and counter reuse requires additional enforcement in the proposed system.
