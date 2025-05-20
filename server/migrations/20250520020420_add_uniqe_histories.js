/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("histories", (table) => {
    table.unique(["symbol", "range", "model"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("histories", (table) => {
    table.dropUnique(["symbol", "range", "model"]);
  });
};
