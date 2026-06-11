import { QuartzTransformerPlugin } from "../types"

export const Tabs: QuartzTransformerPlugin = () => {
  return {
    name: "Tabs",
    textTransform: (_ctx, src) => {
      return src.replace(/	/g, "    ")
    },
  }
}
