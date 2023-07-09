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

async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword
    } catch (e) {
        return e;
    }
}

async function getAllUsers() {
    var query = await db('users').join('roles', 'users.role', '=', 'roles.id').select('users.callsign', 'roles.role', 'users.updated_at')
    return query
}

async function getUser(callsign) {
    var query = await db('users').select().where('callsign', callsign)
    return query
}

async function getUserByID(id) {
    var query = await db('users').select().where('id', id)
    return query
}

async function addUser(callsign, password, role) {
    const exist = await getUser(callsign)
    if (exist.length == 0) {
        var userRole = await getRoleByName(role)
        var query = await db('users').join('roles', 'roles.role', '=', role).insert({callsign: callsign, password: password, role: userRole[0].id})
        return query
    } else {
        return { error: "Callsign already exist!"}
    }
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

async function getRoleByName(role) {
    var query = await db('roles').select("id").where('role', role)
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

async function roleAuth(roleName, res, req, next) {
        //const userRecord = await db('users').join('roles', 'users.role', '=', 'roles.id').select('users.callsign', 'roles.role').where('users.callsign', user ))
        return next()
}

module.exports = {
    updateAstDB,
    getAllUsers,
    getUser,
    getUserByID,
    addUser,
    delUser,
    updateUserRole,
    getAllRoles,
    getRoleByName,
    addRole,
    delRole,
    updateRole,
    hashPassword,
    roleAuth
}