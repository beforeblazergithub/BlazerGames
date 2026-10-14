// src/nuxt/module.ts
import { addPlugin, addTemplate, defineNuxtModule } from "@nuxt/kit";
var module_default = defineNuxtModule({
  meta: {
    name: "@vercel/analytics",
    configKey: "analytics",
    docs: "https://vercel.com/docs/analytics/quickstart"
  },
  setup() {
    const template = addTemplate({
      filename: "vercel-analytics.client.ts",
      getContents: () => `
import { injectAnalytics } from '@vercel/analytics/nuxt/runtime'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  injectAnalytics()
})
`
    });
    addPlugin({
      src: template.dst,
      mode: "client"
    });
  }
});
export {
  module_default as default
};
//# sourceMappingURL=index.mjs.map