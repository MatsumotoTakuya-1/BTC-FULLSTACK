/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("histories", function (table) {
    table.increments("id").primary();
    table.string("symbol").notNullable();
    table.decimal("actual", 32, 2);
    table.date("actualDates");
    table.decimal("predicted", 32, 2);
    table.date("predictedDates");
    table.jsonb("company");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("histories");
};
