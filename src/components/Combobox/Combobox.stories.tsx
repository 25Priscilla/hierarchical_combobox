import type { Meta, StoryObj } from "@storybook/react"
import { Combobox } from "./Combobox"

const meta: Meta<typeof Combobox> = {
  title: "Components/HierarchicalCombobox",
  component: Combobox,
}

export default meta

type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: () => <Combobox />,
}
