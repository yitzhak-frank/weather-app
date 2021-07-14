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
    const url = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${search}`;
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
    const url = `https://dataservice.accuweather.com/currentconditions/v1/${location}?apikey=${apiKey}`;
    try {
        const resp  = await fetch(url);
        const respJ = await resp.json();
        if(!respJ.length) return respJ;
        return respJ.map(({ Temperature: { Imperial: { Value: F }, Metric: { Value: C }}, WeatherText: weather}) => ({ C, F, weather }));
    } catch(err) {
        errorHandler(true);
        return null;
    }
}

export const getWeatherForecast = async(location) => {
    if(!location) return null;
    errorHandler(false);
    const url = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${location}?apikey=${apiKey}&metric=true`;
    try {
        const resp  = await fetch(url);
        const respJ = await resp.json();
        if(!respJ.DailyForecasts && respJ.DailyForecasts.length) return respJ;
        return respJ.DailyForecasts.map(({ 
            Date: date, 
            Day: { IconPhrase: day },
            Night: { IconPhrase: night }, 
            Temperature: { Maximum: { Value: maxC }, Minimum: { Value: minC }}
        }) => ({ date, day, night, maxC, minC, maxF: ((maxC * 1.8) + 32).toFixed(1), minF: ((minC * 1.8) + 32).toFixed(1) }));
    } catch(err) {
        errorHandler(true);
        return null;
    }
}

export const getLocationKeyByCoords = async(lat, lng) => {
    if(!lat || !lng) return null;
    errorHandler(false);
    const url = `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${lng}`
    try {
        const resp  = await fetch(url);
        const { Key: key, ParentCity: { LocalizedName: city }, Country: { LocalizedName: country } } = await resp.json();
        return { key, city: 'Your location\n\r' + city, country };
    } catch(err) {
        errorHandler(true);
        return null;
    }
}