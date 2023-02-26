//Richard Wijaya(@Raizel) Test

import React, { useState } from "react";
import Axios from "axios";
import styled from "styled-components";
import MovieComponent from "./components/MovieComponent";
import MovieInfoComponent from "./components/MovieInfoComponent";

export const API_KEY = "7819d7f3";

const Button = styled.button`
  display: inline-block;
  color: palevioletred;
  font-size: 20px;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  display: block;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;

const Footer = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  height = 20px;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 0;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const MovieImage = styled.img`
  width: 48px;
  height: 48px;
  margin: 15px;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const MovieListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 25px;
  justify-content: space-evenly;;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 150px;
  opacity: 50%;
`;

const Page = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 15px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

function App() {
  const [searchQuery, updateSearchQuery] = useState("");

  const [movieList, updateMovieList] = useState([]);
  const [selectedMovie, onMovieSelect] = useState();

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [moviesPerPage] = useState(10);

  const [timeoutId, updateTimeoutId] = useState();

  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://www.omdbapi.com/?s=${searchString}&apikey=${API_KEY}&page=1`,
    );
    updateMovieList(response.data.Search);
    setTotalPages(Math.ceil(response.data.totalResults / moviesPerPage));
  };

  const fetchPage = async () => {
    const response = await Axios.get(
      `https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}&page=${page}`,
    );
    updateMovieList(response.data.Search);
  }



  const handlePrevPage = () => {
    setPage(page - 1);
    fetchPage();
  };

  const handleNextPage = () => {
    fetchPage();
    setPage(page + 1);
  };

  const onTextChange = (e) => {
    setPage(1);
    onMovieSelect("")
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };
  console.log(page);
  return (
    <Container>
      <Header>
        <AppName>
          <MovieImage src="/movie-icon.svg" />
          Raizel Movie Search
        </AppName>
        <SearchBox>
          <SearchIcon src="/search-icon.svg" />
          <SearchInput
            placeholder="Search Movie"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      {selectedMovie && <MovieInfoComponent selectedMovie={selectedMovie} onMovieSelect={onMovieSelect}/>}
      <MovieListContainer>
        {movieList?.length ? (
          movieList.map((movie, index) => (
            <MovieComponent
              key={index}
              movie={movie}
              onMovieSelect={onMovieSelect}
            />
          ))
        ) : (
          <Placeholder src="/search-icon.svg" />
        )}
        
      </MovieListContainer>
      <Footer>
        {movieList?.length ? (<>
          <Button onClick={handlePrevPage} disabled={page === 1}>Prev</Button>
          <Page>{page} / {totalPages}</Page>
          <Button onClick={handleNextPage} disabled={page === totalPages}>Next</Button></>
          ) : (
          <></>
        )}
        
      </Footer>
    </Container>
    
    
    
  );
}

export default App;