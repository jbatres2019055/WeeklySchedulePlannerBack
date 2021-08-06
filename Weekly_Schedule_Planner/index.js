// IMPORTACION
const mongoose =  require("mongoose")
const app = require("./app");
var port = 3000;

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/DBWeekly_Schedule_Planner',
    {useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false })
    .then(()=>{
    console.log('Se encuentra conectado a la base de datos');

    app.listen(port, function () {
        console.log("Servidor corriendo en el puerto " + port);
    })
}).catch((err) => console.log('Error de conexión a la base de datos', err))
