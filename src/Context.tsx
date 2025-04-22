import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { fetchWeatherData, WeatherData } from "./Api";

export interface WeatherContextState {
    city: string | null;
    setCity: (city: string | null) => void;
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
    clearWeather: () => void;
}

interface WeatherProviderProps {
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

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
    const [city, setCity] = useState<string | null>(null);

    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const clearWeather = useCallback(() => {
        setData(null);
        setError(null);
    }, []);

    useEffect(() => {
        const getWeather = async () => {
            if (!city) return;

            setLoading(true);
            setError(null);

            const response = await fetchWeatherData(city);

            setData(response.data);
            setError(response.error);
            setLoading(false);
        };

        getWeather();
    }, [city]);

    const contextValue: WeatherContextState = {
        city,
        setCity,
        data,
        loading,
        error,
        clearWeather
    };

    return (
        <WeatherContext.Provider value={contextValue}>
            {children}
        </WeatherContext.Provider>
    );
};
