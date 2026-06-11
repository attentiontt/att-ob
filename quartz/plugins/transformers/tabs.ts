import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"

export const Tabs: QuartzTransformerPlugin = () => {
  return {
    name: "Tabs",
    remarkPlugins: [
      () => (tree) => {
        visit(tree, "text", (node: { value: string }) => {
          if (node.value.includes("\t")) {
            node.value = node.value.replace(/\t/g, "\u00A0\u00A0\u00A0\u00A0")
          }
        })
      },
    ],
  }
}
