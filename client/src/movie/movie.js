import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Header from '../header/header.js';
import Footer from '../footer/footer.js';
import './movie.css';
import broken_image from "../broken_image_1583624.png"


export default function Movie(props) {

  const [movieInfo, setMovieInfo] = useState();

  const id = props.location.pathname.substring(7)

  useEffect(() => {
    const url = "/movie/"+id
    fetch(url, {
      method: "POST"
    }).then(response => response.json())
      .then(data => {
        setMovieInfo(data);
      });
  }, []);

  return (
    <div className="movieCont">
      <Header></Header>
      <div className="moviemiddle" style={movieInfo === undefined? null : {backgroundImage: `url(${movieInfo.backdrop})`}}>
        <div className="movieOverlay">
          <div className="centered">
            <div className="poster">
              {movieInfo === undefined ?
                <div className="noImage">
                  <img className="brokenImage" src={broken_image}></img>
                </div>
                :
                <img className="moviePoster" src={movieInfo.poster}></img>

              }
            </div>
            <div className="movieContent">
              <div className="movieTitle">
                {movieInfo === undefined ? null : movieInfo.title}
                <div className="movieYear">{movieInfo === undefined ? null : "(" + movieInfo.year + ")"}</div>
              </div>
              <div className="genresInfo">
                {movieInfo === undefined ? null : movieInfo.genres}
                <span className="movieDuration"> {movieInfo === undefined ? null : +movieInfo.duration + " min"} </span>
              </div>
              <div className="movieTagline">
                {movieInfo === undefined ? null : movieInfo.tagline}
              </div>
              <div className="movieOverview">
                {movieInfo === undefined ? null : movieInfo.overview}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );

}
