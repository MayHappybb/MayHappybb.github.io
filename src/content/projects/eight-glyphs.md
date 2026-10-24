---
title: "Eight glyphs"
summary: "A demoscene show and keyboard games on a 16×2 LCD, drawn with only the 8 custom characters the display allows."
year: '2026'
date: 2026-10-19
group: agents
icon: star
image: ../../assets/photos/amber-1602.jpg
imageAlt: "An amber-on-black 16 by 2 character LCD on a green board, showing a big-digit clock reading 01:57."
caption: "the amber 1602 on my desk"
built: "Written by Claude Code against the ESP32 agent, flashed over the air."
---

An HD44780 character LCD has 32 cells and lets you define just 8 characters of your own, 64 bytes in total. Everything else is fixed ROM letters. That limit is the whole fun.

**Eight Glyphs** is a small demoscene show. Scenes draw into an 80×16 pixel layer, and a compositor packs whatever distinct cell bitmaps the frame needs into at most 8 glyphs. The scenes: a 3D cube that unfolds into a 4D tesseract, AI Pong (HAL against WOPR), a dino runner, a storm at sea with the backlight as lightning and a display shift as thunder, and a big-digit clock set from the network.

**Glyph games** adds a Bluetooth keyboard: a typing attack, a five-letter word game, a Fallout-style terminal hack, dino run and Pong against HAL. When idle it shows a campfire under the stars with the time. Stars and sparks are ROM characters, so they "cost no glyph".

Six of the clock faces from the gallery were also ported line for line to C and checked frame for frame against the browser emulator.

The amber-on-black screen in the photo is the one on my desk.
