'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Clave_super_secreta_Grupo#5';

exports.createToken = function (user){
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret);
}
