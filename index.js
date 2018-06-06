const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

let persons = []

app.post('/api/persons', (req, res) => {
    const body = req.body
    const rndId = Math.floor(Math.random() * Math.floor(10000))

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].name === body.name) {
            return res.status(400).json({ error: 'name must be unique' })
        }
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: rndId
    })

    persons = persons.concat(person)

    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson))
        }).catch(error => {
            console.log(error)
        })
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(people => {
            res.json(people.map(formatPerson))
        }).catch(error => {
            console.log(error)
        })
})

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}


app.get('/info', (req, res) => {
    const date = new Date()
    Person
        .find({})
        .then(people => {
            res.send(`<p>puhelinluettelossa on ${people.length} henkilön tiedot </p>
            <p>${date}</p>`)
        })
})

app.get('/api/persons/:id', (req, res) => {

    Person.findById(req.params.id)
        .then(person => {
            res.json(formatPerson(person))
        }).catch(error => {
            console.log(error)
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})