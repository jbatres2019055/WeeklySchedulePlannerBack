'use strict'

// IMPORTACIONES
var express = require('express');
var userController = require('../controllers/user.controller');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});



// IMPORTACION MIDDLEWARES PARA RUTAS
var md_autorizacion = require('../middlewares/authenticated');

//RUTAS
var app = express.Router();
app.post('/saveUser', userController.saveUser);
app.post('/login', userController.login);
app.get('/getUsers', md_autorizacion.ensureAuth, userController.getUsers);
app.get('/getUserID/:userId', md_autorizacion.ensureAuth, userController.getUserID);
app.put('/updateUser/:id', md_autorizacion.ensureAuth, userController.updateUser);
app.delete('/removeUser/:id', md_autorizacion.ensureAuth, userController.removeUser);
app.post('/search', md_autorizacion.ensureAuth, userController.search);

app.put('/:id/uploadImage', [md_autorizacion.ensureAuth, mdUpload], userController.uploadImage);  
app.get('/getImage/:imagen', [mdUpload], userController.getImage);	
app.delete('/deleteUser/:id', md_autorizacion.ensureAuth, userController.deleteUser);



module.exports = app;