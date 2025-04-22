import './App.css'
import { Form } from './components/Form'
import { WeatherProvider } from './Context'
import { Temp } from './components/SliderContainer'

function App() {
  return (
    <WeatherProvider>
      <div className="container mx-auto px-4 py-8">
        <Form />
        <Temp />
      </div>
    </WeatherProvider>
  )
}

export default App
