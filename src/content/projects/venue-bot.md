---
title: "The noon booking race"
summary: "A bot that books campus sports courts the moment they open at noon, and catches cancellations. Ran every day for six months. Principle only; the code stays private."
year: '2026'
date: 2026-04-14
group: web
icon: bot
built: "Built by a relay of agents (Kimi, Codex, Claude) over 34 sessions, from my own traffic captures and direction."
status: "In daily use since April 2026."
---

At SJTU, sports courts for the day a week ahead open at 12:00 sharp, and the good badminton and tennis slots are gone within seconds. People run browser scripts. I wanted to stop setting alarms.

The principle, without the code:

- **No browser.** The bot speaks the site's HTTP API directly. Browser automation is slow; direct calls are about 300–500 ms faster, which decides a race that lasts seconds.
- **Login like a person would**: campus single sign-on, a text captcha read by OCR, two-factor once, then a trusted session. A slider captcha is solved when it appears.
- **The order is encrypted** in the browser before it is sent. I worked out the scheme from my own traffic captures and the site's JavaScript, so the bot builds the same request itself.
- **Win the start**: connections are opened and warmed before noon over HTTP/2, the clock is synced by NTP and the last milliseconds are a busy-wait, and request bodies are prepared in advance. Then it polls for the moment the new day appears and submits at once.
- **After the race**, a "hunter" keeps looking for cancelled slots, and notifications say what was booked.

It booked its first court on 14 April 2026 and then ran every day: badminton, tennis, the gym and piano rooms. In October it gained a small web interface so classmates can use it without editing config files. I keep the code private to be fair to the booking system and to other students.
