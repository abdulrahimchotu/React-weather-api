import axios from 'axios';

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

export interface WeatherApiResponse {
    data: WeatherData | null;
    error: string | null;
}


export const fetchWeatherData = async (
    city: string
): Promise<WeatherApiResponse> => {
    try {
        const response = await axios.get<WeatherData>(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/next7days`,
            {
                params: {
                    key: import.meta.env.VITE_WEATHER_API_KEY,
                    unitGroup: 'metric',
                    contentType: 'json'
                }
            }
        );

        return {
            data: response.data,
            error: null
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return {
            data: null,
            error: 'Failed to fetch weather data. Please try again or check your API key.'
        };
    }
};
