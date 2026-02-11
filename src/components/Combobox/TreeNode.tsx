import { useEffect, useRef } from "react"
import type { TreeNodeData, SelectionState } from "./types"

type Props = {
  node: TreeNodeData
  expanded: boolean
  selection: SelectionState
  isFocused: boolean
  onFocus: () => void
  onExpand: () => void
  onSelect: () => void
}

export function TreeNode({
  node,
  expanded,
  selection,
  isFocused,
  onFocus,
  onExpand,
  onSelect,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const checkboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.focus()
    }
  }, [isFocused])

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        selection === "indeterminate"
    }
  }, [selection])

  return (
    <div
      ref={ref}
      role="treeitem"
      tabIndex={isFocused ? 0 : -1}
      aria-expanded={node.hasChildren ? expanded : undefined}
      aria-checked={
        selection === "indeterminate"
          ? "mixed"
          : selection === "checked"
      }
      onClick={onFocus}
      className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${
        isFocused ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
    >
      {node.hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onExpand()
          }}
          aria-label={expanded ? "Collapse" : "Expand"}
          className="w-5 text-center"
        >
          {expanded ? "−" : "+"}
        </button>
      ) : (
        <span className="w-5" />
      )}

      <input
        ref={checkboxRef}
        type="checkbox"
        checked={selection === "checked"}
        onChange={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      />

      <span>{node.label}</span>
    </div>
  )
}
