const Router = require('express')
const router = new Router()
const movieController = require('../controllers/movie.controller')

router.post('/movie', movieController.createMovie)
router.get('/movie', movieController.getMovie)
router.get('/movie/:id', movieController.getOneMovie)
router.put('/movie', movieController.updateMovie)
router.delete('/movie/:id', movieController.deleteMovie)

module.exports = router