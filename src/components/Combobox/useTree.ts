import { useCallback, useState } from "react"
import { fetchChildren } from "../../services/fakeApi"
import type { TreeNodeData, SelectionState } from "./types"

type TreeMap = Record<string, TreeNodeData[]>

export function useTree() {
  const [nodes, setNodes] = useState<TreeMap>({})
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [selection, setSelection] = useState<Record<string, SelectionState>>({})

  const loadChildren = useCallback(
    async (nodeId?: string) => {
      const key = nodeId ?? "root"
      if (nodes[key]) return

      const children = await fetchChildren(nodeId)

      setNodes(prev => ({
        ...prev,
        [key]: children,
      }))
    },
    [nodes]
  )

  // -----------------------------
  // Expand / collapse
  // -----------------------------
  const toggleExpand = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  // -----------------------------
  // Helpers
  // -----------------------------
  function getDescendants(id: string): string[] {
    const children = nodes[id] ?? []
    return children.flatMap(child => [
      child.id,
      ...getDescendants(child.id),
    ])
  }

  function getParentId(childId: string): string | null {
    for (const parentId in nodes) {
      if (nodes[parentId].some(n => n.id === childId)) {
        return parentId === "root" ? null : parentId
      }
    }
    return null
  }

  // -----------------------------
  // Selection toggle with propagation
  // -----------------------------
  const toggleSelect = useCallback(
    (id: string) => {
      setSelection(prev => {
        const next = { ...prev }
        const current = prev[id] ?? "unchecked"
        const nextValue: SelectionState =
          current === "checked" ? "unchecked" : "checked"

        // self
        next[id] = nextValue

        // ⬇️ propagate down
        getDescendants(id).forEach(childId => {
          next[childId] = nextValue
        })

        // ⬆️ propagate up
        let parent = getParentId(id)
        while (parent) {
          const siblings = nodes[parent] ?? []
          const states = siblings.map(
            s => next[s.id] ?? "unchecked"
          )

          if (states.every(s => s === "checked")) {
            next[parent] = "checked"
          } else if (states.every(s => s === "unchecked")) {
            next[parent] = "unchecked"
          } else {
            next[parent] = "indeterminate"
          }

          parent = getParentId(parent)
        }

        return next
      })
    },
    [nodes]
  )

  return {
    nodes,
    expanded,
    selection,
    loadChildren,
    toggleExpand,
    toggleSelect,
  }
}
