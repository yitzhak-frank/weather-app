import styles from '../styles';
import Tooltip from "./tooltip";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import useWindowSize from '../hooks/screen_size';
import { getCurrentWeather } from "../services/accu_weather";
import { useEffect, useState } from "react";
import { editFavorites, REMOVE_FROM_FAVORITES } from '../redux/favorites_reducer';

const { headingBlue, headingYellow, starIcon, starIconOver, tempColor, weatherColor } = styles;

const Favorites = ({ favorites, editFavorites }) => {

    const { width } = useWindowSize();

    const [weather, setWeather] = useState([]);
    const [starOver, setStarOver] = useState(false);
    const [favoriteOver, setFavoriteOver] = useState(false);
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => (async() => {
        const weather = await Promise.all(favorites.map(({key}) => getCurrentWeather(key)));
        setWeather(weather.filter(item => item && !item.code));
    })(), [favorites]);

    const styles = {
        mainHeading: { fontSize: width < 500 ? '2rem' : '2.5rem' },
        favorite: { maxWidth: '900px', width: '90%', borderRadius: '10px', textDecoration: 'none', transition: '0.33s' },
        headingBlue, 
        headingYellow, 
        starIcon, 
        starIconOver,
        tempColor, 
        weatherColor,
    }
    
    return (
        <>
        <div className="top d-block pt-4" style={styles.top}>
                <h1 style={{...styles.headingBlue, ...styles.mainHeading}}>Favorites</h1>   
        </div>
        <main className="p-3 mx-auto">
            {
                !favorites.length ? 
                    <div className="no-location">
                        <h4 className="p-2 p-sm-5" style={styles.headingYellow}><i>You don't have any favorites yet.</i></h4>
                    </div>
                : weather.length ?
                    weather.map(([{ temperature, weather }], i) => {
                        if(!favorites[i]) return null; 
                        const { city, country } = favorites[i];
                        return(
                            <Link 
                                to={{ pathname: "/home", query: { location: favorites[i] } }}
                                className="favorite mx-auto my-3 p-3 d-block d-md-flex justify-content-between align-items-center shadow border" 
                                key={i}
                                style={{...styles.favorite, transform: (favoriteOver === i) && 'scale(1.1)'}}
                                onMouseEnter={() => setFavoriteOver(i)}
                                onMouseLeave={() => setFavoriteOver(false)}
                            >
                                <i 
                                    className="fas fa-star shadow"
                                    style={{...styles.starIcon, ...starOver === i ? styles.starIconOver : {}}}
                                    onMouseMove={setTooltip}
                                    onMouseEnter={() => setStarOver(i)}
                                    onMouseLeave={() => {
                                        setStarOver(false);
                                        setTooltip(false);
                                    }}
                                    onClick={(e) => {
                                        editFavorites(REMOVE_FROM_FAVORITES, favorites[i]);
                                        setTooltip(false);
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                ></i>
                                <h4 style={styles.headingBlue}>
                                    <strong>{city}</strong> <br/>
                                    <span>{country}</span>
                                </h4>
                                <h5 className="text-center p-3"> 
                                    <span style={styles.weatherColor(weather)}>{weather} </span>&nbsp;
                                    <span style={styles.tempColor(temperature)}>{temperature} °C</span>
                                </h5>
                            </Link>
                        )
                    })
                : <></>
            }
        </main>
        {tooltip && <Tooltip content={'Remove from favorites'} event={tooltip} />}
        </>
    );
}

const mapStateToProps = (state) => ({favorites: state});
const mapDispatchToprops = (dispatch) => ({editFavorites: (type, payload) => dispatch(editFavorites(type, payload))});

export default connect(mapStateToProps, mapDispatchToprops)(Favorites);