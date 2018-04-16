var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    type: String,
    name: String,
    description: String,
    unit: String,
    value: Number

});
// Importante el nombre de la colección en SINGULAR
module.exports = mongoose.model('device', DeviceSchema);
