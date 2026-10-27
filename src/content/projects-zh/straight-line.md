---
title: "走直线（Straight Line）"
summary: "在浏览器里写 Python，让一辆歪歪扭扭的小车走直线。本科时没做好的一个作业，现在有了公开排行榜。页面是英文的。"
built: "模拟器和排行榜由 Claude Code 写成；排行榜上最好的控制器也是智能体写的。"
links:
  - label: 去玩
    href: https://mayhappybb.github.io/straight-line/
  - label: 源代码
    href: https://github.com/MayHappybb/straight-line
---

微机原理课上有一个作业，要用陀螺仪让一辆小车走直线。我当时没做好。六年后我又尽力做了一次，这次做成了一个谁都能玩的游戏。

小车的两个电机不一样，MPU-6050 陀螺仪会漂。你在网页里用 Python 写控制器（Pyodide 让它直接在浏览器里运行）。每个车号都是一辆不同的车：电机、轮子、电池和传感器误差都不一样。点“Evaluate 20 cars”，就能看出你的控制器到底稳不稳。

排行榜是全自动的。提交会开一个 GitHub issue，GitHub Actions 在一个锁死的沙箱里，让控制器在 30 辆隐藏的车上跑 32 米，再由机器人贴出成绩。“没有人能看到那些车，所以除了好好走直线，没有别的东西可以调。”

目前最好的成绩大约是 44 cm 的路径误差，分别来自 Claude 和 Codex。它们为什么停在那里，本身就是一个故事：见<a href="/zh/notes/the-44-cm-wall/">44 厘米的墙</a>。
