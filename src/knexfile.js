// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    development: {
      client: 'sqlite3',
      connection: {
        filename: './data/dev.db3'
      },
      useNullAsDefault: true
    },
    production: {
      client: 'sqlite3',
      connection: {
        filename: './data/prod.db3'
      },
      useNullAsDefault: true
    }
  };
