import "./Loader.css";
import LoaderJPG from "../load.png";

const Loader = () => {
  return (
    <div className="containerLoader">
      <img className="loader" src={LoaderJPG} alt="Loader SVG" />
      <div className="loadingText">Loading...</div>
    </div>
  );
};

export default Loader;
