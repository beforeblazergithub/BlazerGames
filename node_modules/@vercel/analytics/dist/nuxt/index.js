"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/nuxt/module.ts
var module_exports = {};
__export(module_exports, {
  default: () => module_default
});
module.exports = __toCommonJS(module_exports);
var import_kit = require("@nuxt/kit");
var module_default = (0, import_kit.defineNuxtModule)({
  meta: {
    name: "@vercel/analytics",
    configKey: "analytics",
    docs: "https://vercel.com/docs/analytics/quickstart"
  },
  setup() {
    const template = (0, import_kit.addTemplate)({
      filename: "vercel-analytics.client.ts",
      getContents: () => `
import { injectAnalytics } from '@vercel/analytics/nuxt/runtime'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin(() => {
  injectAnalytics()
})
`
    });
    (0, import_kit.addPlugin)({
      src: template.dst,
      mode: "client"
    });
  }
});
//# sourceMappingURL=index.js.map