import { useState } from "react"

export function useVirtual(
  total: number,
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleCount =
    Math.ceil(containerHeight / itemHeight) + 1

  const start = Math.floor(scrollTop / itemHeight)
  const end = Math.min(
    total - 1,
    start + visibleCount
  )

  const offsetTop = start * itemHeight
  const offsetBottom =
    (total - end - 1) * itemHeight

  return {
    start,
    end,
    offsetTop,
    offsetBottom,
    totalHeight: total * itemHeight,
    setScrollTop,
  }
}
