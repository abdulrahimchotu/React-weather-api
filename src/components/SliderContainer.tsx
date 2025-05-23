import { useState, useEffect } from 'react';
import { useWeather } from '../Context';
import {Cloud,Wind,Droplets,Gauge,Thermometer,Sunrise,Sunset,ChevronLeft,ChevronRight,Calendar,Loader2,AlertCircle,Sun,CloudRain,CloudSnow,CloudFog } from "lucide-react";
import { useKeenSlider } from 'keen-slider/react';
import "keen-slider/keen-slider.min.css";

export const Temp = () => {
    const { data, loading, error, city } = useWeather();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
        loop: true,
        mode: "snap",
        slides: { perView: 1, spacing: 20 },
    });

    useEffect(() => {
        if (data) {
            setCurrentSlide(0);
            instanceRef.current?.moveToIdx(0);
        }
    }, [data]);

    const formatDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (timeStr: string): string => {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const getWeatherIcon = (condition: string) => {
        const lowerCondition = condition.toLowerCase();
        if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
            return <Sun className="h-16 w-16 text-yellow-500" />;
        } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
            return <CloudRain className="h-16 w-16 text-blue-600" />;
        } else if (lowerCondition.includes('snow')) {
            return <CloudSnow className="h-16 w-16 text-blue-400" />;
        } else if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
            return <CloudFog className="h-16 w-16 text-gray-500" />;
        } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
            return <Cloud className="h-16 w-16 text-gray-600" />;
        } else if (lowerCondition.includes('partially cloudy') || lowerCondition.includes('partly cloudy')) {
            return <Cloud className="h-16 w-16 text-blue-500" />;
        } else {
            return <Cloud className="h-16 w-16 text-gray-600" />;
        }
    };

    const getUnitSymbol = () => '°';
    const getSpeedUnit = () => 'km/h';

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40 p-8 bg-white/50 rounded-lg shadow-sm">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
                <p className="text-gray-600 font-medium">Loading weather data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 font-medium mb-2">{error}</p>
                <p className="text-gray-600 text-sm">Please try again or check your API key.</p>
            </div>
        );
    }
    if (!city) {
        return null;
    }

    if (!data || !data.days || data.days.length === 0) {
        return (
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-center mt-4">
                <p className="text-yellow-600">No weather data available</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 overflow-hidden">
            <h1 className="text-2xl font-semibold text-center mb-6">
                {data.address}
            </h1>

            <div className="relative">
                <div ref={sliderRef} className="keen-slider overflow-hidden">
                    {data.days.map((day) => (
                        <div key={day.datetime} className="keen-slider__slide">
                            <div className="bg-blue-300/90 rounded-xl shadow-lg p-6 overflow-hidden mx-auto max-w-lg">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                        <h2 className="text-lg font-medium">
                                            {formatDate(day.datetime)}
                                        </h2>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        {getWeatherIcon(day.conditions)}
                                        <div className="text-5xl font-bold mt-2">
                                            {Math.round(day.temp)}{getUnitSymbol()}
                                        </div>
                                        <p className="text-gray-700 mt-1">
                                            {day.conditions}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1 text-gray-600">
                                            <Thermometer className="h-4 w-4" />
                                            <span className="text-sm">Feels like {Math.round(day.feelslike)}{getUnitSymbol()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <Droplets className="h-6 w-6 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Humidity</p>
                                            <p className="font-medium">{day.humidity}%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <Wind className="h-6 w-6 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Wind Speed</p>
                                            <p className="font-medium">{Math.round(day.windspeed)} {getSpeedUnit()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <Gauge className="h-6 w-6 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Pressure</p>
                                            <p className="font-medium">{day.pressure} hPa</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <Thermometer className="h-6 w-6 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Temperature</p>
                                            <p className="font-medium">{Math.round(day.temp)}{getUnitSymbol()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-200 to-blue-100 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Sunrise className="h-6 w-6 text-orange-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Sunrise</p>
                                            <p className="font-medium">{formatTime(day.sunrise)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Sunset className="h-6 w-6 text-indigo-500" />
                                        <div>
                                            <p className="text-xs text-gray-500">Sunset</p>
                                            <p className="font-medium">{formatTime(day.sunset)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {loaded && instanceRef.current && data.days.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                instanceRef.current?.prev();
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3
                                     bg-white rounded-full p-2 shadow-lg hover:bg-gray-50
                                     transition-colors duration-200"
                            aria-label="Previous day"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                instanceRef.current?.next();
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3
                                     bg-white rounded-full p-2 shadow-lg hover:bg-gray-50
                                     transition-colors duration-200"
                            aria-label="Next day"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        <div className="flex justify-center gap-2 mt-6 mb-2">
                            {data.days.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                                    className={`h-2 rounded-full transition-all duration-200
                                      ${currentSlide === idx
                                            ? "w-6 bg-blue-600"
                                            : "w-2 bg-gray-700 hover:bg-white"
                                        }`}
                                    aria-label={`Go to day ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
