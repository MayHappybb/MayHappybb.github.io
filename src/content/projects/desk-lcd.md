---
title: "A desk screen any AI can draw on"
summary: "A 0.96\" LCD on my desk that ChatGPT, Claude and other agents drive over the internet through MCP. Idea to working in one day."
year: '2026'
date: 2026-10-10
group: agents
icon: chip
image: ../../assets/photos/desk-lcd.jpg
imageAlt: "Close-up of the 0.96 inch colour LCD showing its bring-up test screen: red, green, blue and white bars and the panel settings that worked."
featured: true
built: "Built with Claude Code in one day; firmware, bridge and SDK are agent-written to my design and review."
status: "Working. Its features are moving into the ESP32 agent below."
---

A tiny 160×80 colour screen on an ESP32-C3 board. Any agent that speaks MCP (ChatGPT, claude.ai, Claude Code, Codex, Cursor, Gemini CLI, Kiro) can draw shapes, text and pictures on it, take a screenshot of the real framebuffer, or upload a small C program that runs on the board at up to 60 frames per second.

How it fits together:

- The board dials out over a secure WebSocket to a small Python bridge, so it works behind any router.
- Agents connect to the bridge as an MCP server. To approve a new agent, the screen shows a 6-digit pairing code (OAuth), so only someone at the desk can say yes.
- Only changed pixels travel; a clock update is about 35 bytes.
- Uploaded C programs are compiled in a sandbox, linked for the board and loaded without reflashing. Firmware updates go over the air with rollback.

The timeline on 10 October 2026: idea at 13:15, board paired at 18:28, the first agent-written C animation at 21:04, ChatGPT drawing on it at 22:53. By the next day Claude, Claude Code and ChatGPT had stored 13 programs on it, from a bouncing ball to Snake.

The code stays private because it runs on my own server.
