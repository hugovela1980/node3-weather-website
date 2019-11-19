const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast.js')
const geocode = require('./utils/geocode.js')

const app = express()

const port = process.env.PORT || 3000

// Define Paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Hugo Vela'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Hugo Vela'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpMessage: 'Help options are available',
        title: 'Help',
        name: 'Hugo Vela'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    
    const city = req.query.address

    geocode(city, (error, { latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) =>{
            if (error) {
                res.send({ error })
            }

            res.send({
                address: req.query.address,
                location,
                forecast: `It is currently ${forecastData.temperature} degrees out.  There is a ${forecastData.precipProbability} percent chance of rain.`,
                summary: forecastData.summary,
                temperatureHigh: forecastData.temperatureHigh,
                temperatureLow: forecastData.temperatureLow,
                precipProbability: forecastData.precipProbability
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) {
        console.log(req.query.search)
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    res.send({
        products: []
    })
    console.log(req.query.search)
})

app.get('/help/*', (req, res) => {
    res.render('404-page', {
        title: '404',
        message: 'Help article not found',
        name: 'Hugo Vela'
    })
})

app.get('*', (req,res) => {
    res.render('404-page', {
        title: '404',
        message: 'Page not found',
        name: 'Hugo Vela'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})