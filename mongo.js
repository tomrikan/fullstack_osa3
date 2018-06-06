const mongoose = require('mongoose')

const url = 'mongodb://fullstack:5ekred@ds143070.mlab.com:43070/fullstack-persons'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] !== undefined && process.argv[3] !== undefined) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)

    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {
    console.log('puhelinluettelo:')
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })


}