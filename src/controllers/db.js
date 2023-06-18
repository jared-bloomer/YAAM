const envconfig = require('config');
const knex = require('knex');
const bcrypt = require('bcrypt');
const timestamp = Date.now();
const http = require('http');


const environment = envconfig.get("environment");
const node_type = envconfig.get("node.type");

// Point to knexfile 
const config = require('../knexfile');
const { clear } = require('console');

// connect to DB
if (environment == "development") {
    var db = knex(config.development);
} else {
    var db = knex(config.production);
}

async function clearAstDB(req, res, next) {
    var query = await db('astdb').del();
}

async function updateAstDB(req, res, next) {
    //clearAstDB()
    if (node_type == 'private') {
        return next()
    } else {
        var options = {
            host: 'allmondb.allstarlink.org',
            path: '/'
        }
        var request = http.request(options, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                var result = data.split(/\r?\n/)
                    .filter(line => line.trim() !== '')
                    .filter(line => line.replace(/^;.*$/gm, ''))
                    .join('\n')
                var csv = result.split(/\r?\n/)
                csv.forEach(line => {
                    var value = line.split('|')
                    //console.log(value)
                    var query = db('astdb').insert([
                        {node_number: value[0], callsign: value[1], description: value[2], location: value[3]}
                    ])  
                })
            });
        });
        request.on('error', function (e) {
            console.log(e.message);
        });
        request.end();
    }
}

async function getAllUsers() {
    var query = await db('users').select()
    return query
}

async function addUser(req, res, next) {
    return next()
}

async function delUser(req, res, next) {
    return next()
}

async function updateUserRole(req, res, next) {
    return next()
}

async function getAllRoles(req, res, next) {
    var query = await db('roles').select()
    return query
}

async function addRole(req, res, next) {
    return next()
}

async function delRole(req, res, next) {
    return next()
}

async function updateRole(req, res, next) {
    return next()
}

module.exports = {
    updateAstDB,
    getAllUsers,
    addUser,
    delUser,
    updateUserRole,
    getAllRoles,
    addRole,
    delRole,
    updateRole
}