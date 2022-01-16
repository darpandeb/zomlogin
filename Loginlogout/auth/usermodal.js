const cors = require('cors');
var mongoose =require('mongoose');
var userschema = new mongoose.Schema({


    name:'String',
    email:'String',
    password:'String',
    phone:'String',
    role:'String',

})

mongoose.model('Users', userschema);
// specifying the collection to keep the schema //

module.exports = mongoose.model('Users')


