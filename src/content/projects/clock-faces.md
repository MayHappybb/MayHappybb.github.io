---
title: "561 clock faces for tiny screens"
summary: "Claude Code skills that let agents design animated clocks for a 16×2 LCD, OLEDs, a 160×80 TFT and LED panels, each checked on a faithful emulator."
year: '2026'
date: 2026-10-15
group: agents
icon: clock
featured: true
built: "Skills, emulators and faces written by Claude Code under my direction and critique."
links:
  - label: See all 561 faces ticking
    href: https://mayhappybb.github.io/clock-skills/gallery/
  - label: Simulators
    href: https://mayhappybb.github.io/clock-skills/
  - label: Source on GitHub
    href: https://github.com/MayHappybb/clock-skills
---

It started with a cheap 16×2 character LCD on my desk. Every clock I found for it had boring fonts, boring layouts and no animation. I wanted a face that makes a stranger say "wait, that's a clock?"

An agent can't judge a design it can't see, so the first step was a simulator: an emulator of the HD44780 controller that runs the real instructions, renders the glass at true geometry and even models the slow liquid crystal. Then I packed it as a skill, so a more capable agent could pick it up and design.

There are now four skills, one per kind of display:

- **1602-clock**: HD44780 16×2 LCD. Everything has to fit in the 8 custom characters the controller allows, and a checker proves that it does, all day long.
- **oled-clock**: SSD1306/SH1106 OLEDs, 128×64 and 128×32, with a burn-in estimate.
- **tft-clock**: a 0.96" 160×80 ST7735S colour screen, with sub-pixel stripes, backlight and tearing.
- **ws2812-clock**: shaped WS2812 boards and HUB75 panels, up to nine panels together, with a power and heat budget.

Faces were designed in rounds: many agent sessions in parallel, one face each, then my critique, then the next round. The brief says it plainly: "A competent, pretty, conventional face is a fail." I like playful faces with physical transitions (Pac-Man, Pong, a cube that turns over at the minute) and dislike four digits sitting still.

By 19 October there were 91 LCD faces, 155 OLED faces, 176 TFT faces and 139 LED faces. The gallery runs them all on one shared clock in your browser; you can speed time up to see the minute and hour transitions.

I also ran a small model tournament on the same face brief (Opus, Sonnet, Haiku and DeepSeek). The agent's summary of it stuck with me: "Every Sonnet failure was a judgement failure, not a coding one."
