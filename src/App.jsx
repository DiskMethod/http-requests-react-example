import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = async (e) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://swapi.dev/api/films/");

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      setMovies(
        data.results.reduce((acc, curr) => {
          const { episode_id, opening_crawl, release_date, ...rest } = curr;
          acc.push({
            ...rest,
            id: curr["episode_id"],
            openingText: curr["opening_crawl"],
            releaseDate: curr["release_date"],
          });
          return acc;
        }, [])
      );
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && !error && movies.length === 0 && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
