'use strict'

var Schedule = require('../models/schedule.model');
var User = require('../models/user.model');




// ----------------------------------------------------------------------------------------------------------------

function setSchedule(req, res){
    var userId = req.params.id;
    var params = req.body;
    var schedule =new Schedule();

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta accion 1'});

    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error genral de la busqueda'});
            }else if(userFind){
                schedule.nameSchedule = params.nameSchedule,
                schedule.descriptionSchedule = params.descriptionSchedule,
                schedule.daysWeek = params.daysWeek,
                schedule.userSchedule = req.user.sub;


                schedule.save((err , horarioGuardado)=>{
                    if(err){
                        return res.status(500).send({message: 'Error General al guardar el horario'});

                    }else if(horarioGuardado){
                        User.findByIdAndUpdate(userId, {$push:{schedules: horarioGuardado._id}}, {new: true},(err, pushHorario)=>{
                            if(err){
                                return res.status(500).send({message: 'Error General al setear el horario'});
                            }else if(pushHorario){
                                return res.send({mensaje: 'Horario creada y agregado', pushHorario});
                            }else{
                                return res.status(404).send({message: 'No se seteo el horario, pero si se creo en la DB'});

                            }
                        }).populate('schedules')
                    }else{
                        return res.status(404).send({message: 'No se pudo Guardar el horario'});
                    }
                })
            }else{
                return res.status(500).send({message:'No tienes Permiso para realizar esta accion 2'});
            }
        })
    }
    
}




// ----------------------------------------------------------------------------------------------------------------

 function getSchedules(req, res){
    Schedule.find().exec((err, shedules) => {
        if(err){
            return res.status(500).send({mensaje: "Error al buscar los horarios"})
        }else if(shedules){
            console.log(shedules)
            return res.send({mensaje: "Horarios encontrados", shedules})
        }else{
            return res.status(204).send({mensaje: "No se encontraron los Horarios"})
        }
    })
}




// ----------------------------------------------------------------------------------------------------------------

function getScheduleID(req, res) {
    var ScheduleId = req.params.scheduleId;
 
    Schedule.findById(ScheduleId, (err, HorarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Horario' });
        if (!HorarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el Horario.' });
        return res.status(200).send({mensaje:"El Horario ha sido encontrado exitosamente" ,HorarioEncontrado });
    })
}




// ----------------------------------------------------------------------------------------------------------------

function UpdateSchedule(req, res){
    let userId = req.params.id;
    let scheduleId = req.params.idS;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
            User.findOne({_id: userId, schedules: scheduleId}, (err, userSchedule)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(userSchedule){
                    Schedule.findByIdAndUpdate(scheduleId, update, {new: true}, (err, updateSchedule)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al actualizar'});
                        }else if(updateSchedule){
                            return res.send({message: 'Horario actualizado', updateSchedule});
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar el Horario'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Usuario o Horario inexistente'});
                }
            }) 
         
    }
}




// ----------------------------------------------------------------------------------------------------------------

    function DeleteSchedule(req, res){
        let userId = req.params.id;
        let scheduleId = req.params.idS;
        
        if(userId != req.user.sub){
            return res.status(500).send({message: 'No tienes permiso para realizar esta acción'})
        }else{
            User.findOneAndUpdate({_id: userId, schedules: scheduleId},
                {$pull: {schedules: scheduleId}}, {new:true}, (err, schedulePull)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(schedulePull){
                        Schedule.findByIdAndRemove(scheduleId, (err, scheduleRemoved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al eliminar el horario, pero sí eliminado del registro de usuario', err})
                            }else if(scheduleRemoved){
                                return res.send({message: 'Horario eliminado permanentemente', schedulePull});
                            }else{
                                return res.status(404).send({message: 'Registro no encontrado o horario ya eliminado'})
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'No existe el usuario que contiene el horario a eliminar'})
                    }
                }).populate('schedules')
        }
    }


    

 module.exports = {
    getSchedules,
    getScheduleID,
    setSchedule,
    UpdateSchedule,
    DeleteSchedule
 }
 