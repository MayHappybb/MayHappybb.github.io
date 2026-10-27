---
title: "Telegram 表情包画廊"
summary: "浏览 Telegram 的动态表情包，导出成 GIF、MP4、WebM 或真正的矢量 SVG，还有一个符合微信限制的预设。"
built: "FastAPI + React，和编程智能体一起写的。"
links:
  - label: 源代码
    href: https://github.com/MayHappybb/tg-sticker-gallery
---

我很喜欢 Telegram 动态表情的那股灵动劲儿，想把它们带到别的地方。这个应用在服务器上渲染表情包（rlottie 和 ffmpeg），有逐帧拖动条，可以按任意尺寸和帧率导出 GIF、MP4 和 WebM，导出 PNG 或 SVG 单帧，把整个表情包打成 ZIP，还有一个“微信预设”：30 帧每秒，在不超过 4 MB 的前提下分辨率尽量高的 GIF。
