---
title: "FMCW radar toolbox"
summary: "The MATLAB toolbox my lab uses to read, simulate and process mmWave radar data, from a single TI board to a 4-chip cascade."
year: '2024–25'
date: 2024-01-11
group: research
icon: wave
built: "Written by me alone, before coding agents."
status: "Used in the lab; private repository."
---

When I started on radar, the lab's programs were scattered and inconsistent: every student had their own reader, their own constants and their own bugs. So in January 2024 I wrote one object-oriented MATLAB package and kept it going for almost two years (23 commits, January 2024 to November 2025).

What it does:

- Turns raw captures from TI's tools into one standard data cube, for an AWR2243 single board or a 4-chip cascade with 86 virtual channels.
- Simulates the true IF signal of any radar, including near-field targets and moving trajectories, so methods can be tested before an experiment.
- `ShowRadarData`, about 50 methods: range and angle heatmaps, interactive region selection, phase and displacement extraction, clutter removal by circle fitting, stacking, ridge tracking, migration compensation, and GIFs of a heatmap evolving over time.

Every paper of mine since 2024 runs on it. In 2026 the newest thesis work moved to a Python version, RadarLab, written with the help of coding agents.
