const express = require('express')
require('dotenv').config
const edificiosRoute = require('./src/routes/edificiosRoute')
const moradoresRoute = require('./src/routes/moradoresRoute')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})
    
app.use(edificiosRoute)
app.use(moradoresRoute)


