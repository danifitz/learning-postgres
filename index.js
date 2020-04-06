const middleware = require('./middleware')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const users = require('./users')

/*
 * Configure express to: 
 *   - serve static files
 *   - parse the request body when Content-Type = application/json
 *   - parse URL encoded params
 */
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

/*
 * Middleware
 * apiKeyValidation - validates that all requests have a valid API key
 * httpLogger - logs all incoming HTTP requests
 */
app.use(middleware.apiKeyValidation)
app.use(middleware.httpLogger)

/*
 * Users HTTP handlers
 */
app.get('/users', users.getUsers)
app.post('/users', users.createUser)
app.get('/users/:id', users.getUserById)
app.put('/users/:id', users.updateUser)
app.delete('/users/:id', users.deleteUser)

app.listen(port, () => {
    middleware.logger.info(`app listening on port ${port}`)
});