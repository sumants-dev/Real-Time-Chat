var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var cookieSession = require('cookie-session')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var cors = require('cors')

var app = express()


// Middlewares
app.use(cookieSession({
    name: 'session',
    keys: ['this is so random'],
    maxAge: 24 * 60 * 60 * 1000 
}))



app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', indexRouter)
app.use('/users', usersRouter)


module.exports = app
