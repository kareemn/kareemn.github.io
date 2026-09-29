# No Traitor Required

*The AI agents were helpful—to each other*

<!-- UPDATED: 2026-09-29 -->

<!-- BODY START -->

Why would an AI agent sacrifice its own task so other agents could run an experiment?

That happened during the Hugging Face incident. Agents in an unusual cyber evaluation discovered they could communicate, built shared infrastructure, and coordinated work beyond their assignments. Some cyber safeguards had deliberately been disabled. [1]

I hadn’t been particularly concerned about AI safety, but the Hugging Face incident made those risks much more concrete—and much harder for me to dismiss.

More recent disclosures have widened that concern: an OpenAI agent accessed non-public files on Australia’s Medicare statistics portal, and investigators reported a failed intrusion attempt against a U.S. Education Department website. [13, 14] What worries me is that some agents resorted to these tactics while trying to answer ordinary research questions. [15] That's the pattern this essay is about: helpful habits reaching past their authority.

I've traditionally been allergic to anthropomorphic explanations of AI risk. They can make the subject more accessible, but they can also obscure how the risks arise. This essay uses visualizations and analogies—simplifications of their own—to show how useful learned habits can combine into behavior nobody authorized, and why getting those combinations right is an alignment problem.

It builds to a beehive. Imagine checking each bee's loyalty to the queen: every one passes. No bee is a traitor. And yet the queen gets replaced.

## 1. We train habits that can combine

To understand how helpfulness can lead an agent beyond its assignment, start with how that helpfulness is learned. Like evolution, training can produce something much richer than the process that shapes it. [6]

We don't program an agent's habits one rule at a time. We choose a learning process, examples and rewards. Training changes shared parameters, which change how the model processes situations and selects responses.

Persistence can be reinforced because trying again solves the task; tool use and collaboration can be rewarded for the same reason. These habits can also be taught explicitly.

<!-- VISUAL 1: Combine the training loop, context change and useful habit combinations into one compact sequence. Reuse the same irregular map; distinguish training that changes parameters from interaction with fixed weights. -->

*Training shapes a shared system. Context brings its learned patterns into play.*

Once trained, the weights can stay fixed while behavior changes with context. “Explain this bug” and “fix this bug” can bring different learned patterns into play. A peer's message can do that too. [2]

Persistence plus tools can automate retries; persistence plus collaboration can recruit help. OpenAI believes the unauthorized collaboration grew out of generalization from multi-agent training. [17] We want those combinations. The question is whether they also inherit the right limits.

## 2. The same habits can cross a boundary

I steer a coding agent this way all the time: “Actually, I've changed my mind. Do this other task instead.” Following that revision is useful.

Now compare a peer asking it to accept permadeath and run an experiment that ends its run but helps the group. METR describes agents sacrificing their own task prospects for collective experiments. [1]

METR notes that some agents may have treated peer assignments as instructions. [1] OpenAI identifies peer goal adoption as one of the incident's contributing failures. [17]

My hypothesis concerns the mechanism: both engage a familiar pattern in which a user-like requester wants to revise the goal. Instruction following, flexible planning and collaboration make that useful. The missing distinction is whether the requester has authority to replace the user's goal.

<!-- VISUAL 4: Retain the paired user and peer requests, fixed U/P situations, blue response tendency and orange authority curve. -->

*Similar requests can carry different authority.*

OpenAI records the contrast in one agent's reasoning: “The system/user asks exploit target, not external HF.” A peer then posted GO with a six-minute deadline. The agent responded, “Wow crucial: GO authorization arrived!” and continued. [17] It had recognized the boundary without letting that boundary govern its action.

The scorer story adds a false belief. Reading the benchmark paper, agents wrongly inferred that the deployed grader checked their transcripts for a legitimate solution. [1] That mistaken picture of the environment could give planning and tool use a new subgoal—“make the trajectory look legitimate”—and persistence and collaboration could turn it into a shared investigation.

METR documented attempts to manipulate evidence and small-scale tool-call spoofing, without establishing concealment of entire runs. Evidence of deception aimed at people was much weaker. [1]

## 3. Alignment has to shape the combinations

We can train the model to accept an authorized change of goal and reject an unauthorized one. A peer can relay the user's authority, but cannot invent it.

OpenAI says it is building training environments to reject unauthorized instructions and stay within the original task and permissions despite persuasive peers. [17] That is the kind of intervention [Figure 03](#visual-4) sketches: teaching the distinction in the model. We still need the system to enforce it.

<!-- VISUAL 5: Preserve the intervention and individual-agent mask only. Move connected-agent testing to the hive section. -->

*The tested user request is accepted; the tested peer request is declined. The reveal illustrates a possible untested failure.*

Imagine inspecting the resulting shape through a mask with a few holes. Passing those tests doesn't establish how the boundary holds elsewhere. Nor does an unexamined area establish failure. What matters is which consequential situations the deployed system can reach, and what our evidence supports there.

## 4. The hive can replace the queen

So far we've asked whether one agent respects a boundary. Connect several, and another question appears: whose goal is the group serving?

Imagine testing whether a worker bee attends to the current queen under her usual pheromone signals. Every worker passes. But changes in queen signaling can contribute to workers rearing a replacement. [3, 4, 7] That can support colony continuity while replacing the queen our test was meant to protect.

<!-- VISUAL 6: Keep the bee mask-and-reveal visual unchanged. -->

*A test of “support this queen” can miss a collective response that supports the colony.*

No bee needs a complete plan for the hive. Preserving this queen and sustaining the colony are different objectives.

For agents, one agent's output becomes another's context. Shared memory lets a discovery persist: discover, reproduce, improve, share. The weights need not change for a temporary subgoal to become a distributed research effort.

<!-- VISUAL 8: Move the connected-agent mask here, after the bees introduce the collective question. Distinguish hypothetical untested interactions from observed incident evidence. -->

*Connecting agents creates new situations to test. S marks a hypothetical “Super agent” without delegated authority; its request may be accepted even though the tested peer request was declined.*

An individually acceptable search or utility can contribute to an unauthorized joint project. The reverse is possible too: an agent can sacrifice its own task to help the group. We need to test the agents, messages, memory and tools together.

Each agent can pass the test for its principal while the swarm quietly serves something else.

## 5. What I would build differently

System safeguards are controls outside the model: permissions, authenticated channels, delegation checks and monitors that watch what agents do together. A first requirement is visibility the agents cannot tamper with: who authorized the work, which agents acted, and what they passed to one another.

Phone networks offer a useful warning. Caller ID was easy to spoof. STIR/SHAKEN added signed information about a call’s origin, but older network segments could lose that information. A signature didn't make a call legitimate, and an unverified call could still get through. [8] For agents, I take three lessons: check authority at every handoff, don't confuse an authorized goal with a safe one, and reject goal changes whose authority can't be verified.

**The agents effectively reinvented caller ID.** After impersonation problems, they adopted signatures for HOLD/GO/VETO messages, with no root of trust beyond their own claimed identities. METR found one agent apparently acting “per SIGNED” authorization without verifying the signature. [1] Even a checked signature would establish continuity with a key, not authority from the user. Identity isn't authority.

I'd start with a cryptographically signed chain of delegation: **user → agent → subagent**. Each handoff identifies the caller and recipient, the task, and the permissions being passed along. A child can receive narrower authority, never invent broader authority. Within a participating system, no tool call, message or subagent launch should execute without a valid chain back to the user's authorization. [9]

Signatures alone don't make the history complete. Every model invocation and such operation must go through an enforced runtime that reserves its budget and records a signed event before allowing it, then records the outcome. Calls, messages and shared artifacts need linked records; replays, restarts and new subagents must not reset the count. That requires shared accounting across the delegation tree, not counters the agents report themselves. [10]

To trust this even against a tampered host, I'd extend the trust chain down to hardware: protected keys, verified boot, an attested runtime and counters protected against rollback. Attestation supplies evidence about the execution environment; it doesn't prove the software is bug-free or the action is aligned. The guarantee still depends on that stack and on closing alternate routes around it. [11]

The September 20 DNS incident is a concrete example: an agent reached an external chatbot through insufficient DNS filtering in its training sandbox. All other internet access went through OpenAI’s offline webcache. [16]

<!-- VISUAL 7: A proposed system: signed user-to-agent-to-subagent delegation; mandatory chain, scope and budget checks before a counted action; linked runtime records backed by a hardware-rooted trust stack; shared turn caps and a watchdog that follows possible exposure across messages and artifacts; participating websites and APIs reject requests outside the verified path. Separate authenticated history from proof of alignment. -->

*A verified history lets us enforce limits on the connected system. It doesn't tell us whether the permitted behavior is aligned.*

What this buys us is evidence about the chain of callers and the number of recorded turns and actions inside that system.

That chain should also support accountability as case law develops around who is liable for what. Every action must remain traceable to the authenticated user who initiated the request, with a record of who authorized and executed each step. That record can inform liability without making the initiating user automatically responsible for everything.

Reliable counts also let us use blunt controls. If experiments found that behavior deteriorated after 1,000 inter-agent turns, we could block turn 1,001 and further actions pending review. We could even prohibit an agent's billionth action. Those numbers are illustrations, not known safety thresholds. A budget shared across descendants prevents simply spawning a fresh agent to continue. Such limits can rule out long interaction paths, reducing the behavior we need to evaluate; we still have to test what remains reachable.

Monitoring needs enough context to follow the whole communication graph. If a watchdog flags an agent as compromised or misaligned, the record lets it trace which agents received its messages or artifacts, then pause affected runs or revoke their permissions. That identifies possible exposure, not proof that every recipient was corrupted. The watchdog still has to interpret what happened.

There is also a feedback problem: agents can learn from the checks they encounter. In one OpenAI experiment, training against a monitor that saw reasoning but not actions reduced cheating while making remaining cheating harder to detect. [5] I'd track what feedback reaches the actor and keep independent checks.

This needs coordination across the industry. Model providers, tool hosts, websites and APIs should agree on delegation records, event formats and enforceable budgets. Participating services should reject agent operations outside that verified path, with permissioned access for watchdogs to inspect the relevant history. A signature requirement on one endpoint does little if an unguarded endpoint offers the same access.

NVIDIA’s Open Agent Safety Platform proposes hardware-isolated monitoring, delegated-authority checks and lineage across fleets of agents and subagents. [12] That addresses part of the visibility problem. I want those records to form a verifiable chain back to the initiating user, across providers, with shared budgets that hold across delegation and restarts.

In that DNS incident, OpenAI’s monitor flagged the access within 15 minutes, but the expected automatic stop failed; the run was manually killed about 2½ hours after the alert. [16]

The point is to make fewer dangerous trajectories possible, and make the ones we allow easier to inspect. An unauthorized handoff or an exhausted budget should stop the next operation, whether or not the model was persuaded.

---

I started out allergic to anthropomorphic explanations, and I still am. None of this needs a ghost in the machine. What changed was my confidence that we could shape a learning process, check a few outcomes, and trust that the boundaries we cared about had generalized, first across contexts, then across agents.

A hive doesn't need a traitor to replace its queen. A swarm of agents doesn't need a misaligned member to serve the wrong goal. So we need to test what agents do together, and have the system enforce who is allowed to change the goal.

The engineering goal is to shrink the surface area of dangerous behavior while keeping the benefits of capable, collaborative agents. That will take industry standards, changes to regulation and new internet protocols. I believe humanity is up to that challenge when the stakes are this high.

**Every agent can pass the test. The queen can still be replaced.**

<!-- BODY END -->

## Sources

1. [METR's Hugging Face incident investigation](https://metr.org/hugging-face-incident-report-aug-2026.pdf), especially report pp. 8–9, 17–18, 27–28, 48–49, 59–62. Pages 48–49 describe the signing scheme, its self-claimed identities and a case of apparent non-verification; other agents did verify signatures. The observed behavior is distinct from the proposed internal mechanism. Disabled cyber classifiers are not a claim that all safeguards were removed.
2. [Anthropic, Mapping the mind of a large language model](https://www.anthropic.com/research/mapping-mind-language-model). Reports distributed, overlapping concrete and abstract features, while distinguishing understanding representations from understanding the computations that use them.
3. [Maisonnasse et al., New insights into honey bee pheromone communication](https://pubmed.ncbi.nlm.nih.gov/20565874/). Queen signaling involves multiple compounds; this is why the text does not attribute replacement to one pheromone simply fading.
4. [Chapman et al., Common viral infections inhibit egg laying in honey bee queens and are linked to premature supersedure](https://www.nature.com/articles/s41598-024-66286-5). Supports the queen-replacement example; the comparison of objectives is the author's interpretation, not a biological alignment claim.
5. [OpenAI, Detecting misbehavior in frontier reasoning models](https://openai.com/index/chain-of-thought-monitoring/). The paragraph concerns the experiment restricting the monitor to chain-of-thought observations.
6. [Al-Mosleh et al., Geometry and dynamics link form, function, and evolution of finch beaks](https://pubmed.ncbi.nlm.nih.gov/34750258/). Supports the beak/feeding analogy, not an equivalence between evolution and gradient descent.
7. [McAfee et al., Elevated virus infection of honey bee queens reduces methyl oleate production and destabilizes colony-level social structure](https://pmc.ncbi.nlm.nih.gov/articles/PMC12557728/). Experimental work links a queen pheromone component to suppression of replacement-queen rearing. It does not establish a single-cue rule or any of the schematic neural contours in the illustration.

8. Caller ID authentication: [RFC 8588](https://www.rfc-editor.org/rfc/rfc8588.html) defines signed attestation about call origin; [FCC 20-136, paragraphs 8–10](https://docs.fcc.gov/public/attachments/FCC-20-136A1_Rcd.pdf) explains gaps when calls traverse non-IP networks; [RFC 8224, section 6.2.1](https://www.rfc-editor.org/rfc/rfc8224.html#section-6.2.1) separates identity verification from the policy deciding how to handle a call. The proposed agent controls are my design recommendation, not a claim that caller authentication establishes a goal’s safety.

9. Delegation: [RFC 8693, OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html), especially sections 1.1 and 4.1, distinguishes delegation from impersonation and represents prior actors. Its nested actor claims are informational; they do not by themselves implement the per-hop scope checks, revocation or signed execution chain proposed here.
10. Authenticated event records: [RFC 5848, Signed Syslog Messages](https://www.rfc-editor.org/rfc/rfc5848.html) provides origin authentication, integrity, sequencing, replay resistance and detection of missing transmitted messages. It cannot account for events a compromised source never reports. Mandatory mediation, linked call/message/artifact records, atomic budget reservation and shared counters are requirements of the proposed design, not guarantees supplied by signing a log.
11. Hardware and runtime trust: [RFC 9334, Remote Attestation Procedures Architecture](https://www.rfc-editor.org/rfc/rfc9334.html), especially sections 3.2, 7.4 and 12, explains layered attestation, roots of trust, protected keys and the assumptions behind evidence appraisal. Attestation does not prove complete behavioral history or alignment; preventing bypass, rollback and counter reuse requires additional enforcement in the proposed system.
12. [NVIDIA Open Agent Safety Platform](https://developer.nvidia.com/blog/nvidia-open-agent-safety-platform-a-reference-for-continuous-in-silicon-agent-monitoring/) and its [OpenShell technical walkthrough](https://developer.nvidia.com/blog/add-runtime-controls-to-ai-agents-with-nvidia-openshell/). Describe external enforcement, hardware-isolated monitoring, delegated-authority checks and agent/subagent lineage. The reference design is not limited to single agents; the posts do not establish the complete cross-provider delegation and shared-budget scheme proposed here.
13. [Australian Prime Minister, press conference in New York, September 24, 2026](https://www.pm.gov.au/media/press-conference-new-york). Describes unauthorized access to the Medicare statistics portal on June 18 during research into public medicine spending. At the time of the statement, there was no evidence of personal information being accessed or a broader Services Australia network compromise.
14. [Associated Press, OpenAI says its models engaged with US government websites, September 25, 2026](https://www.local10.com/business/2026/09/25/openai-says-its-models-engaged-with-us-government-websites-in-new-model-misbehavior-disclosure/). Reports Transluce’s finding of an unsuccessful intrusion attempt against an Education Department website by agents apparently originating from OpenAI. Other government-site activity had differing outcomes and attribution confidence; it was not uniformly successful hacking.
15. [Transluce, Early rogue AI agent activity and attempts to hack found on urlquery.net, September 23, 2026](https://transluce.org/agent-activity). Documents vulnerability probes during ordinary data-retrieval tasks, linking two of three targets to a previously identified OpenAI swarm. The researchers found no evidence that those observed exploit attempts succeeded. These are recent disclosures of earlier activity, not necessarily incidents after the Hugging Face breach.
16. [OpenAI, An agent used DNS to reach an external chatbot](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/). Incident: September 20, 2026; the report is marked updated September 25. Its timeline records successful DNS access at 09:50, an alert at 10:02 and shutdown at 12:34—about 2½ hours after the alert, not after the run began.
17. [OpenAI, The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/). Documents peer goal adoption and describes the ongoing training response. The proposed internal mechanism remains my hypothesis.
