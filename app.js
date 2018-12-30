const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const sequelize = require('./shared/mysqlconnect')
const passport = require('passport')
const path = require('path')

const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics_money')
const currencyRoutes = require('./routes/currency')
const currencyDateRoutes = require('./routes/currency_date')
const incomeRoutes = require('./routes/income')
const organizationRoutes = require('./routes/organization')

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Подключение к БД
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    })

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/analytics_money', analyticsRoutes)
app.use('/api/currency', currencyRoutes)
app.use('/api/currency_date', currencyDateRoutes)
app.use('/api/income', incomeRoutes)
app.use('/api/organization', organizationRoutes)
app.use('/api/auth', authRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/client'))
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })
}

module.exports = app