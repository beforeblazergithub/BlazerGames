// This file overwrites the stock UV config.js

self.__uv$config = {
  prefix: "/frog/ixl/",
  bare: "/bare/",
  encodeUrl: Ultraviolet.codec.base64.encode,
  decodeUrl: Ultraviolet.codec.base64.decode,
  handler: "/frog/handler.js",
  client: "/frog/client.js",
  bundle: "/frog/bundle.js",
  config: "/frog/config.js",
  sw: "/frog/fr.sw.js",
};
