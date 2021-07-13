import { toast } from "react-toastify";
import { apiKey } from '../config.json';

// Error handler to prevent multiple toast messages when there is a global error that cause errors in multiple calls.
let error;

const errorHandler = (isError) => {
    if(!!error !== isError) {
        if(error) clearTimeout(error);
        error = setTimeout(() => {
            toast.error('Something went wrong');
            error = null;
        }, 500);
    }
}

export const getPlaces = async(search) => {
    search = search.replace(/^ +/, '');
    if(!search) return null;
    errorHandler(false);
    const url = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${search}&language=en-us`;
    try {
        const resp  = await fetch(url);
        const respJ = await resp.json();
        if(!respJ.length) return respJ;
        return respJ.map(({ AdministrativeArea: { LocalizedName: city }, Country: { LocalizedName: country }, Key: key }) => ({ city, country, key }));
    } catch(err) {
        errorHandler(true);
        return null;
    }
};

export const getCurrentWeather = async(location) => {
    if(!location) return null;
    errorHandler(false);
    const url = `http://dataservice.accuweather.com/currentconditions/v1/${location}?apikey=${apiKey}&language=en-us&details=false`;
    try {
        const resp  = await fetch(url);
        const respJ = await resp.json();
        if(!respJ.length) return respJ;
        return respJ.map(({ Temperature: { Metric: { Value: temperature }}, WeatherText: weather, WeatherIcon: icon}) => ({ temperature, weather, icon }));
    } catch(err) {
        errorHandler(true);
        return null;
    }
}

export const getWeatherForecast = async(location) => {
    if(!location) return null;
    errorHandler(false);
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${location}?apikey=${apiKey}&language=en-us&details=false&metric=true`;
    try {
        const resp  = await fetch(url);
        const respJ = await resp.json();
        if(!respJ.DailyForecasts && respJ.DailyForecasts.length) return respJ;
        return respJ.DailyForecasts.map(({ Date: date, Day: { IconPhrase: day }, Night: { IconPhrase: night }, Temperature: temperature }) => ({ date, day, night, temperature }));
    } catch(err) {
        errorHandler(true);
        return null;
    }
}
