class ConnectionError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "ConnectionError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConnectionError);
    }
  }
}

class LibError extends Error {
  constructor(err = {}) {
    super(err.message);
    console.error(`POSTGRES-ERROR :: `, err);

    this.message = err.message;
    this.stack = err.stack;
    this.name = "LibError";

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LibError);
    }
  }
}

class ParamsError extends Error {
  constructor(msg, query, values) {
    super(msg);
    this.name = "ParametersError";
    this.query = query;
    this.values = values;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LibError);
    }
  }
}

const ErrorConstants = {
  ERR_INVALID_ARG: "ERR_INVALID_ARG",
  ERR_RECORD_NOT_FOUND: "ERR_RECORD_NOT_FOUND",
  ERR_INVALID_DATA_TYPE: "ERR_INVALID_DATA_TYPE",
};

module.exports = {
  ConnectionError,
  ParamsError,
  LibError,
  ErrorConstants,
};
