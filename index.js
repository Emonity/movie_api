const express = require('express')
const movieRouter = require('./routes/movie.routes')
const genreRouter = require('./routes/genre.routes')
const PORT = process.env.PORT || 8000

const app = express()
app.use(express.json())
app.use('/api', movieRouter)
app.use('/api', genreRouter)
app.listen(PORT, () => console.log(`Server started on post ${PORT}`))