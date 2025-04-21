import { useState, FormEvent } from "react";
import { WeatherProvider } from "../Context";
import { MapPin } from "lucide-react";
import { Temp } from "./Temp";

export const Form = () => {
  const [city, setCity] = useState<string | null>(null);
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newCity = formData.get('city')?.toString().trim();

    if (newCity) {
      setCity(newCity);
      setClicked(true);
    } else {
      setError('Please enter a valid city name');
    }
  };

  const handleClear = () => {
    setClicked(false);
    setCity(null);
    setError(null);
    (document.getElementById('cityForm') as HTMLFormElement).reset();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl">
      <div className="flex items-center justify-center gap-2 mb-6">
        <MapPin className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Weather Lookup</h1>
      </div>

      <form id="cityForm" className="space-y-4" onSubmit={handleSubmit}>
        <div>
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

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            Get Weather
          </button>

          {clicked && (
            <button
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {clicked && city && (
        <WeatherProvider city={city}>
          <Temp />
        </WeatherProvider>
      )}
    </div>
  );
};
