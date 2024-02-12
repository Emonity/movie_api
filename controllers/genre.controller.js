const db = require('../db')

class GenreController {
    async createGenre(req, res) {
        const {genre_name, description} = req.body
        const newGenre = await db.createGenre(genre_name, description)

        res.json(newGenre)
    }

    async getGenre(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const genres = await db.getGenre()

        const paginatedResults = genres.slice(startIndex, endIndex);

        res.json({
            page: page,
            total_pages: Math.ceil(genres.length / limit),
            data: paginatedResults
        });
    }

    async getOneGenre(req, res) {
        const id = req.params.id
        const genre = await db.getOneGenre(id)

        res.json(genre)
    }

    async updateGenre(req, res) {
        const {genre_id, genre_name, description} = req.body
        const genre = await db.updateGenre(genre_id, genre_name, description)

        res.json(genre)
    }

    async deleteGenre(req, res) {
        const id = req.params.id
        const genre = await db.deleteGenre(id)

        res.json(genre)
    }
}

module.exports = new GenreController()