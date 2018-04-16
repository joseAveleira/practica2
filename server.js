/* jshint node: true */
'use strict';
var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var sanitize = require('mongo-sanitize');
var Device = require('./models/device');
var authCtrl = require('./auth/auth');
var middleware = require('./auth/middleware');


var app = express();
app.use(cors());

///configurado para obtener datos en formato JSON
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = 80;
var database = 'mongodb://localhost/demoAPIREST';


mongoose.connect(database, function (err) {
    if (err) {
        console.log(' -' + err);
    } else {
        console.log(' -Conecectado a la base de datos: ' + database + '\n');
    }
});

app.get('/devices/', function (req, res) {
    res.json({
        msg: '¡el API REST fucniona!'
    });
});

//peticion post para añadir un dispositivo
app.post('/devices/', function (req, res) {

    console.log(JSON.stringify(req.body, null, 2));

    // se toma el objeto json de req body
    var device = new Device(req.body);

    // Se almacena y comprueba errores
    device.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.json({
            message: 'Dispositivo añadido'
        });
    });

});


//peticion GET para obtener los datos de un dispositivo por su tipo
app.get('/devices/:type',middleware.ensureAuthenticated, function (req, res) {

    console.log(JSON.stringify(req.params, null, 2));


    // Se busca con un filtro por ejemplo {"type": "temperature"} y comprueba errores
    Device.find(req.params, function (err, device) {
        if (err) {
            res.send(err);
        }
        res.json(device);
    });

});


//Peticion PUT para atualizar los datos de un dispositivo
app.put('/devices/:type', function (req, res) {

    console.log(JSON.stringify(req.params, null, 2));


    // Se busca con un filtro por ejemplo {"type": "temperature"} y comprueba errores
    Device.find(req.params, function (err, device) {
        if (err) {
            res.send(err);
        }
        res.json(device);
    });

});

app.delete('/devices/:type', function (req, res) {
    console.log('DELETE  /devices/find');
    Device.remove(req.params, function (err) {
        if (err) {
            res.send(err);
        } else {
            res.json({ message: 'dispositivo eliminado' });
        }
    });
});




//Peticion POST para buscar dispositivos
app.post('/devices/find', function (req, res) {
    console.log('POST  /devices/find');

    console.log(JSON.stringify(req.body, null, 2));

  var clean = sanitize(req.body.type);

    Device.find({'type':clean}, function (err, device) {
        if (err) {
            res.send(err);
        }
        res.json(device);
    });

});

app.post('/auth/login', authCtrl.aliasLogin);



app.listen(port, function () {
    console.log('servidor node.js funcionando en el puerto: ' + port);
});
