import styles from '../styles';
import Tooltip from "./tooltip";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import useWindowSize from '../hooks/screen_size';
import { getCurrentWeather } from "../services/accu_weather";
import { useEffect, useState } from "react";
import { editFavorites, REMOVE_FROM_FAVORITES } from '../redux/favorites_reducer';

const { headingBlue, headingYellow, icon, iconOver, tempColor, weatherColor } = styles;

const Favorites = ({ favorites, editFavorites }) => {

    const { width } = useWindowSize();

    const [weather, setWeather] = useState([]);
    const [starOver, setStarOver] = useState(false);
    const [favoriteOver, setFavoriteOver] = useState(false);
    const [tooltip, setTooltip] = useState(null);
    const [fahrenheit, setFahrenheit] = useState(false);
    const [switchCelsiusOver, setSwitchCelsiusOver] = useState(false);

    useEffect(() => (async() => {
        const weather = await Promise.all(favorites.map(({key}) => getCurrentWeather(key)));
        setWeather(weather.filter(item => item && !item.code));
    })(), [favorites]);

    const styles = {
        mainHeading: { fontSize: width < 500 ? '2rem' : '2.5rem' },
        favorite: { maxWidth: '900px', width: '90%', borderRadius: '10px', textDecoration: 'none', transition: '0.33s' },
        location: { whiteSpace: 'pre-wrap' },
        headingBlue, 
        headingYellow, 
        icon, 
        iconOver,
        tempColor, 
        weatherColor,
    }

    const handleStarClick = (e, i) => {
        editFavorites(REMOVE_FROM_FAVORITES, favorites[i]);
        setStarOver(false);
        setTooltip(false);
        e.preventDefault();
        e.stopPropagation();
    }

    const handleSwitchCelsiusClick = (e) => {
        setFahrenheit(!fahrenheit);
        setSwitchCelsiusOver(false);
        setTooltip(false);
        e.preventDefault();
        e.stopPropagation();
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
                    weather.map(([{ C, F, weather }], i) => {
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
                                <div className="icons d-flex">
                                    <i 
                                        className="fas fa-star shadow"
                                        style={{...styles.icon, ...starOver === i ? styles.iconOver : {}}}
                                        onMouseMove={(event) => setTooltip({event, content: 'Remove from favorites'})}
                                        onMouseEnter={() => setStarOver(i)}
                                        onMouseLeave={() => {
                                            setStarOver(false);
                                            setTooltip(false);
                                        }}
                                        onClick={(e) => handleStarClick(e, i)}
                                    ></i>
                                    <strong 
                                        className="d-flex justify-content-center align-items-center p-0 ml-3"
                                        style={{...styles.icon, ...switchCelsiusOver === i ? styles.iconOver : {}}}
                                        onMouseMove={(event) => setTooltip({event, content: 'Switch to ' + (fahrenheit ? 'celsius' : 'fahrenheit')})}
                                        onMouseEnter={() => setSwitchCelsiusOver(i)}
                                        onMouseLeave={() => {
                                            setSwitchCelsiusOver(false);
                                            setTooltip(false);
                                        }}
                                        onClick={handleSwitchCelsiusClick}
                                    >°{fahrenheit ? 'C' :'F'}</strong>
                                </div>
                                <h4 style={styles.headingBlue}>
                                    <strong style={styles.location}>{city}</strong> <br/>
                                    <span>{country}</span>
                                </h4>
                                <h5 className="text-center p-3"> 
                                    <span style={styles.weatherColor(weather)}>{weather} </span>&nbsp;
                                    <span style={styles.tempColor(C)}>{fahrenheit ? F : C} °{fahrenheit ? 'F' :'C'}</span>
                                </h5>
                            </Link>
                        )
                    })
                : <></>
            }
        </main>
        {tooltip && <Tooltip content={tooltip.content} event={tooltip.event} />}
        </>
    );
}

const mapStateToProps = (state) => ({favorites: state});
const mapDispatchToprops = (dispatch) => ({editFavorites: (type, payload) => dispatch(editFavorites(type, payload))});

export default connect(mapStateToProps, mapDispatchToprops)(Favorites);