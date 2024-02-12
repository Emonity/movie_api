const mysql = require('mysql2')
const {query} = require("express");

class databaseClass {
    constructor() {
        this.dbCredentials = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }
        this.pool = mysql.createPool({
            host: this.dbCredentials.host,
            user: this.dbCredentials.user,
            password: this.dbCredentials.password,
            database: this.dbCredentials.database,
            multipleStatements: true,
            waitForConnections: true,
            connectionLimit: 10000,
            queueLimit: 5000
        })
    }

    /**
     *
     * @returns {Promise<*|*[]|null>}
     *
     * Получаем список фильмов
     * return массив фильмов
     */
    async getMovie(sort = null, title = null, release_year = null, rating = null, genre = null) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            let query = `SELECT m.movie_id, m.original_title, m.localized_title, m.release_year, m.rating, g.genre_name FROM movies_genres mg
                                                                                                                                                JOIN movies m on m.movie_id = mg.movie_id
                                                                                                                                                JOIN genres g on g.genre_id = mg.genre_id`

            if (sort) {
                query += ` ORDER BY ${sort}`;
            }

            if (title) {
                query += ` WHERE m.original_title LIKE '%${title}%' OR m.localized_title LIKE '%${title}%'`;
            }

            if (release_year) {
                query += ` WHERE m.release_year = '${release_year}'`;
            }

            if (rating) {
                query += ` WHERE m.rating >= ${rating}`;
            }

            if (genre) {
                query += ` WHERE g.genre_name = '${genre}'`;
            }

            const movie = await pool.query(query)

            if (movie.length && movie[0].length) {
                return movie[0]
            } else {
                console.log('movie: ', movie)
                return []
            }

        } catch (e) {
            console.log('Ошибка получения данных')
            console.log(e)
            return `Ошибка ${e}`
        }
    }

    /**
     * Создает фильм
     *
     * @returns {Promise<*|*[]|null>}
     * @param original_title
     * @param localized_title
     * @param release_year
     * @param rating
     * @param description
     */

    async createMovie(original_title, localized_title, release_year, rating, description) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const newMovie = await pool.query(`
                insert into movies (original_title, localized_title, release_year, rating, description)
                values ('${original_title}', '${localized_title}', '${release_year}', '${rating}', '${description}');
            `)

            if (newMovie.length && newMovie[0].length) {
                return newMovie[0]
            } else {
                console.log('movie: ', newMovie)
                return newMovie[0].info
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

    /**
     * Обновление данных фильма
     *
     * @param movie_id
     * @param original_title
     * @param localized_title
     * @param release_year
     * @param rating
     * @param description
     * @returns {Promise<*|*[]|null>}
     */
    async updateMovie(movie_id, original_title, localized_title, release_year, rating, description) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const updateMovie = await pool.query(`
                UPDATE movies
                SET original_title  = '${original_title}',
                    localized_title = '${localized_title}',
                    release_year    = '${release_year}',
                    rating          = '${rating}',
                    description     = '${description}'
                WHERE movie_id = ${movie_id}`)

            if (updateMovie.length && updateMovie[0].length) {
                return updateMovie[0]
            } else {
                console.log('updateMovie: ', updateMovie)
                return updateMovie[0].info
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

    /**
     * Удаление фильма
     * @param movie_id
     * @returns {Promise<*|string|null>}
     */
    async deleteMovie(movie_id) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const deleteMovie = await pool.query(`
                DELETE FROM movies WHERE movie_id = ${movie_id}`)

            if (deleteMovie.length && deleteMovie[0].length) {
                return deleteMovie[0]
            } else {
                console.log('deleteMovie: ', deleteMovie)
                return "successful deleted"
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

    /**
     * Получение фильма по id
     * @param movie_id
     * @returns {Promise<*|string|null>}
     */
    async getOneMovie(movie_id) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const movie = await pool.query(`
                SELECT m.movie_id, m.original_title, m.localized_title, m.release_year, m.rating, m.description, g.genre_name FROM movies_genres mg
                                                                                                                                 JOIN movies m on m.movie_id = mg.movie_id
                                                                                                                                 JOIN genres g on g.genre_id = mg.genre_id
                WHERE m.movie_id = ${movie_id}`)

            if (movie.length && movie[0].length) {
                return movie[0]
            } else {
                console.log('movie: ', movie)
                return []
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

    /**
     *
     * @returns {Promise<*|*[]|null>}
     *
     * Получаем список жанра
     * return массив фильмов
     */
    async getGenre() {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const genre = await pool.query(`SELECT genre_id, genre_name FROM genres`)

            if (genre.length && genre[0].length) {
                return genre[0]
            } else {
                console.log('genre: ', genre)
                return []
            }

        } catch (e) {
            console.log('Ошибка получения данных')
            console.log(e)
            return `Ошибка ${e}`
        }
    }

    /**
     * Создает жанр
     *
     * @returns {Promise<*|*[]|null>}
     * @param genre_name
     * @param description
     */
    async createGenre(genre_name, description) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const newGenre = await pool.query(`
                insert into genres (genre_name, description)
                values ('${genre_name}', '${description}');
            `)

            if (newGenre.length && newGenre[0].length) {
                return newGenre[0]
            } else {
                console.log('Genre: ', newGenre)
                return newGenre[0].info
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

    /**
     * Обновление данных жанра
     *
     * @param genre_id
     * @param genre_name
     * @param description
     * @returns {Promise<*|*[]|null>}
     */
    async updateGenre(genre_id, genre_name, description) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const updateGenre = await pool.query(`
                UPDATE genres
                SET genre_name  = '${genre_name}',
                    description     = '${description}'
                WHERE genre_id = ${genre_id}`)

            if (updateGenre.length && updateGenre[0].length) {
                return updateGenre[0]
            } else {
                console.log('updateGenre: ', updateGenre)
                return updateGenre[0].info
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

    /**
     * Удаление жанра
     * @returns {Promise<*|string|null>}
     * @param genre_id
     */
    async deleteGenre(genre_id) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const deleteGenre = await pool.query(`
                DELETE FROM genres WHERE genre_id = ${genre_id}`)

            if (deleteGenre.length && deleteGenre[0].length) {
                return deleteGenre[0]
            } else {
                console.log('deleteGenre: ', deleteGenre)
                return []
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

    /**
     * Получение фильма по id
     * @returns {Promise<*|string|null>}
     * @param genre_id
     */
    async getOneGenre(genre_id) {
        try {
            const pool = this.pool.promise()

            if (!pool) {
                console.log('Неуспешное подключение к базе')
                return null
            }

            const movie = await pool.query(`
                SELECT * FROM genres WHERE genre_id = ${genre_id}`)

            if (movie.length && movie[0].length) {
                return movie[0]
            } else {
                console.log('movie: ', movie)
                return []
            }

        } catch (e) {
            if (e) {
                console.log('Ошибка получения данных')
                console.log(e)
                return `Ошибка ${e}`
            }
        }
    }

}

module.exports = new databaseClass
