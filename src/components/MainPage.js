import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEpisodes } from "../redux/actions";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MainPage.css";
import Loader from "./Loader";
import SwitchMode from "./SwitchMode";
import "animate.css";

const MainPage = () => {
  const dispatch = useDispatch();
  const episodes = useSelector((state) => state.episodes);
  const [isLoading, setLoading] = useState(true);
  const darkMode = useSelector((state) => state.darkMode);

  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get("https://rickandmortyapi.com/api/episode")
        .then((response) => {
          const sortedEpisodes = response.data.results.sort((a, b) => {
            return (
              parseInt(a.episode.match(/\d+/)[0]) -
              parseInt(b.episode.match(/\d+/)[0])
            );
          });

          dispatch(setEpisodes(sortedEpisodes));
        })
        .catch((error) => console.error("Error fetching episodes:", error));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <div>
      {!isLoading ? (
        <div className={`container ${darkMode ? "dark-mode" : ""}`}>
          <SwitchMode />
          <img
            className="imgTitle animate__animated animate__fadeInDown animate__delay-0.5s"
            alt="titleMain"
            src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg"
          ></img>
          <video
            className="animate__animated animate__fadeInDown animate__delay-1s"
            autoPlay={true}
            loop={true}
            muted
          >
            <source
              src="https://motionbgs.com/media/776/multiverse-of-rick-and-morty.960x540.mp4"
              type="video/mp4"
            />
          </video>
          <ul>
            {episodes.map((episode) => (
              <li
                className="animate__animated animate__fadeInDown animate__delay-2s"
                key={episode.id}
              >
                <Link to={`/episode/${episode.id}`}>
                  Episode {episode.episode} - {episode.name} -{" "}
                  {episode.air_date}
                </Link>
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

export default MainPage;
