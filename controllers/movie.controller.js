const db = require('../db')

class MovieController {
    async createMovie(req, res) {
        const {original_title, localized_title, release_year, rating, description} = req.body
        const newMovie = await db.createMovie(original_title, localized_title, release_year, rating, description)

        res.json(newMovie)
    }

    async getMovie(req, res) {
        const {sort, title , release_year , rating , genre} = req.query

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const movies = await db.getMovie(sort, title , release_year , rating , genre)

        const paginatedResults = movies.slice(startIndex, endIndex)

        res.json({
            page: page,
            total_pages: Math.ceil(movies.length / limit),
            data: paginatedResults
        });
    }

    async getOneMovie(req, res) {
        const id = req.params.id
        const movie = await db.getOneMovie(id)

        res.json(movie)
    }

    async updateMovie(req, res) {
        const {movie_id, original_title, localized_title, release_year, rating, description} = req.body
        const movie = await db.updateMovie(movie_id, original_title, localized_title, release_year, rating, description)

        res.json(movie)
    }

    async deleteMovie(req, res) {
        const id = req.params.id
        const movie = await db.deleteMovie(id)

        res.json(movie)
    }
}

module.exports = new MovieController()