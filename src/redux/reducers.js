const initialState = {
  episodes: [],
  characters: [],
  character: {},
  currentEpisode: null,
  darkMode: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EPISODES":
      return { ...state, episodes: action.payload };
    case "SET_CHARACTERS":
      return { ...state, characters: action.payload };
    case "SET_EPISODE":
      return { ...state, currentEpisode: action.payload };
    case "SET_CHARACTER":
      return { ...state, character: action.payload };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
