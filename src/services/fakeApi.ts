import type { TreeNodeData } from "../components/Combobox/types"

export async function fetchChildren(
  parentId?: string
): Promise<TreeNodeData[]> {
  await new Promise(resolve => setTimeout(resolve, 500))

  return Array.from({ length: 20 }).map((_, i) => ({
    id: `${parentId ?? "root"}-${i}`,
    label: `Node ${parentId ?? "root"}-${i}`,
    hasChildren: Math.random() > 0.5,
    parentId,
  }))
}
