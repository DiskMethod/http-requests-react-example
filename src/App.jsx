import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async (e) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://react-http-da165-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      if (data) {
        setMovies(
          Object.keys(data).reduce((acc, curr) => {
            acc.push({
              ...data[curr],
              id: curr,
            });
            return acc;
          }, [])
        );
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  const addMovieHandler = async (movie) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://react-http-da165-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(response.status);
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
