import type p5 from 'p5'
import palette from '@/assets/palettes/miamiVice.json'

export const useCanvas = () => {
  const W = 768, H = 768            // logical resolution

  const col = (hex: string) => {
    const n = parseInt(hex.slice(1), 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255]
  }
  const C = {
    pink: col(palette.pink),
    aqua: col(palette.turquoise),
    purple: col(palette.purple),
    amber: col(palette.amber),
    foam: col('#140827'),
    deep: col('#04040b'),
    tile: col('#0c1119'),
    tileHi: col('#161c26'),
    burg: col('#581b2c'),
    silver: col('#b8b8c8'),
    wood: col('#604126')
  }

  const noiseDot = () => (Math.random() < 0.05 ? 18 - Math.random() * 36 : 0)

  const initCanvas = (parentElement: HTMLElement): Promise<p5 | undefined> => {
    if (!process.client || !parentElement) {
      console.error("p5.js parentElement not found or not in client-side context.");
      return Promise.resolve(undefined);
    }

    parentElement.innerHTML = ''; // Clear the container

    return import('p5').then(({ default: P5 }) => {
      let p5Instance: p5 | undefined;
      const sketch = (s: p5) => {
        p5Instance = s;
        s.setup = () => {
          // Create canvas matching parent size but maintain aspect ratio
          const parentWidth = parentElement.offsetWidth;
          const parentHeight = parentElement.offsetHeight;
          const canvas = s.createCanvas(W, H);
          
          // Disable default inline styling from p5
          const canvasElt = canvas.elt;
          canvasElt.style.width = '';
          canvasElt.style.height = '';
          
          s.noSmooth();
          s.frameRate(30);
        };

        s.draw = () => {
          s.loadPixels()

          /* ----- BACK WALL ----- */
          // base
          for (let y = 0; y < 600; y++) {
            const rowCol = y % 32 < 24 ? C.foam : C.deep
            for (let x = 0; x < W; x++) writePx(s, x, y, rowCol)
          }
          // foam grid
          for (let gy = 0; gy < 15; gy++)
            for (let gx = 0; gx < 15; gx++)
              for (let y = 2; y < 26; y++)
                for (let x = 2; x < 26; x++)
                  writePx(s, 200 + gx * 32 + x, 120 + gy * 32 + y, C.deep)

          /* ----- CEILING NEON STRIP ----- */
          for (let y = 0; y < 40; y++)
            for (let x = 0; x < W; x++)
              writePx(s, x, y, y < 20 ? C.pink : fade(C.pink, 0.4))

          /* ----- TURQUOISE WALL TUBE ----- */
          for (let y = 160; y < 560; y++)
            for (let x = 712; x < 728; x++)
              writePx(s, x, y, x < 720 ? C.aqua : fade(C.aqua, 0.4))

          /* ----- POSTERS ----- */
          poster(s, 40, 80)
          poster(s, 568, 80)

          /* ----- GEAR STACKS ----- */
          stack(s, 60)
          stack(s, 508)

          /* ----- REEL-TO-REEL ----- */
          const rot = (s.frameCount % 360) * 0.0174533 / 4     // smooth ~22.5°/sec
          reel(s, 364 - 96, 360, rot)
          reel(s, 364 + 96, 360, -rot)
          vuMeter(s, 364 - 60, 430, 120, 10, 0.6)

          // stand
          linePx(s, 364, 490, 364, 630, C.aqua)
          linePx(s, 364, 630, 304, 668, C.aqua)
          linePx(s, 364, 630, 424, 668, C.aqua)

          /* ----- VINYL CRATES ----- */
          crate(s, 60, 560)
          crate(s, 508, 560)

          /* ----- FLOOR (TILES + REFLECTION) ----- */
          for (let y = 560; y < H; y++) {
            const row = y % 16 < 8 ? C.tile : C.tileHi
            for (let x = 0; x < W; x++) writePx(s, x, y, row)
          }
          // simple reflection glow under neon tube
          for (let y = 640; y < 720; y++)
            for (let x = 600; x < 760; x++)
              tintPx(s, x, y, C.aqua, 0.08)

          /* ----- LOUNGE CHAIR ----- */
          for (let y = 580; y < 700; y++)
            for (let x = 420; x < 660; x++)
              writePx(s, x, y, C.burg)

          /* ----- SIDE TABLE + WHISKEY ----- */
          for (let x = 700; x < 728; x++) writePx(s, x, 620, C.silver)
          for (let y = 620; y < 660; y += 4) linePx(s, 712, y, 712, y + 2, C.silver)
          for (let y = 620; y < 660; y += 4) linePx(s, 720, y, 720, y + 2, C.silver)
          for (let y = 640; y < 652; y++)
            for (let x = 704; x < 720; x++)
              writePx(s, x, y, y < 642 ? C.silver : C.amber)

          /* ----- 1-pixel noise ----- */
          for (let i = 0; i < s.pixels.length; i += 4) {
            const n = noiseDot()
            s.pixels[i] += n; s.pixels[i + 1] += n; s.pixels[i + 2] += n
          }
          s.updatePixels()
        };
      };
      new P5(sketch, parentElement);
      return p5Instance; // This instance is created synchronously by p5 constructor
    });
  }

  /* ----- helper pixel writers ----- */
  const idx = (x: number, y: number) => 4 * (y * W + x)
  function writePx(s: p5, x: number, y: number, rgba: number[]) {
    const i = idx(x, y); s.pixels[i] = rgba[0]; s.pixels[i + 1] = rgba[1]; s.pixels[i + 2] = rgba[2]; s.pixels[i + 3] = rgba[3]
  }
  function linePx(s: p5, x1: number, y1: number, x2: number, y2: number, rgba: number[]) {
    const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1)
    let x = x1, y = y1
    while (x !== x2 || y !== y2) { writePx(s, x, y, rgba); if (x !== x2) x += dx; if (y !== y2) y += dy }
    writePx(s, x2, y2, rgba)
  }
  const fade = (c: number[], f: number) => c.map((v, i) => (i === 3 ? v : v * f)) as number[]
  const tintPx = (s: p5, x: number, y: number, rgb: number[], a: number) => {
    const i = idx(x, y); s.pixels[i] = s.pixels[i] * (1 - a) + rgb[0] * a
    s.pixels[i + 1] = s.pixels[i + 1] * (1 - a) + rgb[1] * a
    s.pixels[i + 2] = s.pixels[i + 2] * (1 - a) + rgb[2] * a
  }

  /* ----- higher-order shapes ----- */
  const vuMeter = (s: p5, x: number, y: number, w: number, h: number, speed = 1) => {
    const lvl = Math.floor((s.frameCount * speed) % (h * 2))
    for (let i = 0; i < h; i++) {
      const colr = i < lvl ? C.amber : C.deep
      for (let px = 0; px < w; px++) writePx(s, x + px, y + h - i - 1, colr)
    }
  }
  const reel = (s: p5, cx: number, cy: number, rot: number) => {
    const r = 64
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++) {
        const d = Math.hypot(x, y)
        if (d <= r) {
          const a = (Math.atan2(y, x) + rot + Math.PI * 2) % (Math.PI * 2)
          const spoke = a < 0.12 || (a > Math.PI * 2 / 3 && a < Math.PI * 2 / 3 + 0.12) || (a > 4 * Math.PI / 3 && a < 4 * Math.PI / 3 + 0.12)
          const px = spoke ? C.deep : C.aqua
          writePx(s, cx + x, cy + y, px)
        }
      }
    for (let y = -8; y <= 8; y++)
      for (let x = -8; x <= 8; x++)
        if (Math.hypot(x, y) <= 8) writePx(s, cx + x, cy + y, C.deep)
  }
  const stack = (s: p5, sx: number) => {
    // cassette
    rectPx(s, sx, 280, 200, 60, C.deep)
    vuMeter(s, sx + 24, 296, 152, 10)
    // preamp
    rectPx(s, sx, 340, 200, 60, C.silver)
    // tube amp
    rectPx(s, sx, 400, 200, 80, C.deep)
    ;[sx + 40, sx + 90, sx + 140].forEach(x => rectPx(s, x, 408, 12, 36, C.amber))
  }
  const poster = (s: p5, px: number, py: number) => {
    rectPx(s, px - 6, py - 6, 172, 212, C.pink)
    rectPx(s, px, py, 160, 200, C.purple)
  }
  const crate = (s: p5, x: number, y: number) => {
    rectPx(s, x, y, 160, 120, C.wood)
    for (let i = 0; i < 14; i++) rectPx(s, x + 12 + i * 10, y + 12, 6, 96, C.purple)
  }
  const rectPx = (s: p5, x: number, y: number, w: number, h: number, colr: number[]) => {
    for (let yy = y; yy < y + h; yy++)
      for (let xx = x; xx < x + w; xx++) writePx(s, xx, yy, colr)
  }

  return { initCanvas }
}
