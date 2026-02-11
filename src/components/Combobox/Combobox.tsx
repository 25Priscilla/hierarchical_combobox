import { useEffect, useState, useRef } from "react"
import type { KeyboardEvent } from "react"
import { useTree } from "./useTree"
import { TreeNode } from "./TreeNode"

export function Combobox() {
  const {
    nodes,
    expanded,
    selection,
    loadChildren,
    toggleExpand,
    toggleSelect,
  } = useTree()

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  // ----------------------------------
  // Load root nodes
  // ----------------------------------
  useEffect(() => {
    let mounted = true

    async function loadRoot() {
      await loadChildren()
      if (mounted) setLoading(false)
    }

    loadRoot()

    return () => {
      mounted = false
    }
  }, [loadChildren])

  const rootNodes = nodes["root"] ?? []

  // ----------------------------------
  // Helpers
  // ----------------------------------
  function getParentId(childId: string): string | null {
    for (const parentId in nodes) {
      if (nodes[parentId].some(n => n.id === childId)) {
        return parentId === "root" ? null : parentId
      }
    }
    return null
  }

  // ----------------------------------
  // Search visibility (ancestry preserved)
  // ----------------------------------
  const lowerQuery = query.toLowerCase()
  const isSearching = query.length > 0

  function getSearchVisibleIds(): Set<string> {
    const visible = new Set<string>()
    if (!isSearching) return visible

    Object.values(nodes)
      .flat()
      .forEach(node => {
        if (node.label.toLowerCase().includes(lowerQuery)) {
          visible.add(node.id)

          let parent = getParentId(node.id)
          while (parent) {
            visible.add(parent)
            parent = getParentId(parent)
          }
        }
      })

    return visible
  }

  const searchVisibleIds = getSearchVisibleIds()

  // ----------------------------------
  // Visible nodes (expanded + search)
  // ----------------------------------
  function getVisibleNodes(parentId: string = "root"): string[] {
    const children = nodes[parentId] ?? []

    return children.flatMap(node => {
      if (isSearching && !searchVisibleIds.has(node.id)) {
        return []
      }

      const self = [node.id]

      if (
        expanded.has(node.id) ||
        (isSearching && searchVisibleIds.has(node.id))
      ) {
        return self.concat(getVisibleNodes(node.id))
      }

      return self
    })
  }

  const visibleIds = getVisibleNodes()

  // ----------------------------------
  // Keyboard navigation
  // ----------------------------------
  function onTreeKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!focusedId) return

    const index = visibleIds.indexOf(focusedId)
    if (index === -1) return

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault()
        const next = visibleIds[index + 1]
        if (next) setFocusedId(next)
        break
      }

      case "ArrowUp": {
        e.preventDefault()
        const prev = visibleIds[index - 1]
        if (prev) setFocusedId(prev)
        break
      }

      case "ArrowRight": {
        e.preventDefault()
        if (!expanded.has(focusedId)) {
          toggleExpand(focusedId)
          loadChildren(focusedId)
        }
        break
      }

      case "ArrowLeft": {
        e.preventDefault()
        if (expanded.has(focusedId)) {
          toggleExpand(focusedId)
        }
        break
      }

      case "Enter":
      case " ": {
        e.preventDefault()
        toggleSelect(focusedId)
        break
      }
    }
  }

  // ----------------------------------
  // Selected tags
  // ----------------------------------
  const selectedIds = Object.entries(selection)
    .filter(([, state]) => state === "checked")
    .map(([id]) => id)

  return (
    <div className="relative w-80">
      {/* Selected tags */}
      <div className="flex flex-wrap gap-1 mb-1">
        {selectedIds.map(id => (
          <span
            key={id}
            className="px-2 py-0.5 text-xs bg-gray-200 rounded"
          >
            {id}
          </span>
        ))}
      </div>

      {/* Combobox input (search) */}
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="tree-popup"
        aria-autocomplete="list"
        aria-haspopup="tree"
        placeholder="Search nodes…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setFocusedId(null)
        }}
        onFocus={() => {
          setIsOpen(true)
          setFocusedId(visibleIds[0] ?? null)
        }}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
      />

      {/* Dropdown */}
      {isOpen && (
        <div
          id="tree-popup"
          role="tree"
          aria-multiselectable="true"
          tabIndex={0}
          onKeyDown={onTreeKeyDown}
          className="absolute z-10 mt-1 w-full max-h-72 overflow-auto border rounded bg-white p-2 focus:outline-none"
        >
          {loading && (
            <div className="text-sm text-gray-400">
              Loading nodes…
            </div>
          )}

          {!loading &&
            rootNodes.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                expanded={expanded.has(node.id)}
                selection={selection[node.id] ?? "unchecked"}
                isFocused={focusedId === node.id}
                onFocus={() => setFocusedId(node.id)}
                onExpand={() => {
                  toggleExpand(node.id)
                  loadChildren(node.id)
                }}
                onSelect={() => toggleSelect(node.id)}
              />
            ))}
        </div>
      )}
    </div>
  )
}
