import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEpisodes, setCharacter } from "../redux/actions";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./CharacterPage.css";
import Loader from "./Loader";
import SwitchMode from "./SwitchMode";

const CharacterPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const character = useSelector((state) => state.character);
  const lastLocation = character?.location?.name;
  const episodeList = useSelector((state) => state.episodes);
  const [isLoading, setLoading] = useState(true);
  const darkMode = useSelector((state) => state.darkMode);
  const episode = useSelector((state) => state.currentEpisode);
  const episodeLocal = localStorage.getItem("episode");

  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get(`https://rickandmortyapi.com/api/character/${id}`)
        .then((response) => {
          dispatch(setCharacter(response.data));
          return response.data.episode;
        })
        .then((episodeURLs) => {
          const episodeRequests = episodeURLs.map((url) => axios.get(url));
          Promise.all(episodeRequests)
            .then((responses) => responses.map((response) => response.data))
            .then((episodes) => {
              dispatch(setEpisodes(episodes));
            })
            .catch((error) => console.error("Error fetching episodes:", error));
        })
        .catch((error) => console.error("Error fetching character:", error));

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
            <Link to={`/episode/${(episode && episode.id) || episodeLocal}`}>
              <button className="previous">
                Previous
                <div className="arrow">›</div>
              </button>
            </Link>
          </div>
          {character && (
            <div>
              <h1 className="animate__animated animate__fadeInDown animate__delay-0.5s">
                {character.name}
              </h1>
              <p className="animate__animated animate__fadeInDown animate__delay-1s">
                Status: {character.status}
              </p>
              <p className="animate__animated animate__fadeInDown animate__delay-1s">
                Gender: {character.gender}
              </p>
              <p className="animate__animated animate__fadeInDown animate__delay-1s">
                Last Known Location: {lastLocation || "Unknown"}
              </p>
              <img
                className="characterImg animate__animated animate__fadeInDown animate__delay-1s"
                src={character.image}
                alt={character.name}
              />
            </div>
          )}

          <h2 className="animate__animated animate__fadeInDown animate__delay-2s">
            Episodes featuring {character && character.name}
          </h2>
          <ul>
            {episodeList.map((episode) => (
              <li
                className="animate__animated animate__fadeInDown animate__delay-2s"
                key={episode.id}
              >
                Episode {episode.episode} - {episode.name}
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

export default CharacterPage;
