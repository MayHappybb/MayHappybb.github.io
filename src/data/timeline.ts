// Public timeline. Dates come from documents, git and photos (see the private profile).
import type { T } from '../i18n';

export const timeline: { year: string; items: T[] }[] = [
  {
    year: '2018',
    items: [{
      en: 'Start at Harbin Institute of Technology, Shenzhen: mechanical design, manufacturing and automation.',
      zh: '进入哈尔滨工业大学（深圳），读机械设计制造及其自动化。',
    }],
  },
  {
    year: '2019',
    items: [
      { en: 'Team leader of the engineering-training logistics car.', zh: '担任工程训练物流小车的队长。' },
      { en: 'Open a GitHub account; first stars go to ESP8266, OLED and LED-strip projects and a DIY clock.', zh: '注册 GitHub，最早收藏的是 ESP8266、OLED 和 LED 灯带项目，还有一个 DIY 时钟。' },
    ],
  },
  {
    year: '2020',
    items: [
      {
        en: 'A maker year at home: an assembled 3D printer, a pen plotter from old optical drives, a dorm light switch for my roommates.',
        zh: '在家做东西的一年：自己组装的 3D 打印机，用旧光驱做的写字机，还有给室友做的宿舍灯开关。',
      },
      {
        en: 'Solar fibre-optic lighting with a sun-tracking gimbal (later the patent); an sEMG/FES acquisition board in Prof. Honghai Liu\'s lab.',
        zh: '带追日云台的太阳能光纤照明（后来成了专利）；在刘洪海教授实验室画的肌电采集与电刺激电路板。',
      },
      {
        en: 'National first prize, 9th National Undergraduate Mechanical Innovation Design Competition, with the rotating wardrobe 八面玲珑.',
        zh: '旋转衣柜「八面玲珑」获第九届全国大学生机械创新设计大赛全国一等奖。',
      },
    ],
  },
  {
    year: '2021',
    items: [
      {
        en: 'Cable-driven parallel robot planning; a Spot Micro quadruped rebuilt with ROS and SLAM; UR5e cup stacking with MoveIt.',
        zh: '绳驱并联机器人的轨迹规划；用 ROS 和 SLAM 复现 Spot Micro 四足机器人；用 MoveIt 让 UR5e 叠杯子。',
      },
      {
        en: 'First patent granted (utility model). Recommended for graduate study at Shanghai Jiao Tong University.',
        zh: '第一项专利授权（实用新型）。推免到上海交通大学读研。',
      },
    ],
  },
  {
    year: '2022',
    items: [
      {
        en: 'Thesis defended: whole-body planning for a quadruped with a 6-DoF arm. HIT Outstanding Graduate.',
        zh: '本科毕设答辩：带六自由度机械臂的四足机器人全身协同规划。哈工大优秀毕业生。',
      },
      {
        en: 'Start the combined master–PhD track at SJTU, State Key Laboratory of Mechanical System and Vibration. First co-authored paper (ROBIO).',
        zh: '进入上海交通大学机械系统与振动全国重点实验室，硕博连读。第一篇合作论文（ROBIO）。',
      },
    ],
  },
  {
    year: '2023',
    items: [
      { en: 'Robotica paper. A VFD clock with my own ESP8266 driver, a desktop PC rack.', zh: 'Robotica 论文。用自己写的 ESP8266 驱动做了一个 VFD 时钟，还做了一个桌面电脑架。' },
      { en: 'November: a radar test on a 10 µm copper foil works. The start of the relay paper.', zh: '11 月：雷达在 10 微米铜箔上的测试成功了。中继那篇论文就从这里开始。' },
    ],
  },
  {
    year: '2024',
    items: [
      {
        en: 'Write the lab\'s FMCW radar toolbox in MATLAB. Build a Voron 2.4.',
        zh: '为实验室写了 FMCW 雷达 MATLAB 工具箱。组装了一台 Voron 2.4。',
      },
      {
        en: 'Sound picked up at 30 m in the relay experiments. Doctoral stage begins. The IoT-J paper is accepted in December.',
        zh: '中继实验在 30 米外拾到了声音。进入博士阶段。IoT-J 论文在 12 月被接收。',
      },
    ],
  },
  {
    year: '2025',
    items: [
      {
        en: 'T-MTT paper accepted. Cross-range experiments with a pendulum, a shaker and a slide table all summer.',
        zh: 'T-MTT 论文被接收。整个夏天都在用重力摆、激振器和滑台做横向位移实验。',
      },
      {
        en: 'PhD proposal defended. Best Paper Award at ICSMD 2025 (co-author). MWTL letter accepted after four rejections.',
        zh: '博士开题答辩通过。ICSMD 2025 最佳论文奖（合作作者）。MWTL 短文被拒四次后被接收。',
      },
      {
        en: 'Silver, China International College Student Innovation Competition (Shanghai). SJTU Three-Good Student.',
        zh: '中国国际大学生创新大赛上海赛区银奖。上海交通大学三好学生。',
      },
      { en: 'November: a Bambu Lab A1 mini of my own.', zh: '11 月：买了自己的拓竹 A1 mini。' },
    ],
  },
  {
    year: '2026',
    items: [
      { en: 'MSSP paper published. Start piano lessons.', zh: 'MSSP 论文发表。开始学钢琴。' },
      {
        en: 'Build a lot with coding agents: a face-morphing program, agent-designed clock faces, a desk LCD any AI can draw on, over-the-air ESP32 programming, a straight-line car challenge.',
        zh: '和编程智能体一起做了很多东西：人脸融合程序，由智能体设计的时钟表盘，任何 AI 都能在上面画画的桌面小屏，ESP32 无线编程，还有让小车走直线的挑战。',
      },
      { en: 'September: intern on bilibili\'s AI video-creation agent team.', zh: '9 月：在哔哩哔哩的 AI 视频创作智能体团队实习。' },
    ],
  },
];
