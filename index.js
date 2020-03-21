const middleware = require('./middleware')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const { Pool } = require('pg')

const pool = new Pool({
    user: 'daniel',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432
})

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

// serve static files
app.use(express.static('static'))
// use http logging middleware
app.use(middleware.httpLogger)

app.use(middleware.apiKeyValidation)

app.get('/users', (req, res) => {
    getUsers(req, res)
});

app.get('/users/:id', (req, res) => {
    getUserById(req, res)
})

const getUserById = (request, response) => {
    const userId = parseInt(request.params.id)

    pool
        .connect()
        .then(client => client
            .query('SELECT * FROM users WHERE id = $1', [userId])
            .then(result => {
                client.release()
                response.status(200).json(result.rows)
            })
            .catch(err => setImmediate(() => {
                client.release()
                throw err
            })))
}

const getUsers = (_request, response) => {
    pool
        .connect()
        .then(client => client
            .query('SELECT * FROM users ORDER BY id ASC')
            .then(result => {
                client.release()
                response.status(200).json(result.rows)
            })
            .catch(err =>
                setImmediate(() => {
                    client.release()
                    throw err
                })
            )
        )
}

app.listen(port, () => {
    middleware.logger.info(`app listening on port ${port}`)
});