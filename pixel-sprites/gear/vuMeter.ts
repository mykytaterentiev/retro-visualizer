export const bars = Array.from({ length: 16 }, (_, i) =>
    Array.from({ length: 4 }, () => (i >= 12 ? 4 : i >= 8 ? 3 : i >= 4 ? 2 : 0))
  )
  