/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("histories", function (table) {
    table.increments("id").primary();
    table.string("symbol").notNullable();
    table.specificType("actual", "double precision[]");
    table.specificType("actualDates", "text[]");
    table.specificType("predicted", "double precision[]");
    table.specificType("predictedDates", "text[]");
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
