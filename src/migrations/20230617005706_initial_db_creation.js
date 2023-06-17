/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('roles', table => {
        table.increments();
        table.string('role').notNullable().index();
        table.timestamps(true, true);
    })
    .createTable('users', table => {
      table.increments();
      table.string('callsign').notNullable().index();
      table.string('password').notNullable().index();
      table.integer('role')
            .unsigned()
            .references('id')
            .inTable('roles')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
            .notNullable()
            .index();
      table.timestamps(true, true);
      })
      .createTable('astdb', table => {
        table.string('node_number').notNullable().index();
        table.string('callsign').notNullable().index();
        table.string('description').notNullable().index();
        table.string('location').notNullable().index();
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
