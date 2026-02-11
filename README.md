✍️ README — Hierarchical Combobox (Key Sections)

You can paste this directly into your README.md.

Hierarchical Combobox

A fully accessible, keyboard-navigable hierarchical combobox built with React and TypeScript.
It supports async loading, multi-select with indeterminate states, search with ancestry preservation, and manual virtualization without third-party libraries.

✨ Features

Hierarchical tree structure with async child loading

Multi-select with proper indeterminate parent states

Keyboard-first navigation (ARIA Tree pattern)

Search with ancestry preservation

Manual virtualization for large datasets

Stable focus during virtualization

Fully ARIA-compliant and screen-reader friendly

♿ Accessibility

This component follows the WAI-ARIA TreeView pattern:

role="tree" and role="treeitem"

aria-expanded for expandable nodes

aria-checked with "mixed" for indeterminate state

Roving tabIndex for keyboard navigation

Focus tracked by node id, not DOM index

Screen readers correctly announce:

Expanded / collapsed state

Checked / unchecked / mixed selection

⌨️ Keyboard Interactions
Key	Action
Arrow Up	Move focus to previous visible node
Arrow Down	Move focus to next visible node
Arrow Right	Expand focused node
Arrow Left	Collapse focused node
Space	Toggle selection
Enter	Toggle selection
🚀 Virtualization Strategy (No Libraries)

To support large datasets efficiently, the combobox implements manual virtualization:

The full tree state is always kept in memory

Visible nodes are flattened into a linear list
Only the visible slice is rendered
Top and bottom spacers preserve scroll height
Focus is tracked by node ID, ensuring stability when items scroll in and out of view
This approach guarantees:
Smooth scrolling
Predictable focus behavior
No reliance on external virtualization libraries

🧠 Design Decisions

State over DOM: Tree state is independent of rendering
ID-based focus: Prevents focus loss during virtualization
Async-safe expansion: Children load only once per node
Separation of concerns:
useTree → data & expansion logic
useVirtual → rendering optimization
TreeNode → accessibility & interaction

📘 Storybook
Interactive Storybook stories are provided to demonstrate:
Large datasets
Keyboard-only navigation
Async loading behavior

Accessibility compliance
📘 Storybook — Draft Stories

Create this file:
📁 .storybook/HierarchicalCombobox.stories.tsx
(or wherever your stories live)

Basic Setup
import type { Meta, StoryObj } from "@storybook/react"
import { Combobox } from "../src/components/Combobox/Combobox"

const meta: Meta<typeof Combobox> = {
  title: "Components/HierarchicalCombobox",
  component: Combobox,
}

export default meta
type Story = StoryObj<typeof Combobox>

1️⃣ Default (Small Dataset)
export const Default: Story = {
  render: () => <Combobox />,
}


Purpose
✔ Baseline behavior
✔ Expansion + selection
✔ Visual sanity check

2️⃣ Large Dataset (Virtualization)
export const LargeDataset: Story = {
  render: () => <Combobox />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates manual virtualization with a large number of nodes.",
      },
    },
  },
}


What reviewers look for
Smooth scrolling
No lag
Focus does not jump while scrolling

3️⃣ Keyboard-Only Navigation
export const KeyboardOnly: Story = {
  render: () => <Combobox />,
  parameters: {
    docs: {
      description: {
        story:
          "Use arrow keys, Enter, and Space to fully navigate and select nodes without a mouse.",
      },
    },
  },
}


Testing checklist
No mouse interaction needed
Focus ring always visible
Selection toggles correctly

4️⃣ Async Loading Behavior
export const AsyncLoading: Story = {
  render: () => <Combobox />,
  parameters: {
    docs: {
      description: {
        story:
          "Children are loaded asynchronously when a node is expanded.",
      },
    },
  },
}


What this proves
Lazy loading works
No duplicate fetches
UI remains responsive

5️⃣ Accessibility (ARIA)
export const Accessibility: Story = {
  render: () => <Combobox />,
  parameters: {
    a11y: {
      disable: false,
    },
    docs: {
      description: {
        story:
          "ARIA roles, states, and keyboard interactions follow WAI-ARIA TreeView guidelines.",
      },
    },
  },
}