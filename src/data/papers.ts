// Verified against Crossref (2026-10-23). `me` is the 1-based author position of Haibin Meng.
// Titles, authors and venues stay in English (the official records); the framing is in both languages.
import type { T } from '../i18n';

export interface Paper {
  title: string;
  authors: string[];
  me: number;
  venue: string;
  year: number;
  doi: string;
  question?: T; // plain-language framing for first-author papers
  icon?: string;
  story?: T;
  award?: T;
}

export const firstAuthor: Paper[] = [
  {
    question: {
      en: 'Can a radar hear a sound source it cannot see well, from 30 metres away?',
      zh: '雷达能在 30 米外，听清一个它看不太清的声源吗？',
    },
    icon: 'ear',
    title: 'Enhanced mmWave Radar Sound Sensing: A Passive Relay for Long-Range, Source-Independent Sound Acquisition',
    authors: ['Haibin Meng', 'Yuyong Xiong', 'Wendi Tian', 'Xiangyi Tang', 'Qingbo He', 'Zhike Peng'],
    me: 1,
    venue: 'IEEE Internet of Things Journal 12(10), 14309–14319',
    year: 2025,
    doi: '10.1109/JIOT.2024.3525079',
    story: {
      en:
        'Radar sound pickup used to depend on what the source is made of and how it is shaped. A thin passive membrane placed near the source turns sound into motion the radar reads easily, so pickup works on any source and reaches 30 m, more than 7.5 times earlier methods. It began with a 10 µm copper-foil test in November 2023; the folder is named "it worked". Submitted June 2024, three experiments added in revision, accepted December 2024.',
      zh: '过去，雷达拾音的效果取决于声源是什么材料、什么形状。在声源旁放一片很薄的被动薄膜，它把声音变成雷达很容易读出的运动，于是任何声源都能拾音，距离达到 30 米，是以往方法的 7.5 倍以上。它始于 2023 年 11 月的一次 10 微米铜箔测试，那个文件夹名叫「10um铜箔测试_成了」。2024 年 6 月投稿，修改时补了三个实验，同年 12 月被接收。',
    },
  },
  {
    question: {
      en: 'How do you image a target that barely reflects, sitting next to things that reflect a lot?',
      zh: '一个几乎不反射电波的目标，旁边全是反射很强的东西，怎样给它成像？',
    },
    icon: 'eye',
    title: 'Microwave Imaging of Weakly Reflective Vibrating Targets With Static Interference Suppression',
    authors: ['Haibin Meng', 'Yuyong Xiong', 'Qiaozhi Song', 'Xinyu Hui', 'Zhike Peng'],
    me: 1,
    venue: 'IEEE Transactions on Microwave Theory and Techniques 73(10), 8299–8309',
    year: 2025,
    doi: '10.1109/TMTT.2025.3564418',
    story: {
      en:
        'Vibrating things are different from static clutter in one way: they vibrate. Integrating the phase of each range-angle cell coherently over a long time makes the vibrating target grow out of the clutter, and the imaging SNR grows linearly with the number of samples. It can locate people among strong clutter. Received February 2025, accepted two months later.',
      zh: '振动的物体和静态杂波只有一点不同：它在振动。对每个距离角度单元的相位做长时间的相干积累，振动目标就会从杂波里浮出来，成像信噪比随采样数线性增长。它能在很强的杂波里定位人。2025 年 2 月收稿，两个月后被接收。',
    },
  },
  {
    question: {
      en: 'A radar measures motion along its line of sight. Can one radar measure motion across it?',
      zh: '雷达测的是沿视线方向的运动。一台雷达能测出横穿视线的运动吗？',
    },
    icon: 'side',
    title: 'Cross-range displacement measurement using a single MIMO FMCW radar',
    authors: ['Haibin Meng', 'Bo Li', 'Yuyong Xiong', 'Ming Li', 'Xin Zhou', 'Xi Liang', 'Zhike Peng'],
    me: 1,
    venue: 'Mechanical Systems and Signal Processing 253, 114338',
    year: 2026,
    doi: '10.1016/j.ymssp.2026.114338',
    story: {
      en:
        'When a target slides sideways, its range barely changes but its angle does, and both leave a mark in the phase. A geometric constraint separates the two, plus a compensation step for large travel. To our knowledge the first method for in-plane displacement with one static MIMO FMCW radar. The road there: rejected by IEEE T-MTT (October 2025, "oh noooooooooooo" in my notes), out of scope at IEEE TAP two weeks later, then reject-and-resubmit at MSSP and two rounds of revision.',
      zh: '目标横向滑动时，距离几乎不变，角度却在变，两者都会在相位里留下痕迹。一个几何约束把两者分开，再加一步补偿来处理大行程。据我们所知，这是第一种用一台静止的 MIMO FMCW 雷达测量面内位移的方法。一路走来：先被 IEEE T-MTT 拒稿（2025 年 10 月，我的笔记里写着“oh noooooooooooo”），两周后被 IEEE TAP 判为不在收稿范围，接着在 MSSP 拿到拒稿重投，又改了两轮才被接收。',
    },
  },
  {
    question: {
      en: 'If a vibration is too small to see, can you make the wave look at it many times?',
      zh: '振动小到看不见时，能不能让电波多看它几次？',
    },
    icon: 'bounce',
    title: 'Displacement Superposition Measurement Method Based on Microwave Multiple Reflections',
    authors: ['Haibin Meng', 'Yuyong Xiong', 'Yin Zhang', 'Zhike Peng'],
    me: 1,
    venue: 'IEEE Microwave and Wireless Technology Letters 36(5), 809–812',
    year: 2026,
    doi: '10.1109/LMWT.2026.3650773',
    story: {
      en:
        'Bounce the microwave between parallel surfaces and the measured path change becomes the sum of every surface\'s displacement. Repeated reflections raise the SNR, and several membranes together widen the bandwidth. This short letter travelled the furthest: by my own count it was rejected four times (IEEE AWPL, MWTL, TIM and TAP) before MWTL accepted it in November 2025. It also became a patent application.',
      zh: '让微波在几个平行表面之间来回反射，测到的路径变化就是每个表面位移的总和。反射次数越多，信噪比越高，几层薄膜一起用还能拓宽带宽。这篇短文走得最远：按我自己数，它被拒了四次（IEEE AWPL、MWTL、TIM 和 TAP），才在 2025 年 11 月被 MWTL 接收。它后来也成了一项专利申请。',
    },
  },
];

export const otherPapers: Paper[] = [
  {
    title: 'Long-Range Active Acoustic Sensing Based on Microwave Vibration Measurement',
    authors: ['Zhiqiang Kang', 'Haibin Meng', 'Yuyong Xiong', 'Xiangyi Tang', 'Wendi Tian'],
    me: 2,
    venue: 'IEEE ICSMD 2025, Guangzhou',
    year: 2025,
    doi: '10.1109/ICSMD67131.2025.11365409',
    award: { en: 'Best Paper Award (co-author)', zh: '最佳论文奖（合作作者）' },
  },
  {
    title: 'A unified modeling and trajectory planning method based on system manipulability for the operation process of the legged locomotion manipulation system',
    authors: ['Peng Kang', 'Haibin Meng', 'Wenfu Xu'],
    me: 2,
    venue: 'Robotica 41(7), 2139–2154',
    year: 2023,
    doi: '10.1017/S0263574723000371',
  },
  {
    title: 'Whole Body Collaborative Planning Method for Legged Locomotion Manipulation System in Operation Process',
    authors: ['Peng Kang', 'Haibin Meng', 'Lei Yan', 'Wenfu Xu'],
    me: 2,
    venue: 'IEEE ROBIO 2022, Jinghong',
    year: 2022,
    doi: '10.1109/ROBIO55434.2022.10011971',
  },
  {
    title: 'A comprehensive review of microwave microphone: sound sensing through microwave vibration monitoring',
    authors: ['Xiangyi Tang', 'Yuyong Xiong', 'Haibin Meng', 'Wendi Tian', 'Zhiqiang Kang', 'Qingbo He', 'Zhike Peng'],
    me: 3,
    venue: 'IEEE Internet of Things Journal, early access',
    year: 2026,
    doi: '10.1109/JIOT.2026.3717610',
  },
  {
    title: 'mmSound: high-quality broadband reconstruction for speech recovery',
    authors: ['Xiangyi Tang', 'Yuyong Xiong', 'Haibin Meng', 'Qingbo He', 'Zhike Peng'],
    me: 3,
    venue: 'Measurement 261, 119696',
    year: 2026,
    doi: '10.1016/j.measurement.2025.119696',
  },
  {
    title: 'mmFusion: mmWave-assisted mono speech enhancement for multisource aliasing and addressing',
    authors: ['Xiangyi Tang', 'Yuyong Xiong', 'Haibin Meng', 'Wendi Tian', 'Qingbo He', 'Zhike Peng'],
    me: 3,
    venue: 'IEEE Sensors Journal 25(18), 35223–35236',
    year: 2025,
    doi: '10.1109/JSEN.2025.3588468',
  },
  {
    title: 'High-quality sound recovery of moving sound source using millimeter-wave radio',
    authors: ['Yuyong Xiong', 'Zhaoyu Liu', 'Xiangyi Tang', 'Haibin Meng', 'Zhike Peng'],
    me: 4,
    venue: 'Journal of Dynamics, Monitoring and Diagnostics 4(1), 22–30',
    year: 2025,
    doi: '10.37965/jdmd.2024.719',
  },
  {
    title: 'mmAcoustic: full-field sound source localization, identification and area-selectable sound recovery',
    authors: ['Yuyong Xiong', 'Xiangyi Tang', 'Songxu Li', 'Haibin Meng', 'Dong Wang', 'Guang Meng', 'Zhike Peng'],
    me: 4,
    venue: 'IEEE Transactions on Instrumentation and Measurement 73, 1–12',
    year: 2024,
    doi: '10.1109/TIM.2023.3342841',
  },
];

export const patents: { title: string; zh: string; id: string; kind: T; note: T; href: string }[] = [
  {
    title: 'Solar fibre-optic lighting system with intelligent light compensation',
    zh: '一种智能光补偿的太阳能光纤照明系统',
    id: 'CN112097213B',
    kind: { en: 'Invention patent, granted 2025-01-03', zh: '发明专利，2025-01-03 授权' },
    note: {
      en: 'Its twin, utility model CN212961362U, was granted 2021-04-13. 3rd of 6 inventors. From an undergraduate energy-saving competition project: Fresnel lenses feed sunlight into optical fibres, a two-axis gimbal tracks the sun, and LEDs fill in when the light drops.',
      zh: '它的孪生实用新型专利 CN212961362U 于 2021-04-13 授权。六位发明人中我排第三。来自本科时的节能减排竞赛项目：菲涅尔透镜把阳光汇进光纤，两轴云台跟着太阳转，光线变弱时由 LED 补光。',
    },
    href: 'https://patents.google.com/patent/CN112097213B/en',
  },
  {
    title: 'Microwave displacement measurement method and system enhanced by multiple-reflection superposition',
    zh: '多次反射叠加增强的微波位移测量方法及系统',
    id: 'CN121763247A',
    kind: { en: 'Invention patent application, filed 2025-12-31, published 2026-03-31', zh: '发明专利申请，2025-12-31 提交，2026-03-31 公开' },
    note: { en: '2nd of 3 inventors. The patent twin of the multiple-reflection letter above.', zh: '三位发明人中我排第二。上面那篇多次反射短文的专利版本。' },
    href: 'https://patents.google.com/patent/CN121763247A/en',
  },
];
