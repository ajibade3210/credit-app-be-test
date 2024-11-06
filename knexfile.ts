import type { Knex } from "knex";
import "dotenv/config";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const sharedConfig: Partial<Knex.Config> = {
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

const config: { [key: string]: Knex.Config } = {
  test: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    ...sharedConfig,
  },

  development: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    ...sharedConfig,
  },

  staging: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    ...sharedConfig,
  },

  production: {
    client: "mysql2",
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
    },
    ...sharedConfig,
  },
};

export default config;
