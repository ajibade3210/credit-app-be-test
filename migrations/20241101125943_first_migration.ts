import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("users");
  if (!exists) {
    await knex.schema
      .createTable("users", table => {
        table.increments("id").primary(); // Auto-incrementing integer ID
        table.string("bvn").notNullable();
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("password").notNullable();
        table.date("date_of_birth").notNullable();
        table.integer("age").notNullable();
        table.string("phone_number").notNullable();
        table.string("unique_email").notNullable().unique();
        table.timestamps(true, true);
      })
      .createTable("wallets", table => {
        table.increments("id").primary();
        table.decimal("balance", 14, 2).notNullable().defaultTo(0);
        table.string("currency", 3).notNullable();
        table
          .enum("type", ["standard", "regular", "premium"], {
            useNative: true,
            enumName: "wallet_type",
          })
          .notNullable()
          .defaultTo("standard");
        table
          .integer("user_id")
          .unsigned()
          .references("id")
          .inTable("users")
          .notNullable()
          .onDelete("CASCADE");
        table.timestamps(true, true);
        table.unique(["user_id", "type"]);
      })
      .createTable("transactions", table => {
        table.increments("id").primary();
        table.string("amount").notNullable();
        table.string("reference").notNullable();
        table.text("narration").nullable();
        table
          .integer("wallet_id")
          .unsigned() // Use unsigned for foreign key relations
          .references("id")
          .inTable("wallets")
          .notNullable()
          .onDelete("CASCADE");
        table
          .integer("mandate_id")
          .unsigned() // Use unsigned for foreign key relations
          .references("id")
          .inTable("users")
          .notNullable()
          .onDelete("CASCADE");
        table
          .integer("beneficiary_id")
          .unsigned() // Use unsigned for foreign key relations
          .references("id")
          .inTable("users")
          .notNullable()
          .onDelete("CASCADE");
        table.timestamps(true, true);
      });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists("transactions")
    .dropTableIfExists("wallets")
    .dropTableIfExists("users");
}
