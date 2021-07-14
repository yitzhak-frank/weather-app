import styles from '../styles';
import Tooltip from "./tooltip";
import { connect } from "react-redux";
import useWindowSize from "../hooks/screen_size";
import { dateFormat } from "../services/date_util";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getCurrentWeather, getPlaces, getWeatherForecast } from "../services/accu_weather";
import { ADD_TO_FAVORITES, editFavorites, REMOVE_FROM_FAVORITES } from "../redux/favorites_reducer";

const { headingBlue, headingYellow, starIcon, starIconOver, tempColor, weatherColor } = styles;

const Home = ({ favorites, editFavorites }) => {

    const { query } = useLocation();
    const { width } = useWindowSize();

    // Selected location is when clicks on one of the favorites locations in favorites page.
    const selectedLocation = query && query.location;
    const defaultLocation = {city: "Tel Aviv", country: "Israel", key: "215854"};

    // Search value initialized with white space to avoid 'changing an uncontrolled input' warning.
    const [search, setSearch] = useState(' ');
    const [places, setPLaces] = useState(null);
    const [location, setLocation] = useState(selectedLocation || defaultLocation);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [weatherForecast, setWeatherForecast] = useState([]);
    const [placeOver, setPLaceOver] = useState(false);
    const [starOver, setStarOver] = useState(false);
    const [tooltip, setTooltip] = useState(null);
    
    useEffect(() => setSearch(''), []);
    useEffect(() => (async() => setPLaces(await getPlaces(search)))(), [search]);
    useEffect(() => {
        (async() => {
            setCurrentWeather(await getCurrentWeather(location.key));
            setWeatherForecast(await getWeatherForecast(location.key));
        })();
    }, [location]);

    const styles = {
        top: { position: 'fixed', top: '80px', left: width > 1200 ? (width - 1200) / 2 : 0, zIndex: 2, paddingTop: '20px', width: '100%', maxWidth: '1200px', backgroundColor: 'white' },
        mainHeading: { fontSize: width < 500 ? '2rem' : '2.5rem' },
        searchPlaces: { width: width > 768 ? '50%' : '90%' },
        input: { border: 'none', borderBottom: '2px solid #00BBFF', outline: 'none', borderRadius: '0' },
        searchIcon: { color: '#00BBFF' },
        places: { height: 'fit-content', width: '90%', maxWidth: '900px', marginTop: width > 768 ? '100px' : '150px' },
        place: { borderRadius: '7px', border: '1px solid #fff', transition: '0.33s' },
        main: { width: '90%', borderRadius: '15px', marginTop: (places && places.length) ? '' : width > 768 ? '100px' : '150px' },
        currentWeather: { position: 'relative' },
        dailyWeatherContainer: { overflow: 'auto', maxHeight: '350px', width: width > 768 ? '100%' : 'fit-content' },
        dailyWeather: { width: width > 400 && '300px', minWidth: width > 400 && '300px', borderRadius: '7px', height: 'fit-content' },
        starIcon: { position: 'absolute', top: '-25px', left: '25px', ...starIcon },
        starIconOver,
        headingBlue, 
        headingYellow, 
        tempColor, 
        weatherColor
    }

    return (
        <>
            <div className="top d-block d-md-flex justify-content-around align-items-start" style={styles.top}>
                <h1 className="" style={{...styles.headingBlue, ...styles.mainHeading}}>Weather Forecast</h1>
                <div className="search-places mx-auto mx-md-0" style={styles.searchPlaces}>
                    <div className="form-group mt-2 d-flex mx-auto">
                        <i style={styles.searchIcon} className="fas fa-search p-3"></i>
                        <input 
                            value={search}
                            className="form-control shadow-none" 
                            style={styles.input} 
                            placeholder="Search Location" 
                            onInput={({ target: { value }}) => setSearch(value)}
                        />
                    </div>
                </div>
            </div>
            <div className="places mx-auto mb-3" style={styles.places}>
            {
                (places && places.length) ? places.map(({ city, country, key }, i) => {
                    return (
                        <div 
                            className="place d-flex justify-content-between p-3 shadow m-1" 
                            style={{...styles.place, ...placeOver === i ? {transform: 'scale(1.1)', cursor: 'pointer'} : {}}} 
                            key={i}
                            onMouseEnter={() => setPLaceOver(i)}
                            onMouseLeave={() => setPLaceOver(false)}
                            onClick={() => {
                                setLocation({ city, country, key });
                                setPLaces(null);
                                setSearch('');
                            }}
                        >
                            <strong>{city}</strong>
                            <span>{country}</span>
                        </div>
                    )
                }): <></>
            }
            </div>
            <main style={styles.main} className="mx-auto shadow py-5 mb-5">
                {
                    places && !places.length ? 
                        <div className="no-location">
                            <h4 className="p-2 p-sm-5" style={styles.headingYellow}>There is no place match {search}.</h4>
                        </div>
                    : places && places.length ? 
                        <div className="no-location">
                            <h4 className="p-2 p-sm-5" style={styles.headingYellow}>Select any location to see its weather.</h4>
                        </div>
                    : <></>
                } {
                    (!places || !places.length) && currentWeather && currentWeather.length ?
                        currentWeather.map(({ temperature, weather }, i) => {
                            const { city, country } = location;
                            const isFavorite = favorites.some(({key}) => key === location.key);
                            return (
                                <div className="current-weather pt-3 px-3 pb-0" key={i} style={styles.currentWeather}>
                                    <i 
                                        className={isFavorite ? "fas fa-star shadow" : "far fa-star shadow"}
                                        style={{...styles.starIcon, ...starOver ? styles.starIconOver : {}}}
                                        onMouseMove={setTooltip}
                                        onMouseEnter={() => setStarOver(true)}
                                        onMouseLeave={() => {
                                            setStarOver(false);
                                            setTooltip(false);
                                        }}
                                        onClick={() => editFavorites(isFavorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES, location)}
                                    ></i>
                                    <div className="main-top d-block d-md-flex justify-content-around align-items-center">
                                        <h4 style={styles.headingBlue}>
                                            <strong>{city}</strong><br/>
                                            <span>{country}</span>
                                        </h4>
                                        <h5 className="text-center p-3"> 
                                            <span style={styles.weatherColor(weather)}>{weather} </span>&nbsp;
                                            <span style={styles.tempColor(temperature)}>{temperature} °C</span>
                                        </h5>
                                    </div>
                                </div>
                            )
                        })
                        
                    : (!places || !places.length) && !currentWeather ? 
                        <div className="no-weather">
                            <h4 className="p-2 p-sm-5" style={styles.headingYellow}>Something is not working :(</h4>
                        </div>
                    : <></>
                } {
                    (!places || !places.length) && weatherForecast && weatherForecast.length ?
                        <div className="weather-5-days mx-auto p-4 d-block d-md-flex" style={styles.dailyWeatherContainer}>
                            {weatherForecast.map(({ date, day, night, temperature }, i) => {
                                const { Maximum: { Value: max }, Minimum: { Value: min } } = temperature;
                                const { formatedDate, day: dayName } = dateFormat(date);
                                return (
                                    <div className="weather-day p-3 m-2 shadow" key={i} style={styles.dailyWeather}>
                                        <div className="day-top d-flex pb-3 justify-content-between">
                                            <strong>{dayName}</strong> 
                                            <span>{formatedDate}</span>
                                        </div>
                                        <div className="day-body">
                                            <h6>Day: &nbsp;&nbsp; <span style={styles.weatherColor(day)}>{day}</span></h6>
                                            <h6>Night: <span style={styles.weatherColor(night)}>{night}</span></h6>
                                            <h6 className="text-center mb-0"> 
                                                <span style={styles.tempColor(max)}>{max} °C</span>&nbsp;-&nbsp;
                                                <span style={styles.tempColor(min)}>{min} °C</span>
                                            </h6>
                                            
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    : <></>
                }
            </main>
            <div className="bottom-space p-3"></div>
            {tooltip && <Tooltip 
                content={favorites.some(({key}) => key === location.key) ? 'Remove from favorites' : 'Add to favorites'}
                event={tooltip}
            />}
        </>
    );
}

const mapStateToProps = (state) => ({favorites: state});
const mapDispatchToprops = (dispatch) => ({editFavorites: (type, payload) => dispatch(editFavorites(type, payload))});

export default connect(mapStateToProps, mapDispatchToprops)(Home);