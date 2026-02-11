export type TreeNodeData = {
  id: string
  label: string
  hasChildren: boolean
  parentId?: string
}

export type SelectionState =
  | "checked"
  | "unchecked"
  | "indeterminate"
