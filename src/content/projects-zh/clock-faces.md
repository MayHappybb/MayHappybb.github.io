---
title: "给小屏幕的 561 个时钟表盘"
summary: "一组 Claude Code 技能，让智能体给 16×2 LCD、OLED、160×80 的彩屏和 LED 点阵设计动态时钟，每个都在逼真的模拟器上检验过。"
built: "技能、模拟器和表盘由 Claude Code 写成，我来指挥和点评。"
links:
  - label: 看全部 561 个表盘一起走（英文页面）
    href: https://mayhappybb.github.io/clock-skills/gallery/
  - label: 模拟器
    href: https://mayhappybb.github.io/clock-skills/
  - label: GitHub 上的源代码
    href: https://github.com/MayHappybb/clock-skills
---

一切从我桌上一块便宜的 16×2 字符 LCD 开始。我找到的所有时钟，字体无聊，布局无聊，也没有动画。我想要一个让陌生人看了会说“等等，这是个时钟？”的表盘。

智能体看不到的设计，它没法判断好坏，所以第一步是做一个模拟器：它模拟 HD44780 控制器，运行真实的指令，按真实的几何尺寸渲染玻璃，连液晶反应慢都模拟了。然后我把它打包成一个技能，交给更厉害的智能体去设计。

现在有四个技能，每种屏幕一个：

- **1602-clock**：HD44780 16×2 LCD。一切都得塞进控制器允许的 8 个自定义字符里，检查器会证明一整天都塞得下。
- **oled-clock**：SSD1306 和 SH1106 OLED，128×64 和 128×32，还会估算烧屏。
- **tft-clock**：一块 0.96 寸 160×80 的 ST7735S 彩屏，模拟了子像素条纹、背光和撕裂。
- **ws2812-clock**：各种形状的 WS2812 灯板和 HUB75 点阵屏，最多九块拼在一起，还算了功耗和发热。

表盘是一轮一轮设计出来的：很多个智能体会话并行，每个做一个表盘，然后我来点评，再进入下一轮。设计要求写得很直白：“A competent, pretty, conventional face is a fail.” 我喜欢有物理感过渡的俏皮表盘（吃豆人，Pong，一个到整分钟就翻个身的立方体），不喜欢四个数字一动不动地待着。

到 10 月 19 日，一共有 91 个 LCD 表盘，155 个 OLED 表盘，176 个彩屏表盘和 139 个 LED 表盘。画廊让它们在你的浏览器里共用一个时钟一起走，你可以加快时间，看整分钟和整点时的变化。

我还用同一份要求做了一次小小的模型比赛（Opus、Sonnet、Haiku 和 DeepSeek）。智能体的总结让我一直记得：“Every Sonnet failure was a judgement failure, not a coding one.”
