"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
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

// src/nuxt/runtime/index.ts
var runtime_exports = {};
__export(runtime_exports, {
  Analytics: () => Analytics,
  injectAnalytics: () => injectAnalytics,
  track: () => track
});
module.exports = __toCommonJS(runtime_exports);
var import_app = require("nuxt/app");

// src/queue.ts
var initQueue = () => {
  if (window.va) return;
  window.va = function a(...params) {
    if (!window.vaq) window.vaq = [];
    window.vaq.push(params);
  };
};

// package.json
var name = "@vercel/analytics";
var version = "2.0.1";

// src/utils.ts
function isBrowser() {
  return typeof window !== "undefined";
}
function detectEnvironment() {
  try {
    const env = process.env.NODE_ENV;
    if (env === "development" || env === "test") {
      return "development";
    }
  } catch {
  }
  return "production";
}
function setMode(mode = "auto") {
  if (mode === "auto") {
    window.vam = detectEnvironment();
    return;
  }
  window.vam = mode;
}
function getMode() {
  const mode = isBrowser() ? window.vam : detectEnvironment();
  return mode || "production";
}
function isProduction() {
  return getMode() === "production";
}
function isDevelopment() {
  return getMode() === "development";
}
function removeKey(key, { [key]: _, ...rest }) {
  return rest;
}
function parseProperties(properties, options) {
  if (!properties) return void 0;
  let props = properties;
  const errorProperties = [];
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === "object" && value !== null) {
      if (options.strip) {
        props = removeKey(key, props);
      } else {
        errorProperties.push(key);
      }
    }
  }
  if (errorProperties.length > 0 && !options.strip) {
    throw Error(
      `The following properties are not valid: ${errorProperties.join(
        ", "
      )}. Only strings, numbers, booleans, and null are allowed.`
    );
  }
  return props;
}
function computeRoute(pathname, pathParams) {
  if (!pathname || !pathParams) {
    return pathname;
  }
  let result = pathname;
  try {
    const entries = Object.entries(pathParams);
    for (const [key, value] of entries) {
      if (!Array.isArray(value)) {
        const matcher = turnValueToRegExp(value);
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[${key}]`);
        }
      }
    }
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        const matcher = turnValueToRegExp(value.join("/"));
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[...${key}]`);
        }
      }
    }
    return result;
  } catch {
    return pathname;
  }
}
function turnValueToRegExp(value) {
  return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getScriptSrc(props) {
  if (props.scriptSrc) {
    return makeAbsolute(props.scriptSrc);
  }
  if (isDevelopment()) {
    return "https://va.vercel-scripts.com/v1/script.debug.js";
  }
  if (props.basePath) {
    return makeAbsolute(`${props.basePath}/insights/script.js`);
  }
  return "/_vercel/insights/script.js";
}
function loadProps(explicitProps, confString) {
  var _a;
  let props = explicitProps;
  if (confString) {
    try {
      props = {
        ...(_a = JSON.parse(confString)) == null ? void 0 : _a.analytics,
        ...explicitProps
      };
    } catch {
    }
  }
  setMode(props.mode);
  const dataset = {
    sdkn: name + (props.framework ? `/${props.framework}` : ""),
    sdkv: version
  };
  if (props.disableAutoTrack) {
    dataset.disableAutoTrack = "1";
  }
  if (props.viewEndpoint) {
    dataset.viewEndpoint = makeAbsolute(props.viewEndpoint);
  }
  if (props.eventEndpoint) {
    dataset.eventEndpoint = makeAbsolute(props.eventEndpoint);
  }
  if (props.sessionEndpoint) {
    dataset.sessionEndpoint = makeAbsolute(props.sessionEndpoint);
  }
  if (isDevelopment() && props.debug === false) {
    dataset.debug = "false";
  }
  if (props.dsn) {
    dataset.dsn = props.dsn;
  }
  if (props.endpoint) {
    dataset.endpoint = props.endpoint;
  } else if (props.basePath) {
    dataset.endpoint = makeAbsolute(`${props.basePath}/insights`);
  }
  return {
    beforeSend: props.beforeSend,
    src: getScriptSrc(props),
    dataset
  };
}
function makeAbsolute(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") ? url : `/${url}`;
}

// src/generic.ts
function inject(props = {
  debug: true
}, confString) {
  var _a;
  if (!isBrowser()) return;
  const { beforeSend, src, dataset } = loadProps(props, confString);
  initQueue();
  if (beforeSend) {
    (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", beforeSend);
  }
  if (document.head.querySelector(`script[src*="${src}"]`)) return;
  const script = document.createElement("script");
  script.src = src;
  for (const [key, value] of Object.entries(dataset)) {
    script.dataset[key] = value;
  }
  script.defer = true;
  script.onerror = () => {
    const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
    console.log(
      `[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`
    );
  };
  document.head.appendChild(script);
}
function track(name2, properties, options) {
  var _a, _b;
  if (!isBrowser()) {
    const msg = "[Vercel Web Analytics] Please import `track` from `@vercel/analytics/server` when using this function in a server environment";
    if (isProduction()) {
      console.warn(msg);
    } else {
      throw new Error(msg);
    }
    return;
  }
  if (!properties) {
    (_a = window.va) == null ? void 0 : _a.call(window, "event", { name: name2, options });
    return;
  }
  try {
    const props = parseProperties(properties, {
      strip: isProduction()
    });
    (_b = window.va) == null ? void 0 : _b.call(window, "event", {
      name: name2,
      data: props,
      options
    });
  } catch (err) {
    if (err instanceof Error && isDevelopment()) {
      console.error(err);
    }
  }
}
function pageview({
  route,
  path
}) {
  var _a;
  (_a = window.va) == null ? void 0 : _a.call(window, "pageview", { route, path });
}

// src/vue/create-component.ts
var import_vue = require("vue");
var import_vue_router = require("vue-router");

// src/vue/utils.ts
var import_meta = {};
function getBasePath() {
  try {
    return import_meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH;
  } catch {
  }
}
function getConfigString() {
  try {
    return import_meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
  } catch {
  }
}

// src/vue/create-component.ts
function createComponent(framework = "vue") {
  return (0, import_vue.defineComponent)({
    props: ["dsn", "beforeSend", "debug", "scriptSrc", "endpoint", "mode"],
    setup(props) {
      const route = (0, import_vue_router.useRoute)();
      inject(
        {
          // trim out undefined values to avoid overriding config values
          ...Object.fromEntries(
            Object.entries(props).filter(([_, v]) => v !== void 0)
          ),
          basePath: getBasePath(),
          // keep auto-tracking unless we have route support (Nuxt or vue-router).
          disableAutoTrack: Boolean(route),
          framework
        },
        getConfigString()
      );
      if (route && typeof window !== "undefined") {
        const changeRoute = () => {
          pageview({
            route: computeRoute(route.path, route.params),
            path: route.path
          });
        };
        changeRoute();
        (0, import_vue.watch)(route, changeRoute);
      }
    },
    // Vue component must have a render function, or a template.
    render() {
      return null;
    }
  });
}

// src/nuxt/runtime/utils.ts
var import_meta2 = {};
function getBasePath2() {
  try {
    return import_meta2.env.VITE_VERCEL_OBSERVABILITY_BASEPATH;
  } catch {
  }
}
function getConfigString2() {
  try {
    return import_meta2.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
  } catch {
  }
}

// src/nuxt/runtime/index.ts
var Analytics = createComponent("nuxt");
function injectAnalytics(props = {}) {
  if (isBrowser()) {
    const router = (0, import_app.useRouter)();
    (0, import_app.onNuxtReady)(() => {
      inject(
        {
          ...props,
          framework: "nuxt",
          disableAutoTrack: true,
          basePath: getBasePath2()
        },
        getConfigString2()
      );
      const route = (0, import_app.useRoute)();
      pageview({
        route: computeRoute(route.path, route.params),
        path: route.path
      });
    });
    router.afterEach((to) => {
      pageview({
        route: computeRoute(to.path, to.params),
        path: to.path
      });
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Analytics,
  injectAnalytics,
  track
});
//# sourceMappingURL=index.js.map