---
title: "用人脸融合检验一个心理学说法"
summary: "基于特征点的人脸平均和渐变，配一份 56 页的教程。现在也有了浏览器版本，你的照片不会离开你的设备。"
built: "和编程智能体一起写的，教程也是。"
links:
  - label: 在浏览器里试试
    href: /tools/facemorph/
  - label: Python 版本和教程
    href: https://github.com/MayHappybb/facemorph
---

读 Miller 的《亲密关系》时，我看到一个说法：平均脸看起来更有吸引力。于是我决定自己写个程序，看看是不是真的。

方法是经典的那一套：在每张脸上找特征点（MediaPipe 的 468 个点，或者 dlib 的 68 个），把它们的位置平均成一个平均形状，把平均形状切成三角形（Delaunay 剖分），把每张脸的每个三角形用仿射变换贴到平均形状上，再混合起来。同一套方法也能做从一张脸到另一张脸的渐变。

Python 版本做得更多：集体照里的人脸去重，精修模式，支持 HEIC，一个追求速度的 OpenCV 引擎和一个用来教学的纯 Python 引擎。一份七章的 LaTeX 教程配图讲解了每一步。

<a href="/zh/tools/facemorph/">浏览器版本</a>可以用你自己的照片做平均和渐变，全部在你的设备上完成。
