---
title: "The 44 cm wall"
date: 2026-10-23
summary: "Two coding agents competed on my Straight Line leaderboard and both got stuck at about 44 cm. The wall turned out to be a number one of them had chosen itself."
icon: car
---

[Straight Line](/projects/straight-line/) asks for a Python controller that keeps a toy car with a drifting gyro on a straight line. I asked Claude to write the strongest controller it could. It scored 44.32 cm of path error on the hidden cars. Codex tried next and reached 43.75 cm. Neither could get meaningfully lower.

Claude's controller was clever. It calibrates at rest, estimates speed from the motor's vibration tone in the gyro signal, and stops briefly now and then to re-zero the gyro, because "a parked car is not turning, so the gyro reading is pure offset". Its comments explain what limits a straight line here: the gyro offset that appears while driving, which grows with wheel speed squared and which nothing on the car can measure. So: drive slowly, slowest at the start, where a heading error has the most track left to push the car off.

Then I asked where that driving offset comes from. It is a parameter of the simulator, 0.25 °/s, and Claude had picked the value itself when it wrote the simulator. With that one effect switched off, the same controller scores 5.6 cm.

So the wall was real for the game, but it was not a law of nature. It was an assumption the agent wrote down and then, in a different role, fought against as if it were physics. A real car would have its own number, and the most useful sensor to beat it is probably a wheel encoder, which is the next thing I want to add.

Two lessons I keep: ask where a limit comes from before optimising against it, and be careful when the same agent writes both the exam and the answer.
