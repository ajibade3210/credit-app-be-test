import { Knex } from "knex";
import knex from "../config/knex";

class BaseModel<T> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create(data: Partial<T>, trx?: Knex.Transaction): Promise<Number> {
    const [id] = await (trx || knex)(this.tableName).insert(data);
    return id;
  }

  async findOne(properties: Partial<T>): Promise<T | undefined> {
    return knex(this.tableName).where(properties).first();
  }

  async findAll(
    where?: Partial<T>,
    queryOptions?: {
      limit?: number;
      offset?: number;
      orderBy?: keyof T;
      order?: "asc" | "desc";
    }
  ): Promise<T[]> {
    let query = knex(this.tableName).where(where || {});
    if (queryOptions) {
      const { limit, offset, orderBy, order } = queryOptions;
      if (limit) query = query.limit(limit);
      if (offset) query = query.offset(offset);
      if (orderBy) query = query.orderBy(orderBy, order || "asc");
    }
    return query;
  }

  async findById(id: number, trx?: Knex.Transaction): Promise<T | undefined> {
    const data = await (trx || knex)(this.tableName).where({ id }).first();
    return data;
  }

  async update(
    id: number,
    data: Partial<T>,
    trx?: Knex.Transaction
  ): Promise<number | undefined> {
    const record = await (trx || knex)(this.tableName)
      .where({ id })
      .update(data);
    return record;
  }

  async delete(id: number, trx?: Knex.Transaction): Promise<number> {
    const deletedCount = await (trx || knex)(this.tableName)
      .where({ id })
      .del();
    return deletedCount;
  }
}

export default BaseModel;
