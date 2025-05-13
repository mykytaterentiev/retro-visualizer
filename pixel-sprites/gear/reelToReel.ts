const circle = (r: number, off = 0) => {
  const f: number[][] = []
  for (let y = 0; y < 48; y++) {
    const row: number[] = []
    for (let x = 0; x < 48; x++) {
      const d = Math.hypot(x - 24, y - 24)
      const spoke = ((Math.atan2(y - 24, x - 24) + Math.PI * 2) % (Math.PI / 2) < 0.1 + off)
      row.push(d < r ? (spoke ? 2 : 1) : 0)
    }
    f.push(row)
  }
  return f
}
export const frames = [circle(20, 0), circle(20, 0.05)]
