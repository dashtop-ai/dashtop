import { defineWidget } from '@dashtop/widget-sdk';

/**
 * Weather Widget
 *
 * Shows mock weather data for a configurable city.
 * Demonstrates the full widget lifecycle: render, config changes, edit mode.
 */

interface WeatherConfig {
  city: string;
  units: 'imperial' | 'metric';
}

// Mock weather data
const CITIES: Record<string, { temp: number; condition: string; icon: string; humidity: number; wind: number }> = {
  'new york': { temp: 72, condition: 'Partly Cloudy', icon: '⛅', humidity: 65, wind: 8 },
  'london': { temp: 58, condition: 'Rainy', icon: '🌧️', humidity: 82, wind: 12 },
  'tokyo': { temp: 78, condition: 'Sunny', icon: '☀️', humidity: 55, wind: 5 },
  'paris': { temp: 64, condition: 'Overcast', icon: '☁️', humidity: 70, wind: 10 },
  'sydney': { temp: 68, condition: 'Clear', icon: '🌤️', humidity: 45, wind: 15 },
  'dubai': { temp: 104, condition: 'Hot & Sunny', icon: '🔥', humidity: 20, wind: 7 },
};

function getWeather(city: string, units: string) {
  const data = CITIES[city.toLowerCase()] || CITIES['new york'];
  const temp = units === 'metric' ? Math.round((data.temp - 32) * 5 / 9) : data.temp;
  const unit = units === 'metric' ? '°C' : '°F';
  return { ...data, temp, unit };
}

export default defineWidget<WeatherConfig>((root, { config, isEditing, onConfigChange }) => {
  const weather = getWeather(config.city || 'New York', config.units || 'imperial');

  const html = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:16px; font-family:system-ui,sans-serif; gap:4px;">
      <div style="font-size:48px; line-height:1;">${weather.icon}</div>
      <div style="font-size:32px; font-weight:700;">${weather.temp}${weather.unit}</div>
      <div style="font-size:14px; color:#666;">${weather.condition}</div>
      <div style="font-size:12px; color:#999; margin-top:2px;">
        📍 ${config.city || 'New York'}
      </div>
      <div style="display:flex; gap:12px; margin-top:8px; font-size:11px; color:#888;">
        <span>💧 ${weather.humidity}%</span>
        <span>💨 ${weather.wind} mph</span>
      </div>
      ${isEditing ? `
        <div style="display:flex; gap:4px; margin-top:12px; flex-wrap:wrap; justify-content:center;">
          ${Object.keys(CITIES).map(city =>
            `<button data-city="${city}" style="padding:3px 8px; border-radius:4px; border:1px solid ${city === config.city?.toLowerCase() ? '#7c3aed' : '#ddd'}; background:${city === config.city?.toLowerCase() ? '#7c3aed' : 'white'}; color:${city === config.city?.toLowerCase() ? 'white' : '#333'}; cursor:pointer; font-size:11px; text-transform:capitalize;">${city}</button>`
          ).join('')}
        </div>
      ` : ''}
    </div>
  `;

  root.innerHTML = html;

  // Attach city button click handlers in edit mode
  if (isEditing) {
    root.querySelectorAll<HTMLButtonElement>('[data-city]').forEach(btn => {
      btn.onclick = () => {
        const city = btn.dataset.city || 'New York';
        onConfigChange({ city: city.charAt(0).toUpperCase() + city.slice(1) });
      };
    });
  }

  return () => { root.innerHTML = ''; };
});
