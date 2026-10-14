// src/remix/index.tsx
import React from "react";

// src/react/index.tsx
import { useEffect } from "react";

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
function isDevelopment() {
  return getMode() === "development";
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
function pageview({
  route,
  path
}) {
  var _a;
  (_a = window.va) == null ? void 0 : _a.call(window, "pageview", { route, path });
}

// src/react/utils.ts
function getBasePath() {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return void 0;
  }
  return process.env.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
}
function getConfigString() {
  if (typeof process === "undefined" || typeof process.env === "undefined") {
    return void 0;
  }
  return process.env.REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
}

// src/react/index.tsx
function Analytics(props) {
  useEffect(() => {
    var _a;
    if (props.beforeSend) {
      (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
    }
  }, [props.beforeSend]);
  useEffect(() => {
    inject(
      {
        framework: props.framework || "react",
        basePath: props.basePath ?? getBasePath(),
        ...props.route !== void 0 && { disableAutoTrack: true },
        ...props
      },
      props.configString ?? getConfigString()
    );
  }, []);
  useEffect(() => {
    if (props.route && props.path) {
      pageview({ route: props.route, path: props.path });
    }
  }, [props.route, props.path]);
  return null;
}

// src/remix/utils.ts
import { useLocation, useParams } from "@remix-run/react";
var useRoute = () => {
  const params = useParams();
  const { pathname: path } = useLocation();
  return { route: computeRoute(path, params), path };
};
function getBasePath2() {
  try {
    return import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH;
  } catch {
  }
}
function getConfigString2() {
  try {
    return import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
  } catch {
  }
}

// src/remix/index.tsx
function Analytics2(props) {
  return /* @__PURE__ */ React.createElement(
    Analytics,
    {
      ...useRoute(),
      ...props,
      basePath: getBasePath2(),
      configString: getConfigString2(),
      framework: "remix"
    }
  );
}
export {
  Analytics2 as Analytics
};
//# sourceMappingURL=index.mjs.map