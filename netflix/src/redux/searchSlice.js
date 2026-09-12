import uiReducer, { setSearchQuery, setSearchResults, setIsSearching } from "./uiSlice";

export const setSearchMovieDetails = ({ searchMovie, movies }) => (dispatch) => {
  dispatch(setSearchQuery(searchMovie));
  dispatch(setSearchResults(movies));
};

export default uiReducer;