import { QuartzTransformerPlugin } from "../types"

export const Tabs: QuartzTransformerPlugin = () => {
  return {
    name: "Tabs",
    textTransform: (_ctx, src) => {
      return src.replace(/\t/g, "\u3000\u3000")
    },
  }
}
