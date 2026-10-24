// The ideas jar. Dates are when the idea was first written down; '' = from the research notebook, date unknown.
// state: done = it became something; tried = explored, not finished; open = still an idea; dropped = judged not worth it.
export interface Idea {
  date: string;
  text: string;
  state: 'done' | 'tried' | 'open' | 'dropped';
  note?: string;
  href?: string;
}

export const ideas: Idea[] = [
  { date: '2020-02', text: 'Change what a screen shows to suit the angle you look at it from.', state: 'open' },
  { date: '2023-11', text: 'Fold a thin foil into a corner reflector, put it near a sound source, and let the radar read the foil instead of the source.', state: 'done', note: 'IEEE IoT-J 2025', href: '/research/' },
  { date: '2023-09-21', text: 'Make better corner reflectors.', state: 'dropped', note: 'little research value, good solutions exist' },
  { date: '', text: 'Bounce the radar off a surface many times so a tiny vibration adds up.', state: 'done', note: 'IEEE MWTL 2026, and a patent application', href: '/research/' },
  { date: '', text: 'Measure sideways motion with the phase, since the range stays almost constant.', state: 'done', note: 'MSSP 2026', href: '/research/' },
  { date: '', text: 'Integrate a weak vibrating target for a long time until it rises out of the clutter.', state: 'done', note: 'IEEE T-MTT 2025', href: '/research/' },
  { date: '', text: 'A radiation-pattern viewer for any antenna array, published as a useful tool.', state: 'done', note: 'the array PSF designer', href: '/tools/psf/' },
  { date: '', text: 'Corner reflectors as a fixed world frame for a radar that moves.', state: 'open' },
  { date: '', text: 'A handheld radar vibrometer that uses an IMU to cancel the shaking hand.', state: 'open' },
  { date: '', text: 'Radar, mini PC and router in one box: a wireless measurement unit.', state: 'open' },
  { date: '', text: '3D-printed microwave absorbers.', state: 'open' },
  { date: '2026-02-03', text: 'A research agent: idea, derivation, simulation, experiment plan, paper.', state: 'tried', note: 'see the note "Without derivation, nothing to verify"', href: '/notes/nothing-to-verify/' },
  { date: '2026-02', text: 'A paper recommender that learns from my Zotero library.', state: 'open' },
  { date: '2026-02', text: 'A printing agent that picks models, prints, checks the camera and swaps plates all night.', state: 'open' },
  { date: '2026-02', text: 'A filament-remaining sensor: a strain gauge on the spool rim.', state: 'open' },
  { date: '2026-02', text: 'Calibrate a screen\'s colours from one phone photo.', state: 'open' },
  { date: '2026-02', text: 'Write a post once, restyle it for each platform.', state: 'open' },
  { date: '2026-02', text: 'A timeline of how a project grew out of agent chats.', state: 'tried', note: 'a prototype; "vibe researching"' },
  { date: '2026-03', text: 'Hive as a web game, with a learned opponent.', state: 'open' },
  { date: '2026-03', text: 'A campus calendar to find three more players for badminton doubles.', state: 'open' },
  { date: '2026-04', text: 'A sheet-music app that turns the page when it hears you reach the end, then grades you.', state: 'open' },
  { date: '2026-04', text: 'Test the "average faces are attractive" claim with my own program.', state: 'done', note: 'facemorph', href: '/tools/facemorph/' },
  { date: '2026-04', text: 'The campus QR code on a microcontroller keychain.', state: 'tried', note: 'stopped at the login step' },
  { date: '2026-10', text: '16 custom characters on a 1602 by switching glyphs faster than the eye.', state: 'tried', note: 'simulated: too dim, it flickers' },
  { date: '2026-10', text: 'An FPGA that pretends to be any display, so one big screen can preview them all.', state: 'open' },
  { date: '2026-10', text: 'Move AirPods through the air and use them as a synthetic-aperture microphone.', state: 'open' },
  { date: '2026-10', text: 'A clock-face skill for a bare 20×2 VFD glass.', state: 'open' },
  { date: '2026-10', text: 'A PCB-design skill that searches the parts catalogue itself.', state: 'open' },
  { date: '2026-10', text: 'Wheel encoders for the Straight Line car.', state: 'open' },
];
