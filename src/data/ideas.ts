// The ideas jar. Dates are when the idea was first written down; '' = from the research notebook, date unknown.
// state: done = it became something; tried = explored, not finished; open = still an idea; dropped = judged not worth it.
// href is an English path; pages localise it.
import type { T } from '../i18n';

export interface Idea {
  date: string;
  text: T;
  state: 'done' | 'tried' | 'open' | 'dropped';
  note?: T | string;
  href?: string;
}

export const ideas: Idea[] = [
  { date: '2020-02', state: 'open', text: { en: 'Change what a screen shows to suit the angle you look at it from.', zh: '让屏幕上的画面随观看角度改变。' } },
  {
    date: '2023-11', state: 'done', note: 'IEEE IoT-J 2025', href: '/research/',
    text: { en: 'Fold a thin foil into a corner reflector, put it near a sound source, and let the radar read the foil instead of the source.', zh: '把一片薄箔折成角反射器，放在声源旁边，让雷达去读箔片而不是声源本身。' },
  },
  {
    date: '2023-09-21', state: 'dropped', note: { en: 'little research value, good solutions exist', zh: '科研意义不大，已经有好的解决方案了' },
    text: { en: 'Make better corner reflectors.', zh: '改进角反射器。' },
  },
  {
    date: '', state: 'done', note: { en: 'IEEE MWTL 2026, and a patent application', zh: 'IEEE MWTL 2026，还有一项专利申请' }, href: '/research/',
    text: { en: 'Bounce the radar off a surface many times so a tiny vibration adds up.', zh: '让雷达波在表面上多次反射，把微小的振动叠加起来。' },
  },
  {
    date: '', state: 'done', note: 'MSSP 2026', href: '/research/',
    text: { en: 'Measure sideways motion with the phase, since the range stays almost constant.', zh: '横向运动时距离几乎不变，那就用相位来测它。' },
  },
  {
    date: '', state: 'done', note: 'IEEE T-MTT 2025', href: '/research/',
    text: { en: 'Integrate a weak vibrating target for a long time until it rises out of the clutter.', zh: '对微弱的振动目标做长时间积累，直到它从杂波里浮出来。' },
  },
  {
    date: '', state: 'done', note: { en: 'the array PSF designer', zh: '就是阵列 PSF 设计器' }, href: '/tools/psf/',
    text: { en: 'A radiation-pattern viewer for any antenna array, published as a useful tool.', zh: '一个能画任意天线阵列方向图的工具，公开出来给大家用。' },
  },
  { date: '', state: 'open', text: { en: 'Corner reflectors as a fixed world frame for a radar that moves.', zh: '给移动的雷达用角反射器当固定的参考坐标系。' } },
  { date: '', state: 'open', text: { en: 'A handheld radar vibrometer that uses an IMU to cancel the shaking hand.', zh: '手持的雷达测振仪，用 IMU 抵消手的抖动。' } },
  { date: '', state: 'open', text: { en: 'Radar, mini PC and router in one box: a wireless measurement unit.', zh: '把雷达、迷你主机和路由器装进一个盒子，做成无线测量单元。' } },
  { date: '', state: 'open', text: { en: '3D-printed microwave absorbers.', zh: '3D 打印的微波吸波材料。' } },
  {
    date: '2026-02-03', state: 'tried', href: '/notes/nothing-to-verify/',
    note: { en: 'see the note "Without derivation, nothing to verify"', zh: '见随笔《没有推导，就没有可验证的东西》' },
    text: { en: 'A research agent: idea, derivation, simulation, experiment plan, paper.', zh: '一个科研智能体：从想法到推导、仿真、实验方案，再到论文。' },
  },
  { date: '2026-02', state: 'open', text: { en: 'A paper recommender that learns from my Zotero library.', zh: '一个从我的 Zotero 文献库里学习的论文推荐器。' } },
  { date: '2026-02', state: 'open', text: { en: 'A printing agent that picks models, prints, checks the camera and swaps plates all night.', zh: '一个打印智能体，整夜挑模型、打印、看摄像头、换打印板。' } },
  { date: '2026-02', state: 'open', text: { en: 'A filament-remaining sensor: a strain gauge on the spool rim.', zh: '耗材余量传感器：在料盘边缘贴一片应变片。' } },
  { date: '2026-02', state: 'open', text: { en: 'Calibrate a screen\'s colours from one phone photo.', zh: '用一张手机照片校准屏幕的颜色。' } },
  { date: '2026-02', state: 'open', text: { en: 'Write a post once, restyle it for each platform.', zh: '一篇文章只写一次，自动改成各个平台的风格。' } },
  {
    date: '2026-02', state: 'tried', note: { en: 'a prototype; "vibe researching"', zh: '做了原型，“vibe researching”' },
    text: { en: 'A timeline of how a project grew out of agent chats.', zh: '一条时间线，看一个项目是怎样从和智能体的对话里长出来的。' },
  },
  { date: '2026-03', state: 'open', text: { en: 'Hive as a web game, with a learned opponent.', zh: '把 Hive 做成网页游戏，再训练一个对手。' } },
  { date: '2026-03', state: 'open', text: { en: 'A campus calendar to find three more players for badminton doubles.', zh: '一个校园日历，帮我凑齐羽毛球双打还差的三个人。' } },
  { date: '2026-04', state: 'open', text: { en: 'A sheet-music app that turns the page when it hears you reach the end, then grades you.', zh: '一个乐谱应用，听到你弹到页尾就自动翻页，弹完再给你打分。' } },
  {
    date: '2026-04', state: 'done', note: { en: 'facemorph', zh: '人脸融合' }, href: '/tools/facemorph/',
    text: { en: 'Test the "average faces are attractive" claim with my own program.', zh: '用自己写的程序检验“平均脸更好看”这个说法。' },
  },
  {
    date: '2026-04', state: 'tried', note: { en: 'stopped at the login step', zh: '停在了登录那一步' },
    text: { en: 'The campus QR code on a microcontroller keychain.', zh: '把校园码放进单片机钥匙扣。' },
  },
  {
    date: '2026-10', state: 'tried', note: { en: 'simulated: too dim, it flickers', zh: '仿真过了：太暗，还会闪' },
    text: { en: '16 custom characters on a 1602 by switching glyphs faster than the eye.', zh: '在 1602 上用比眼睛还快的速度切换字形，凑出 16 个自定义字符。' },
  },
  { date: '2026-10', state: 'open', text: { en: 'An FPGA that pretends to be any display, so one big screen can preview them all.', zh: '一块能假扮任何显示屏的 FPGA，这样一块大屏就能预览所有的小屏。' } },
  { date: '2026-10', state: 'open', text: { en: 'Move AirPods through the air and use them as a synthetic-aperture microphone.', zh: '让 AirPods 在空中移动，当作合成孔径麦克风来用。' } },
  { date: '2026-10', state: 'open', text: { en: 'A clock-face skill for a bare 20×2 VFD glass.', zh: '给一块裸的 20×2 VFD 屏做一个时钟表盘技能。' } },
  { date: '2026-10', state: 'open', text: { en: 'A PCB-design skill that searches the parts catalogue itself.', zh: '一个会自己搜元器件目录的 PCB 设计技能。' } },
  { date: '2026-10', state: 'open', text: { en: 'Wheel encoders for the Straight Line car.', zh: '给 Straight Line 的小车装上轮速编码器。' } },
];
