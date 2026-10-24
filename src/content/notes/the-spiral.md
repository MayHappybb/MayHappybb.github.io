---
title: "The spiral that should have been a line"
date: 2026-10-15
summary: "A target moving back and forth on a straight line came out of my radar as a spiral. Finding out why took weeks and changed how I judge results."
icon: spiral
---

My thesis asks whether one small radar can measure a vibration in 3D: not only how far a target moves towards the radar, but in which direction it moves. The test is simple. Move a reflector back and forth along one straight line, and see if the radar recovers that line.

It recovered a spiral.

The obvious suspects were calibration and noise, and neither explained it: the spiral was too regular. The real cause was quieter. The radar sees the target and, in the same range-angle cell, everything static around it: the mount, the table, the room. Those echoes add to the target's echo coherently. As the target moves, its phase turns and the static part stays put, so the sum swings in a circle. The direction estimate swings with it, once per half wavelength of travel. A straight line becomes a coil.

A simulation driven by the measured motion reproduced the spiral, which was the moment I believed the explanation.

The first fix was textbook: each channel's signal traces a circle in the IQ plane; find the centre, subtract it. The spiral collapsed into a line. Then I ran the same fix on clean simulated data with no clutter at all, and it added a small error of its own. The circle isn't quite a circle, because the target's own amplitude changes a little as it moves. A gain-aware fit fixed that, and revealed a smaller, slower wiggle underneath, which had its own cause (the real target is not a point, and the background drifts). Each layer had a reason, and each fix was checked on data where I knew the answer.

What is left is the hardest problem: on long real captures the line is now smooth, and I have nothing independent to prove it is also *right*. One rule went into my project notes and stays there:

> A smooth or straight result is not evidence of accuracy without truth.

The numbers will appear here once the paper is out.
