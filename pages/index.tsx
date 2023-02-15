import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'

import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
type WeatherCode = {
  key: number;
  value: string;
};

const weatherCodes: WeatherCode[] = [
  { key: 0, value: 'Clear sky' },
  { key: 1, value: 'Mainly clear' },
  { key: 2, value: 'Partly cloudy' },
  { key: 3, value: 'Overcast' },
  { key: 45, value: 'Fog and depositing rime fog' },
  { key: 51, value: 'Drizzle: Light intensity' },
  { key: 53, value: 'Drizzle: Moderate intensity' },
  { key: 55, value: 'Drizzle: Dense intensity' },
  { key: 56, value: 'Freezing Drizzle: Light intensity' },
  { key: 57, value: 'Freezing Drizzle: Dense intensity' },
  { key: 61, value: 'Rain: Slight intensity' },
  { key: 63, value: 'Rain: Moderate intensity' },
  { key: 65, value: 'Rain: Heavy intensity' },
  { key: 66, value: 'Freezing Rain: Light intensity' },
  { key: 67, value: 'Freezing Rain: Heavy intensity' },
  { key: 71, value: 'Snow fall: Slight intensity' },
  { key: 73, value: 'Snow fall: Moderate intensity' },
  { key: 75, value: 'Snow fall: Heavy intensity' },
  { key: 77, value: 'Snow grains' },
  { key: 80, value: 'Rain showers: Slight intensity' },
  { key: 81, value: 'Rain showers: Moderate intensity' },
  { key: 82, value: 'Rain showers: Violent intensity' },
  { key: 85, value: 'Snow showers slight' },
  { key: 86, value: 'Snow showers heavy' },
  { key: 95, value: 'Thunderstorm: Slight or moderate' },
  { key: 96, value: 'Thunderstorm with slight hail' },
  { key: 99, value: 'Thunderstorm with heavy hail' },
];

function searchKey(keyValuePairs: { key: number; value: string }[], key: number): string | undefined {
  const result = keyValuePairs.find((item) => item.key === key);
  return result ? result.value : undefined;
}



export default function Home({ city, lat, lon, weatherInfo }) {
  
  const date = new Date();
 // Output: 09:00 01-07-2022
  
 const saveWeather = (): void => {
  interface WeatherData {
    date: string;
    time: string;
    city: string;
    temperature: number;
    description: string;
  }

  const date = new Date();

  let data: WeatherData = {
    date: `${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
    time: date.toLocaleTimeString(),
    city: city,
    temperature: weatherInfo.current_weather.temperature,
    description: searchKey(weatherCodes, weatherInfo.current_weather.weathercode),
  };

  let previousData: WeatherData[] = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
  previousData.push(data);
  localStorage.setItem('weatherHistory', JSON.stringify(previousData));
  alert('Weather saved successfully');
};
  
  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center p-5"
        style={{ minHeight: "100vh" }}
      >
        <div>
          <div>
            <h1 className="fw-bolder" style={{ fontSize: "60px" }}>
              {city}
            </h1>
            <p>Lat:{lat}, Long:{lon} </p>
            <h3>{date.toDateString()}</h3>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="pe-5">
              <h2 className="d-inline mb-5">
                {weatherInfo.current_weather.temperature}
              </h2>
              <sup>°C</sup>
              {/* <p className="text-info">{weatherInfo.current_weather.weathercode}</p> */}
              <h2 className="text-info mt-2"> {searchKey(weatherCodes, weatherInfo.current_weather.weathercode)}</h2>

            </div>
            <div>
              <img src="/1.png" alt="" width={100} draggable="false" />
            </div>
          </div>
          <hr />
          <div className="d-md-flex justify-content-between align-items-center mt-4">
            <button onClick = {saveWeather} className="btn btn-success border-0 save-btn px-4 py-3 m-2">
             Timestamp
            </button>
            <Link href="/history">
              <button className="btn btn-danger border-0 history-btn px-4 py-3 ms-auto m-2">
                My History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>

    
  )
}

export async function getServerSideProps() {
  const ipRequest = await fetch(`http://ip-api.com/json/`);
  const ipData = await ipRequest.json();
  const lat = ipData.lat;
  const lon = ipData.lon;

  const geoCode = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
  const geoCodeData = await geoCode.json();
  const city = geoCodeData.locality;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current_weather=true&weather_code=true`;
  const weatherRequest = await fetch(url);
  const weatherInfo  = await weatherRequest.json();

  return {
    props: {
      city: city,
      lat: lat,
      lon: lon,
      weatherInfo: weatherInfo,
    },
  };

}
