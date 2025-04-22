import { FormEvent } from "react";
import { useWeather } from "../Context";
import {MapPin,Search,X } from "lucide-react";

export const Form = () => {
  const { city, setCity, error, clearWeather } = useWeather();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newCity = formData.get('city')?.toString().trim();

    if (newCity) {
      setCity(newCity);
    }
  };

  const handleClear = () => {
    setCity(null);
    clearWeather();
    (document.getElementById('cityForm') as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl">
      <div className="flex items-center justify-center gap-2 mb-6">
        <MapPin className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Weather Lookup</h1>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      <form id="cityForm" className="flex gap-2" onSubmit={handleSubmit}>
        <div className="relative flex-1">
          <input
            id="city"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            type="text"
            placeholder="Enter city name"
            name="city"
            required
            minLength={2}
            maxLength={50}
            pattern="[A-Za-z\s\-]+"
            title="Please enter a valid city name (letters, spaces, and hyphens only)"
          />
        </div>

        <button
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          type="submit"
          aria-label="Search for weather"
        >
          <Search className="w-5 h-5" />
        </button>

        {city && (
          <button
            className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
};
