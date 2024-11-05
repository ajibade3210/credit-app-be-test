import "dotenv/config";
import Knex from "knex";
import config from "../../knexfile";

const { NODE_ENV } = process.env;
const environment = NODE_ENV || "development";

const knex = Knex(config[environment]);

export const onDatabaseConnect = async () => knex.raw("SELECT 1");

export default knex;
