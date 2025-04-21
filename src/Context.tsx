import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import axios from "axios";

export interface WeatherData {
    address: string;
    days: DayWeather[];
}

export interface DayWeather {
    conditions: string;
    datetime: string;
    temp: number;
    pressure: number;
    humidity: number;
    windspeed: number;
    sunrise: string;
    sunset: string;
    feelslike: number;
}

export interface WeatherContextState {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
}

interface Props {
    city: string;
    children: ReactNode;
}

const WeatherContext = createContext<WeatherContextState | null>(null);

export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error('useWeather must be used within a WeatherProvider');
    }
    return context;
};

export const WeatherProvider = ({ city, children }: Props) => {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getWeather = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await axios.get<WeatherData>(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next7days`,
                {
                    params: {
                        key: import.meta.env.VITE_WEATHER_API_KEY,
                        unitGroup: 'metric',
                        contentType: 'json'
                    }
                }
            );
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching weather data:', err);
            setError('Failed to fetch weather data. Please try again or check your API key.');
            setLoading(false);
        }
    }, [city]);

    useEffect(() => {
        if (city) {
            getWeather();
        }
    }, [city, getWeather]);

    return (
        <WeatherContext.Provider value={{ data, loading, error }}>
            {children}
        </WeatherContext.Provider>
    );
};
