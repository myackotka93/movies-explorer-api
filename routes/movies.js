const movies = require('express').Router();
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { movieIdValidation, movieValidation } = require('../middlewares/validation');

movies.get('/movies', getSavedMovies);
movies.post('/movies', movieValidation, createMovie);
movies.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = movies;
