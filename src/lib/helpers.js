const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPass = async (password, done) => {
    //quantas vezes mais executar, mais sifrado
    await bcrypt.genSalt(2, async (err, salt) => {
        await bcrypt.hash(password, salt, (err, hash) => {
            done(hash);
        });
    });
};

helpers.matchPass = async (password, savePassword, done) => {
    try {
        await bcrypt.compare(password, savePassword, (err, success) => {
            done(success);
        });
    }
    catch (e) {
        console.log(e);
    }
};

module.exports = helpers;