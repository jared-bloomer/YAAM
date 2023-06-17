const config = require('config');
const knex = require('knex');
const bcrypt = require('bcrypt');
const timestamp = Date.now();

const environment = config.get("environment");

// Point to knexfile 
const config = require('../knexfile');

// connect to DB
const db = knex(environment);