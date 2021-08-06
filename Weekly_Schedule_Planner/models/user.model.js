'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    role: String,
    image: String,
    schedules: [{type: Schema.ObjectId, ref: 'schedules'}],
    homeworks: [{type: Schema.ObjectId, ref: 'homeworks'}]

});
module.exports = mongoose.model('users', UserSchema);