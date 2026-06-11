import { QuartzTransformerPlugin } from "../types"

export const Tabs: QuartzTransformerPlugin = () => {
  return {
    name: "Tabs",
    textTransform: (_ctx, src: string) => {
      return src.replace(/\t/g, "\u00A0\u00A0\u00A0\u00A0")
    },
  }
}
