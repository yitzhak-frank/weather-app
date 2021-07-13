export const 
    GET_ALL_FAVORITES = 'GET_ALL_FAVORITES',
    ADD_TO_FAVORITES = 'ADD_TO_FAVORITES', 
    REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';

const initStartsState = [];

export const favoritesReducer = (state = initStartsState, action) => {
    switch(action.type) {
        case GET_ALL_FAVORITES: return action.payload;
        case ADD_TO_FAVORITES: return [...state, action.payload];
        case REMOVE_FROM_FAVORITES: return state.filter(({key}) => key !== action.payload.key);
        default: return state;
    }
}

// Get favorites from localstorage.
export const getFavorites = (dispatch) => {
    const type = GET_ALL_FAVORITES;
    const payload = JSON.parse(localStorage['favorites'] || "[]");
    dispatch(favoritesHandler(type, payload));
}

// Save favorites to localstorage and update state.
export const editFavorites = (type, payload) => {
    switch(type) {
        case ADD_TO_FAVORITES: 
            localStorage['favorites'] = JSON.stringify([...JSON.parse(localStorage['favorites'] || "[]"), payload]);
            break;
        case REMOVE_FROM_FAVORITES:
            localStorage['favorites'] = JSON.stringify(JSON.parse(localStorage['favorites']).filter(({key}) => key !== payload.key));
            break;
        default: break;
    }
    return (dispatch) => dispatch(favoritesHandler(type, payload));
}

export const favoritesHandler = (type, payload) => ({type, payload});