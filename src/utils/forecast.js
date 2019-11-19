const request = require('request')

forecast = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/c69521d63660cf2a4b07a2db679d9701/${latitude},${longitude}`
    
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                precipProbability: body.daily.data[0].precipProbability,
                temperatureHigh: body.daily.data[0].temperatureHigh,
                temperatureLow: body.daily.data[0].temperatureLow
            })
        }
    })
}

module.exports = forecast