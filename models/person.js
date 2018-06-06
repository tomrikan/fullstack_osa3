const mongoose = require('mongoose')

const url = 'mongodb://fullstack:5ekred@ds143070.mlab.com:43070/fullstack-persons'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person