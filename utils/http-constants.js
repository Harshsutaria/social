const HTTPConst = {
  info: {
    CONTINUE: 100,
    SWITCHING_PROTOCOL: 101,
    PROCESSING: 102,
    EARLY_HINTS: 103,
  },

  success: {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    ALREADY_REPORTED: 208,
  },

  redirect: {
    MULTI_CHOICES: 300,
    MOVED_PERM: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    UNUSED: 306,
    TEMP_REDIRECT: 307,
    PERM_REDIRECT: 308,
  },

  clientError: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTH_REQUIRED: 407,
    REQ_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
  },

  serverError: {
    INTERNAL_SERVER: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
  },
};

const buildResponse = function (code, data = {}, info = "", res) {
  if (res) {
    res.status(code);
  }
  return { code, data, info };
};

const buildError = function (
  code = HTTPConst.serverError.INTERNAL_SERVER,
  errorMsg = "",
  info = ""
) {
  return {
    code,
    error: errorMsg,
    info,
  };
};
module.exports = { HTTPConst, buildResponse, buildError };
