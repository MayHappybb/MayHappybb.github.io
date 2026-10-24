---
title: "Face morphing, to test a psychology claim"
summary: "Feature-based face averaging and morphing, with a 56-page tutorial. Now also a browser tool where your photos never leave your device."
year: '2026'
date: 2026-04-08
group: web
icon: face
built: "Written with a coding agent; the tutorial too."
links:
  - label: Try it in your browser
    href: /tools/facemorph/
  - label: Python version and tutorial
    href: https://github.com/MayHappybb/facemorph
---

Reading Miller's *Intimate Relationships*, I met the claim that an average face looks attractive. So I decided to write a program to test whether it's true.

The method is the classic one: find landmarks on each face (MediaPipe's 468 points, or dlib's 68), average their positions into a mean shape, cut the mean shape into triangles (Delaunay), warp every triangle of every face onto it with an affine map, and blend. The same machinery gives morphs from one face to another.

The Python project does more: group photos with identity de-duplication, a refine mode, HEIC input, an OpenCV engine for speed and a pure-Python engine for teaching. A seven-chapter LaTeX tutorial explains every step with figures.

The [browser version](/tools/facemorph/) does averaging and morphing on your own photos, entirely on your device.
