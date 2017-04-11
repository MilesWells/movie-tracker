angular.module('MovieTracker').factory('MyMoviesService', [
    '$http', 'toastr', ($http, toastr) => {

        return {
            addMovie: addMovie,
            updateMovie: updateMovie,
            deleteMovie: deleteMovie,
            getMovies: getMovies,
            mapFromImdb: mapFromImdb
        };

        function mapFromImdb(movie) {
            if(movie.MovieId) {
                return movie;
            }

            return {
                Title: movie.title,
                Plot: movie.plot,
                ImdbRating: movie.rating,
                UserRating: movie.UserRating || null,
                MpaaRating: movie.rated,
                Seen: movie.Seen || false,
                Genres: movie.genres,
                Year: movie.year,
                Actors: movie.actors,
                Runtime: movie.runtime,
                ImdbId: movie.imdbid,
                Director: movie.director,
                Writer: movie.writer,
                Languages: movie.languages,
                Website: movie.website
            };
        }

        function prepareData(movie) {
            return {
                MovieId: movie.MovieId,
                UserId: movie.UserId,
                Title: movie.Title,
                Plot: movie.Plot,
                ImdbRating: isNaN(movie.ImdbRating) ? null : movie.ImdbRating,
                UserRating: movie.UserRating,
                MpaaRating: movie.MpaaRating,
                Seen: movie.Seen,
                Genres: movie.Genres,
                Year: movie.Year,
                Actors: movie.Actors,
                Runtime: movie.Runtime,
                ImdbId: movie.ImdbId,
                Director: movie.Director,
                Writer: movie.Writer,
                Languages: movie.Languages,
                Website: movie.Website
            };
        }

        function addMovie(movie, userId) {
            movie = prepareData(movie);

            return $http.post(`/movies/${userId}`, { movie: movie })
                .then((result) => {
                    toastr.success('Your movie has been added to your list!');
                    return result;
                })
                .catch(() => {
                    toastr.error('Unable to add movie to your list.');
                    return null;
                });
        }

        function updateMovie(movie, userId) {
            movie = prepareData(movie);

            return $http.put(`/movies/${userId}/${movie.MovieId}`, { movie: movie })
                .then((result) => {
                    toastr.success('Movie has been updated!');
                    return result;
                })
                .catch(() => {
                    toastr.error('Unable to update movie.');
                    return null;
                });
        }

        function deleteMovie(movieId, userId) {
            return $http.delete(`/movies/${userId}/${movieId}`)
                .then(() => {
                    toastr.success('Movie deleted from your list.');
                    return null;
                })
                .catch(error => {
                    toastr.error('Unable to remove movie from your list.');
                    return error;
                });
        }

        function getMovies(userId) {
            return $http.get(`/movies/${userId}`)
                .then(data => data)
                .catch(error => {
                    return error;
                });
        }
    }
]);