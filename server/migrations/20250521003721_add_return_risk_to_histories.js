/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("histories", (table) => {
    table.string("annualReturn");
    table.string("annualResk");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("histories", (table) => {
    table.dropColumn("annualReturn");
    table.dropColumn("annualResk");
  });
};
