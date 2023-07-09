const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('./controllers/db');

function initialize(passport, getUserCreds, getUserbyId) {
    const authenticateUser = async (callsign, password, done) => {
        const user = await db.getUser(callsign)
        if (callsign == null) {
            return done(null, false, { message: 'User not found!' })
        }

        try {
            if (callsign == 'admin') {
                if (user[0].password == password) {
                    return done(null, user[0])
                }
            } else {
                if (await bcrypt.compare(password, user[0].password)) {
                    return done(null, user[0])
                } else {
                    return done(null, false, { message: 'Incorrect Username and/or Password!' })
                }
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'callsign'}, authenticateUser))
    passport.serializeUser((user, done) => { 
        console.log(user.id)
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => { 
        return done(null, db.getUserByID(id))
    })
}

module.exports = {
    initialize
}