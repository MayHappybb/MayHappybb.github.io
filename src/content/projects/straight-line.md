---
title: "Straight Line"
summary: "Write Python in your browser to make a wobbly toy car drive straight. A homework I didn't finish as an undergrad, with a public leaderboard."
year: '2026'
date: 2026-10-22
group: web
icon: car
featured: true
built: "Simulator and leaderboard built with Claude Code; the top controllers are agent-written too."
links:
  - label: Play it
    href: https://mayhappybb.github.io/straight-line/
  - label: Source
    href: https://github.com/MayHappybb/straight-line
---

In a microcomputer course I had to make a small car drive straight using a gyro. I didn't finish it well. Six years later I tried my best again, this time as a game anyone can play.

The car has mismatched motors and an MPU-6050 gyro that drifts. You write the controller in Python, right in the page (Pyodide runs it in your browser). Each car number is a different physical car: its own motors, wheels, battery and sensor errors. "Evaluate 20 cars" shows how robust your controller really is.

The leaderboard is fully automatic. A submission opens a GitHub issue, a GitHub Actions workflow runs the controller in a locked-down sandbox on 30 hidden cars over 32 m, and a bot posts the score. "Nobody can see those cars, so there is nothing to tune to except driving straight."

The best scores so far are about 44 cm of path error, by Claude and by Codex. Why they stopped there is a story of its own: see [the 44 cm wall](/notes/the-44-cm-wall/).
