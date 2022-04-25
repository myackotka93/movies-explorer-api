const movies = require('express').Router();
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movies');

movies.get('/', getSavedMovies);
movies.post('/', createMovie);
movies.delete('/:movieId', deleteMovie);

module.exports = movies;
