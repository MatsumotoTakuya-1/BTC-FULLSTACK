/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("histories", (table) => {
    table.string("range");
    table.string("model");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("histories", (table) => {
    table.dropColumn("range");
    table.dropColumn("model");
  });
};
