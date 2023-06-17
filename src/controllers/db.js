const envconfig = require('config');
const knex = require('knex');
const bcrypt = require('bcrypt');
const timestamp = Date.now();

const environment = envconfig.get("environment");

// Point to knexfile 
const config = require('../knexfile');

// connect to DB
const db = knex(environment);

async function getAllUsers() {
    var query = await db('users').select()
    console.log(query)
    return query
}

module.exports = {
    getAllUsers
}