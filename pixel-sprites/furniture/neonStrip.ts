export const strip = Array.from({ length: 8 }, () =>
    Array.from({ length: 320 }, (_, x) => (x % 6 < 5 ? 2 : 0))
  )
  