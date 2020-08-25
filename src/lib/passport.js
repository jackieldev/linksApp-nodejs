const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    db.get('SELECT * FROM users WHERE username=?', [username], (err, user) => {
        if (user) {
            helpers.matchPass(password, user.password, (success) => {
                if (success) {
                    done(null, user, req.flash('success', 'Welcome ' + user.username));
                }
                else {
                    done(null, false, req.flash('message', 'Incorrect Password'))
                }
            });
        } else {
            return done(null, false, req.flash('message', 'Username does not exists'))
        }
    });
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    emailField: 'email',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { email } = req.body;
    const newUser = { username, password, email };

    await helpers.encryptPass(password, (hash) => {
        newUser.password = hash;

        const sql = 'INSERT INTO users (username, password, email) VALUES (?,?,?)';

        db.run(sql, [newUser.username, newUser.password, newUser.email], null, (err) => {

            db.get('SELECT * FROM users WHERE email =?', [email], (err, row) => {
                newUser.id = row.id;
                return done(null, newUser);
            })
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    db.get('SELECT * FROM users WHERE id=?', [id], (err, row) => {
        done(null, row);
    });
});
