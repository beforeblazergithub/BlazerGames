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

// src/server/index.ts
var server_exports = {};
__export(server_exports, {
  track: () => track
});
module.exports = __toCommonJS(server_exports);

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
function getMode() {
  const mode = isBrowser() ? window.vam : detectEnvironment();
  return mode || "production";
}
function isProduction() {
  return getMode() === "production";
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

// src/server/index.ts
function isHeaders(headers) {
  if (!headers) return false;
  return typeof headers.entries === "function";
}
var symbol = Symbol.for("@vercel/request-context");
var logPrefix = "[Vercel Web Analytics]";
async function track(eventName, properties, options) {
  var _a;
  const ENDPOINT = process.env.VERCEL_WEB_ANALYTICS_ENDPOINT || process.env.VERCEL_URL;
  const DISABLE_LOGS = Boolean(process.env.VERCEL_WEB_ANALYTICS_DISABLE_LOGS);
  const BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (typeof window !== "undefined") {
    if (!isProduction()) {
      throw new Error(
        `${logPrefix} It seems like you imported the \`track\` function from \`@vercel/web-analytics/server\` in a browser environment. This function is only meant to be used in a server environment.`
      );
    }
    return;
  }
  const props = parseProperties(properties, {
    strip: isProduction()
  });
  if (!ENDPOINT) {
    if (isProduction()) {
      console.log(
        `${logPrefix} Can't find VERCEL_URL in environment variables.`
      );
    } else if (!DISABLE_LOGS) {
      console.log(
        `${logPrefix} Track "${eventName}" ${props ? `with data ${JSON.stringify(props)}` : ""}`
      );
    }
    return;
  }
  try {
    const requestContext = (_a = globalThis[symbol]) == null ? void 0 : _a.get();
    let headers;
    if (options && "headers" in options) {
      headers = options.headers;
    } else if (options == null ? void 0 : options.request) {
      headers = options.request.headers;
    } else if (requestContext == null ? void 0 : requestContext.headers) {
      headers = requestContext.headers;
    }
    let tmp = {};
    if (headers && isHeaders(headers)) {
      headers.forEach((value, key) => {
        tmp[key] = value;
      });
    } else if (headers) {
      tmp = headers;
    }
    const url = ENDPOINT.startsWith("http") ? ENDPOINT : new URL("/_vercel/insights/event", `https://${ENDPOINT}`).toString();
    const body = {
      o: (requestContext == null ? void 0 : requestContext.url) || tmp.referer || new URL(url).origin,
      ts: Date.now(),
      sdkn: `${name}/server`,
      sdkv: version,
      r: "",
      en: eventName,
      ed: props,
      f: safeGetFlags(options == null ? void 0 : options.flags, requestContext)
    };
    const hasHeaders = Boolean(headers);
    if (!hasHeaders) {
      throw new Error(
        "No session context found. Pass `request` or `headers` to the `track` function."
      );
    }
    const promise = fetch(url, {
      headers: {
        "content-type": "application/json",
        ...hasHeaders ? {
          "user-agent": tmp["user-agent"],
          "x-vercel-ip": tmp["x-forwarded-for"],
          "x-va-server": "1",
          cookie: tmp.cookie
        } : {
          "x-va-server": "2"
        },
        ...BYPASS_SECRET ? { "x-vercel-protection-bypass": BYPASS_SECRET } : {}
      },
      body: JSON.stringify(body),
      method: "POST"
    }).then((response) => response.text()).catch((err) => {
      if (err instanceof Error && "response" in err) {
        console.error(err.response);
      } else {
        console.error(err);
      }
    });
    if (requestContext == null ? void 0 : requestContext.waitUntil) {
      requestContext.waitUntil(promise);
    } else {
      await promise;
    }
    return void 0;
  } catch (err) {
    console.error(err);
  }
}
function safeGetFlags(flags, requestContext) {
  var _a;
  try {
    if (flags && !Array.isArray(flags)) {
      return { p: flags };
    }
    if (!requestContext || !flags) return;
    const plainFlags = {};
    const resolvedPlainFlags = ((_a = requestContext.flags) == null ? void 0 : _a.getValues()) ?? {};
    for (const flag of flags) {
      if (typeof flag === "string") {
        plainFlags[flag] = resolvedPlainFlags[flag];
      } else {
        Object.assign(plainFlags, flag);
      }
    }
    return { p: plainFlags };
  } catch {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  track
});
//# sourceMappingURL=index.js.map