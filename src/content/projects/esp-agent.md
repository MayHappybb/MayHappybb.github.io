---
title: "Programming ESP32 boards from a phone"
summary: "Flash a board once over USB. After that any AI agent can read its logs, talk to its running code, and build and flash new firmware over the air."
year: '2026'
date: 2026-10-19
group: agents
icon: chip
featured: true
built: "Designed by me, written with Claude Code; tested end to end in QEMU."
status: "Phases 1–3 of 5 done (ESP32-C3). C6 and S3 boards next."
---

The desk LCD taught me that agents are good at embedded code when they can see what happens. So I generalised it: any ESP32 board, any agent, from anywhere, including from my phone.

You flash a small "agent core" once. From then on the board only needs power. It joins Wi-Fi, connects out to the server, and an agent can:

- read its logs and its last crash,
- send JSON to the app running on it and get an answer,
- write ordinary ESP-IDF C, have it compiled for that exact board, and flash it over the air.

The part I care about most is that a bad build can't brick the board. The new image has 60 seconds to prove itself, connected and healthy, or the board boots the previous one. There is a safe mode that starts without the app, a watchdog, and a recovery record that survives resets. Each recovery path has an end-to-end test in an emulator. Builds run in a sandbox with no network. Approving a new agent needs the owner's password; the LCD's "code on the screen" approval was too easy to grief.

On 18–19 October the first board, a tiny ESP32-C3 Super Mini, received 16 builds this way, including Eight Glyphs below.
