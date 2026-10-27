---
title: "讲雷达的科普影片"
summary: "有动画、有旁白的影片，讲雷达怎样看见微米级的振动，3Blue1Brown 的风格。每一帧都是代码画的。影片是英文的。"
built: "动画引擎、场景和旁白都由编程智能体（Claude、Codex、DeepSeek）按我的要求做出，我来审。"
---

我想不用幻灯片来讲清自己的领域。给智能体的要求很短：“never make it looks like a slides … like the 3blue1brown style”。每一章是一幅连续的画面，每个新想法都从屏幕上已有的东西里长出来。

这些影片都是代码：一个 HTML 画布引擎，带时间线、会变形的 TeX 公式和镜头，每章一个脚本，本地的神经网络语音合成做旁白，生成的背景音乐，最后由渲染器输出成 1080p、60 帧的视频。

- **Seeing vibrations with radar（用雷达看见振动）**，26:38，八章，就是上面这部。它从那些振动小到看不见的东西讲起（一座桥，一台电机，一个睡着的人），一步步讲到相位、FMCW chirp、I/Q 平面上的圆弧、MIMO 和雷达数据立方体，再把整条处理流程用在一根斜拉索、一个快坏的轴承和一个人的呼吸上，最后讲这个方法的局限。做完时我的反应是：“this is absolutely amazing!”
- **Invisible Motion**，5:55，同一个故事更短的初版，用 Codex 做的。[看这部（6.8 MB）](/media/invisible-motion.mp4)。
- **How the Fourier transform works**，1:49。用来测试科普影片技能：DeepSeek 在无人值守的情况下做完，还老老实实写了一份报告，列出它在这个技能上遇到的每一个问题。
