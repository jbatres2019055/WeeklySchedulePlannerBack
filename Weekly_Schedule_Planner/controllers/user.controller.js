'use strict'

var User = require('../models/user.model');
var Schedule = require('../models/schedule.model');
var Homework = require('../models/homework.model');


var bcrypt = require('bcrypt-nodejs');
var jwt = require("../services/jwt");
var fs = require('fs');
var path = require('path');



// ----------------------------------------------------------------------------------------------------------------

 function saveUser(req,res){
    var userModel = new User();
    var params =  req.body;

    if(params.name && params.username && params.email && params.password){
        User.findOne({username: params.username, email: params.email}, (err, userGuardado) =>{
            if(err){
                return res.status(500).send({mensaje: "Error del servidor"});
            }else if(userGuardado){
                return res.send({mensaje: "Usuario o correo ya utilizado"});
            }else{
                userModel.name = params.name
                userModel.username = params.username;
                userModel.email = params.email;
                userModel.password = params.password
                userModel.role = 'ROLE_USER';

                bcrypt.hash(params.password,null, null, (err, passwordHash) =>{
                    if(err){
                        return res.status(500).send({mensaje: "Error al encriptar contraseña"});
                    }else if(passwordHash){
                        userModel.password = passwordHash;
                        userModel.save((err, userGuardado) =>{
                            if(err){
                                return res.status(500).send({mensaje: "Error del servidor"});
                            }else if(userGuardado){
                                return res.send({mensaje:"Usuario Creado", userModel: userGuardado});
                            }else{
                                return res.status(404).send({mensaje: "Usuario no guardado"});
                            }   
                        })
                    }else{
                        return res.status(418).send({mensaje: "Error inesperado"});
                    }
                });
            }
        })
    }else{
        return res.send({mensaje: "Ingrese todos los datos"});
    }
}




// ----------------------------------------------------------------------------------------------------------------

function login(req, res) {
    var params = req.body;

    if(params.username && params.password){
        User.findOne({ username: params.username }, (err, userEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

            if (userEncontrado) {
                bcrypt.compare(params.password, userEncontrado.password, (err, passVerificada) => {
                    if (passVerificada) {
                        if (params.getToken = 'true') {
                            return res.status(200).send({
                                mensaje: "Usuario logeado",
                                userEncontrado,
                                token: jwt.createToken(userEncontrado),
                            })
                        } else {
                            userEncontrado.password = undefined;
                            return res.status(200).send({ userEncontrado });
                        }
                    } else {
                        return res.status(500).send({ mensaje: 'El usuario no se a podido identificar' });
                    }
                })
            } else {
                return res.status(500).send({ mensaje: 'Error al buscar el usuario' });
            }
        });
    }else {
        return res.status(400).send({mensaje: "Error, ingrese todos los datos"});
    }
}




// ----------------------------------------------------------------------------------------------------------------

function getUsers(req, res){
    User.find().exec((err, users) => {
        if(err){
            return res.status(500).send({mensaje: "Error al buscar los usuarios"})
        }else if(users){
            console.log(users)
            return res.send({mensaje: "Usuarios encontrados", users})
        }else{
            return res.status(204).send({mensaje: "No se encontraron usuarios"})
        }
    })
}




// ----------------------------------------------------------------------------------------------------------------

function getUserID(req, res) {
    var UserId = req.params.userId;
 
    User.findById(UserId, (err, userEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuario' });
        if (!userEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Usuario.' });
        return res.status(200).send({mensaje:"El Usuario ha sido encontrado exitosamente" ,userEncontrado });
    })
}




// ----------------------------------------------------------------------------------------------------------------

function updateUser(req, res){
    var idUser = req.params.id;
    var update = req.body; 

    if(idUser != req.user.sub){
        res.status(403).send({message:"No tienes permisos para esta ruta"});
    }else{
        User.findOne({username:update.username},(err,userRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor ",err});
            }else if(userRepeat){
                res.status(403).send({message:"No puede actualizar su nombre de usuario porque ya esta en uso"});
            }else{
                User.findByIdAndUpdate(idUser, update, {new:true},(err,updateUser) =>{
                    if(err){
                        res.status(500).send({message:"Error en el servidor ", err});
                    }else if(updateUser){
                        res.send({Usuario_Actualizado: updateUser});
                    }else{
                        res.status(404).send({message:"El usuario que quiere actualizar no existe"});
                    }
                });
            }
        });
    }
}




// ----------------------------------------------------------------------------------------------------------------

let removeUser = async(req, res) => {
    let userId = req.params.id;
    let { password } = req.body;

    try {
        if(userId === req.user.sub){
            let user = await User.findById(userId);
            if(user){
                let doesPasswordMatch = await bcrypt.compareSync(password, user.password);
                if(doesPasswordMatch){
                    await User.findByIdAndRemove(userId);
                    await Schedule.deleteMany({userSchedule: userId});
                    await Homework.deleteMany({userHomework: userId});
                    return res.json({message: "User deleted correctly"});
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message: "An error has occured", error});
    }

    // if(userId != req.user.sub){
    //     return res.send({message: 'No posees permisos necesarios para realizar esta acción'})
    // }else{
    //     if(!params.password){
    //         return res.status(401).send({message: 'Por favor ingresa la contraseña para poder eliminar tu cuenta'});
    //     }else{
    //         User.findById(userId, (err, userFind)=>{
    //             if(err){
    //                 return res.status(500).send({message: 'Error general'})
    //             }else if(userFind){
    //                 bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
    //                     if(err){
    //                         return res.send({message: 'Error general al verificar contraseña'})
    //                     }else if(checkPassword){
    //                         User.findByIdAndRemove(userId, (err, userFind)=>{
    //                             if(err){
    //                                 return res.status(500).send({message: 'Error general al verificar contraseña'})
    //                             }else if(userFind){
    //                                 Schedule.deleteMany({_id: userFind.schedules}, (err, deleteSchedules)=>{
    //                                     if(err){
    //                                         return res.status(500).send({message: 'Error general al actualizar'});
    //                                     }else if(deleteSchedules){
    //                                         await Homework.deleteMany({userHomework: userFind._id});

    //                                         return res.send({message: 'Usuario eliminado', userRemoved})
    //                                     }else{
    //                                         return res.status(500).send({message: 'no se encontro'});
    //                                     }
    //                                 })  
    //                             }else{
    //                                 return res.send({message: 'Usuario no encontrado o ya eliminado'})
    //                             }
    //                         })
    //                     }else{
    //                         return res.status(403).send({message: 'Contraseña incorrecta'})
    //                     }
    //                 })
    //             }else{
    //                 return res.send({message: 'Usuario inexistente o ya eliminado'})
    //             }
    //         })
    //     }
    // }
}


function deleteUser(req, res){
    var userId = req.params.id;

    if(req.user.sub == userId){
        User.findById(userId,(err, schedules)=>{
            if(err){
                res.status(500).send({mesagge: 'Error al encontrar los horarios', err});
            }else if(schedules){
                Schedule.deleteMany({_id:schedules.schedules}, (err, deleteSchedules)=>{
                    if(err){
                        res.status(400).send({mesagge: "Los usuarios del horario no se han logrado eliminar"});
                    }else if(deleteSchedules){
                        Homework.deleteMany({_id:schedules.homeworks}, (err, deleteHomework)=>{
                            if(err){
                                res.status(500).send({mesagge: "Error general"});
                            }else if(deleteHomework){
                                User.findByIdAndRemove(userId, (err, deleteUser) =>{
                                    if(err){
                                        res.status(500).send({mesagge: "Error general"});
                                    }else if(deleteUser ){
                                        res.send({mesagge: "Compañia eliminada exitosamente"});
                                    }else{
                                        res.status(404).send({mesagge: "No se a podido eliminar el usuario"});
                                    }
                                });
                            }else{
                                res.status(400).send({mesagge:"No se ha podido eliminar las sucursales de la empresa"})
                            }
                        });
                    }
                });
            }
        }); 
    }else{
        res.status(403).send({mesagge:"no tiene permiso para esta ruta"});
    }
}





// ----------------------------------------------------------------------------------------------------------------

function search(req, res){
    var params = req.body;

    if(params.search){
        User.find({$or:[{name: params.search},
                        {username: params.search}]}, (err, resultsSearch)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'})
                            }else if(resultsSearch){
                                return res.send({resultsSearch})
                            }else{
                                return res.status(404).send({message: 'No hay registros para mostrar'})
                            }
                        })
         }else{
        return res.status(403).send({message: 'Ingresa algún dato en el campo de búsqueda'})
    }
}




// ----------------------------------------------------------------------------------------------------------------

function uploadImage(req, res){
    var userId = req.params.id;
    var fileName = 'Sin imagen';

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos'});
    }else{
        if(req.files){
            //captura la ruta de la imagen
            var filePath = req.files.image.path;
            //separa en indices cada carpeta
            //si se trabaja en linux ('\');
            var fileSplit = filePath.split('\\');
            //captura el nombre de la imagen
            var fileName = fileSplit[2];

            var ext = fileName.split('\.');
            var fileExt = ext[1];

            if( fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'});
                        }else if(userUpdated){
                            return res.send({user: userUpdated, userImage: userUpdated.image});
                        }else{
                            return res.status(404).send({message: 'No se actualizó'});
                        }
                    })
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al eliminar y la extensión no es válida'});
                        }else{
                            return res.status(403).send({message: 'Extensión no válida, y archivo eliminado'});
                        }
                    })
                }
        }else{
            return res.status(404).send({message: 'No has subido una imagen'});
        }
    }
}




// ----------------------------------------------------------------------------------------------------------------

function getImage(req, res){
    var nombreImagen = req.params.imagen;
    var rutaArchivo = `./uploads/users/${nombreImagen}`;

    fs.access(rutaArchivo, (err)=>{
        if (err) {
            return res.status(500).send({ mensaje: 'Imagen inexistente' });
        }else{
            return res.sendFile(path.resolve(rutaArchivo));
        }
    })
}


module.exports = {
    saveUser,
    login,
    getUsers,
    getUserID,
    updateUser,
    removeUser,
    search,
    uploadImage,
    getImage,
    deleteUser
}
        