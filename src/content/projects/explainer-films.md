---
title: "Explainer films about radar"
summary: "Animated, narrated films that explain how radar sees micrometre vibrations, in the 3Blue1Brown style. Every frame is code."
year: '2026'
date: 2026-09-30
group: research
icon: film
featured: true
built: "Animation engine, scenes and narration made by coding agents (Claude, Codex, DeepSeek) from my brief and review."
---

I wanted to explain my field without slides. The brief to the agents was short: "never make it look like slides … like the 3blue1brown style". One continuous picture per chapter, where each new idea grows out of something already on screen.

The films are code: an HTML canvas engine with a timeline, morphing TeX formulas and a camera, one script per chapter, local neural text-to-speech for the voice, and a renderer that turns it into video.

<figure class="photo" data-frame>
  <video controls preload="none" poster="/media/invisible-motion.jpg" width="1280" height="720" style="width:100%;height:auto;display:block;position:relative">
    <source src="/media/invisible-motion.mp4" type="video/mp4">
    Your browser can't play this video. <a href="/media/invisible-motion.mp4">Download it (6.8 MB)</a>.
  </video>
  <figcaption>Invisible Motion (5:55). How a phase change of 18.5° reveals a 0.1 mm movement at 77 GHz, and how a MIMO array adds direction. Made with Codex.</figcaption>
</figure>

- **Seeing vibrations with radar**, 26:38, eight chapters: phase, FMCW, vibration, MIMO, the processing pipeline and applications. My reaction when it finished: "this is absolutely amazing!" (It will be embedded here once it is on YouTube.)
- **Invisible Motion**, 5:55, above.
- **How the Fourier transform works**, 1:49. A test of the explainer skill: DeepSeek made it unattended and wrote an honest report of every problem it hit with the skill.
