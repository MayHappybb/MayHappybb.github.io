---
title: "Without derivation, it has nothing to verify"
date: 2026-09-23
summary: "I tried to build an agent that does research the way I do. The first version wrote 4,800 lines and no science. What worked was a short playbook."
icon: doc
---

My research has a shape: an idea, then related work, then a derivation that shows whether the idea can work at all, then a model-based simulation, then an experiment plan detailed enough that "even an absolute layman could finish this experiment by fully following the instructions", then a paper whose outline and figures are planned first. I wanted an agent that works like that.

**Version 1** grew to 4,798 lines of literature-search infrastructure: providers, full-text fetching, an MCP server, a store. It had zero scientific modules. Every line went to the part that was easiest to build.

**Version 2** started smaller: reproduce one of my own published papers first, so there is a known answer to check against.

**The light version** dropped the machinery and ran the steps by hand with a few subagents. My verdict on it was blunt: "it works like shit … without derivation, it has nothing to verify." An agent that reads another agent's prose will agree with it. Only a derivation gives a check something to bite on.

**The playbook** that finally worked has four roles (framer, deriver, checker, simulator) and a few rules that came out of the failures:

- Build the workflow by hand before building the machinery.
- Never start with a step that depends on something adversarial outside your control.
- Verification must execute. A script does not agree out of politeness.
- Never split a chain of steps that depend on each other.

On a near-field idea of mine it produced a 56-page derivation, an executable check that passed (a scaling exponent of exactly 3, a symbolic residual of zero), and a simulation that confirmed the idea with honest limits: the new processor wins by a large margin close to the array, ties with the classic method in the far field, and loses above a certain SNR. That last part, the agent saying where its own idea stops working, was the result I trusted most.
