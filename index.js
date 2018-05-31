const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "123456",
        id: 2
    },
    {
        name: "Jeesus",
        number: "123456",
        id: 3
    },
    {
        name: "Satan Himself",
        number: "666",
        id: 4
    }
]

app.post('/api/persons', (req, res) => {
    const body = req.body
    const rndId = Math.floor(Math.random() * Math.floor(10000))

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({error: 'content missing'})
    }
    for(var i = 0; i < persons.length; i++) {
        if (persons[i].name === body.name) {
            return res.status(400).json({error: 'name must be unique'})
        }
    }

    const person = {
        name: body.name,
        number: body.number,
        id: rndId
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()

    res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot </p>
    <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})