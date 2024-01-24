import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEpisode, setCharacters } from "../redux/actions";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./EpisodePage.css";
import Loader from "./Loader";
import SwitchMode from "./SwitchMode";

const EpisodePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const episode = useSelector((state) => state.currentEpisode);
  const characters = useSelector((state) => state.characters);
  const [isLoading, setLoading] = useState(true);
  const darkMode = useSelector((state) => state.darkMode);

  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get(`https://rickandmortyapi.com/api/episode/${id}`)
        .then((response) => {
          dispatch(setEpisode(response.data));
          localStorage.setItem("episode", id);

          const charactersData = response.data.characters;
          const characterPromises = charactersData.map((characterUrl) => {
            return axios
              .get(characterUrl)
              .then((response) => response.data)
              .catch((error) => {
                console.error("Error fetching character:", error);
                return null;
              });
          });

          return Promise.all(characterPromises);
        })
        .then((characters) => {
          const filteredCharacters = characters.filter(
            (character) => character !== null
          );
          dispatch(setCharacters(filteredCharacters));
        })
        .catch((error) => console.error("Error fetching episode data:", error));

      axios
        .get(`https://rickandmortyapi.com/api/character/${id}`)
        .then((response) => {
          dispatch(setCharacters([response.data]));
        })
        .catch((error) => console.error("Error fetching characters:", error));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, id]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div>
      {!isLoading ? (
        <div className={`container ${darkMode ? "dark-mode" : ""}`}>
          <div className="navigation">
            <SwitchMode />
            <Link to="/">
              <button className="previous">
                Previous
                <div className="arrow">›</div>
              </button>
            </Link>
          </div>
          <h1 className="animate__animated animate__fadeInDown animate__delay-0.5s">
            Characters in this Episode
          </h1>
          {episode && (
            <div className="detailsEpisode animate__animated animate__fadeInDown animate__delay-1s">
              <p>
                {episode.name} • {episode.air_date}
              </p>
            </div>
          )}
          <img
            className="image animate__animated animate__fadeInDown animate__delay-1s"
            alt=""
            src="https://images.thedirect.com/media/article_full/rick-morty-characters.jpg?imgeng=cmpr_75/"
          ></img>
          <ul>
            {characters.map((character) => (
              <li
                className="animate__animated animate__fadeInDown animate__delay-2s"
                key={character.id}
              >
                <Link to={`/character/${character.id}`}>{character.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default EpisodePage;
