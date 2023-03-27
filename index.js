

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(express.static('build'))

app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type '))

//You define the name, in this case it's called 'type' 
morgan.token('type', function (req, res) 
{ return `${JSON.stringify(req.body)}`})


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    const date = new Date(Date.now()); 
    response.send(`<p>Phone book has info for ${persons.length} people</p> <br> <p>${date.toUTCString()}</p>`)
  })

  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    let person = persons.find(person => person.id === id) 

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
  })

  app.delete('api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.filter(person => person.id !== id)

    response.status(204).end()
  }) 

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    let body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name is missing' 
      })
    }
    
    if (!body.number) {
        return response.status(400).json({ 
          error: 'number is missing' 
        })
      }
      if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'person already existed in the phonebook'
        })
      }


    let person = {
      name: body.name,
      number: body.number, 
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})