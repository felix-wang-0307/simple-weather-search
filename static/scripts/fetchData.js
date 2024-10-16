export async function fetchData(street, city, state, autoDetect) {
  if (autoDetect) {
    // Fetch the user's location based on their IP address
    const {latitude, longitude, locationString} = await fetchIpInfo();
    const weather = await fetchWeather(latitude, longitude);
    return {locationString, weather};
  } else {
    // Fetch the user's location based on the form input
    const geocoding = await fetchGeocoding(street, city, state);
    // Destructure the latitude, longitude, and formatted_address properties from the geocoding object
    const {latitude, longitude, formatted_address} = geocoding;
    const weather = await fetchWeather(latitude, longitude);
    return {locationString: formatted_address, weather};
  }
}

async function fetchIpInfo() {
  const ipInfo = await fetch("https://ipinfo.io/json").then(res => res.json());
  const {city, region, country, postal, loc} = ipInfo;
  const locationString = `${city}, ${region} ${postal}, ${country}`;
  const [latitude, longitude] = loc.split(',').map(parseFloat);
  return {locationString, latitude, longitude};
}

async function fetchGeocoding(street, city, state) {
  const address = `${street}, ${city}, ${state}`;
  const url = `/geocoding?address=${address}`;
  const data = await fetch(url).then(response => response.json());
  if (!data.success) {
    throw new Error('Failed to fetch geocoding data');
  }
  return data.data;
}

async function fetchWeather(latitude, longitude) {
  const url = `/weather?latitude=${latitude}&longitude=${longitude}&`;
  const data = await fetch(url).then(response => response.json());
  if (!data.success || !data.data?.timelines?.length) {
    throw new Error('Failed to fetch weather data');
  }
  return data.data;
}
