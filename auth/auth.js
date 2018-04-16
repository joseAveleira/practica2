/* jshint node: true */
'use strict';

var User = require('../models/user');
var service = require('./service');



exports.aliasLogin = function (req, res) {
    User.findOne({
        alias: req.body.alias
    }, function (err, user) {
        // Comprobar si hay errores
        // Si el usuario existe o no
        // Y si la contraseña es correcta
        console.log(JSON.stringify(req.body, null, 2));


        if (err) {
            return res.status(500).send(err.message);
        }

        if (user === null) {
            return res.status(401).send({mensaje:'el usuario no es correcto'});
        } else {
            return res
                .status(200)
                .send({
                    token: service.createToken(user)
                });
        }
    });
};
