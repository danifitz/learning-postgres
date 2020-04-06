const { Pool } = require('pg')

const pool = new Pool({
    user: 'daniel',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432
})

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

const createUser = (_request, response) => {
    const { firstName, lastName, email } = request.body
    logger.log()

    pool
        .connect()
        .then(client => client
            .query('INSERT INTO users VALUES ($1, $2, $2)', [firstName, lastName, email])
            .then(result => {
                client.release()
                console.log(result)
                response.status(200).json({message: `User created with ID: `})
            })
            .catch(err => {
                setImmediate(() => {
                    client.release()
                    throw err
                })
            })
        )
}

const updateUser = (request, response) => {
    const userId = parseInt(req.params.id)
    const { firstName, lastName, email } = request.body

    pool
        .connect()
        .then(client => client
            .query('UPDATE users SET firstName = $1, lastName = $2, email = $3 WHERE id = $4', [firstName, lastName, email, userId])
            .then(result => {
                client.release()
                response.status(200).json({message: `User updated with ID: ${userId}`})
            })
            .catch(err => {
                setImmediate(() => {
                    client.release()
                    throw err
                })
            })
        )
}

const deleteUser = (_request, response) => {
    const userId = parseInt(req.params.id)
    if (userId === Number.NaN) {
        response.status(422).json({message: 'Missing ID parameter'}).end()
    }
    pool
        .connect()
        .then(client => client
            .query('DELETE FROM users WHERE id = $1', [userId])
            .then(result => {
                client.release()
                response.status(200).json({message: `User deleted with ID: ${userId}`})
            })
            .catch(err => {
                setImmediate(() => {
                    client.release()
                    throw err
                })
            })
        )
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}