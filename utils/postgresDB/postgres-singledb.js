/// <reference path="./postgres-schema.d.ts" />

const pg = require("pg");
const Properties = require("./config");
const {
  ParamsError,
  ErrorConstants,
  LibError,
  ConnectionError,
} = require("./postgres-errors");
const util = require("util");
const debug = util.debuglog("postgres");

const connectionParams = {
  user: Properties.rdbms.user,
  password: Properties.rdbms.password,
  host: Properties.rdbms.host,
  port: Properties.rdbms.port,
  application_name: `Social`,
  database: "commondb",
};

/**
 * @type PostgresLibrary
 */
const postgres = {};

let client;

async function connect(databaseName, autoTx = true) {
  /* Param Validation */
  if (!databaseName) {
    throw new ParamsError(
      ErrorConstants.ERR_INVALID_ARG,
      "DATABASE-NAME IS INVALID",
      { databaseName }
    );
  }

  if (!client || connectionParams.database !== databaseName) {
    // Close the existing connection, if client isn't there & given-database is different
    if (client && connectionParams.database !== databaseName) {
      await postgres.close({ envCheck: false });
    }

    debug(`Creating RDBMS client for db:${databaseName}`);
    connectionParams.database = databaseName;
    if (!autoTx) {
      client = new pg.Pool(connectionParams);
      debug("PG POOL CREATED | TRANSACTION-MODE: MANUAL");
      return client;
    }

    client = new pg.Client(connectionParams);

    try {
      await client.connect();
      debug("PG CLIENT CREATED | TRANSACTION-MODE: AUTO");
    } catch (error) {
      debug("PG CONNECTION ERROR", error.stack);
      throw new ConnectionError(error);
    }
  } else {
    debug("RE-USING PG CLIENT");
  }
  return client;
}

postgres.execute = async function (query, values, iterate = 0) {
  /* Param Validation */
  if (!query) {
    throw new ParamsError(ErrorConstants.ERR_INVALID_ARG, query, values);
  }

  const params = {
    text: query,
    values: values || [],
  };

  debug("PARAMS: ", params);
  try {
    await handleConnection(client);
    const result = await client.query(params).then((data) => data.rows);
    return result;
  } catch (error) {
    iterate += 1;
    if (error.message.includes("not queryable") && iterate < 3) {
      console.error(
        `CLIENT-ERROR OCCURRED :: `,
        JSON.stringify({ error }, null, 2)
      );
      console.dir(client, { depth: 0 });
      console.warn(`RETRYING AGAIN iterate:${iterate}`);
      await postgres.clientConnect(connectionParams.database);
      // @ts-ignore
      return this.execute(query, values, iterate);
    }
    throw new LibError(error);
  }
};

postgres.executeInsertOrUpdate = async function (query, values) {
  /* Param Validation */
  if (!query) {
    throw new ParamsError(ErrorConstants.ERR_INVALID_ARG, query, values);
  }

  const params = {
    text: query,
    values: values || [],
  };

  debug("PARAMS:", params);
  try {
    await handleConnection(client);
    const result = await client.query(params).then((data) => data.rowCount);
    return result;
  } catch (error) {
    throw new LibError(error);
  }
};

postgres.beginTx = async function () {
  debug("BEGIN transaction");
  try {
    await handleConnection(client);
    return await client.query(`BEGIN`);
  } catch (error) {
    throw error;
  }
};

postgres.commitTx = async function () {
  debug("COMMIT transaction");
  try {
    await handleConnection(client);
    return client.query(`COMMIT`);
  } catch (error) {
    throw error;
  }
};

postgres.rollbackTx = async function () {
  debug("ROLLBACK transaction");
  try {
    await handleConnection(client);
    return client.query(`ROLLBACK`);
  } catch (error) {
    throw error;
  }
};

postgres.close = async function ({ envCheck = true } = {}) {
  try {
    if (envCheck && config.environment === "development") return false;
    try {
      await handleConnection(client);
    } catch (error) {
      console.warn(error);
    }
    await client.end();
    debug("CLOSED connection");
    client = null;
    return true;
  } catch (error) {
    return false;
  }
};

async function handleConnection(pgClient) {
  if (typeof pgClient == "undefined") {
    debug("pgClient is undefined");
    throw new Error("client connection not found");
  } else if (pgClient.readyForQuery || pgClient._queryable) {
    debug("pgClient is ready for query");
    return true;
  } else if (pgClient._connecting) {
    debug("pgClient is connecting", pgClient);
    await pgClient.connect();
  } else if (pgClient._connectionError) {
    debug("pgClient is unable to connect", pgClient);
    throw new Error("Client connection error, unable to connect");
  } else if (pgClient) {
    debug("pgClient is having issue", pgClient);
    await pgClient.connect();
  }
  return true;
}

postgres.clientConnect = connect;

postgres.errors = ErrorConstants;

module.exports = postgres;
