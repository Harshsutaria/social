/*
 * Look here for reference https :      //node-postgres.com/
 */
declare interface PostgresLibrary {
  /**
   * Client connection with db-name
   * @async
   * @param databaseName Postgres-DB databaseName
   * @param [autoTx] transaction-mode is automatic by default, can use manual transaction mode with arg as false
   * @returns created client
   */
  clientConnect(databaseName: string, autoTx?: boolean): Promise<object>;

  /**
   * @param query query in string format
   * @param [values] arguments list for query
   * @returns result from query
   */
  execute(query: string, values?: any[]): Promise<any[]>;

  /**
   * Returns rowcount
   * @param query query in string format
   * @param [values] arguments list for query
   * @returns updated rows-count
   */
  executeInsertOrUpdate(query: string, values?: any[]): Promise<number>;

  /**
   * BEGIN the transaction
   */
  beginTx(): Promise<object>;

  /**
   * COMMIT the transaction
   */
  commitTx(): Promise<object>;

  /**
   * ROLLBACK transaction
   */
  rollbackTx(): Promise<object>;

  /**
   * CLOSE connection
   */
  close(params?: any): Promise<boolean>;

  errors: {
    ERR_INVALID_ARG: string;
    ERR_RECORD_NOT_FOUND: string;
    ERR_INVALID_DATA_TYPE: string;
  };
}
