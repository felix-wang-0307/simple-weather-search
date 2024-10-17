import json
import requests
from dotenv import load_dotenv
import os

load_dotenv()

WEATHER_API = "https://api.tomorrow.io/v4/timelines"
GOOGLE_MAPS_API = "https://maps.googleapis.com/maps/api/geocode/json"


def get_weather(latitude, longitude):
    """
    Get weather data from Tomorrow.io API.
    API Docs: https://docs.tomorrow.io/reference/get-timelines
    """
    print("Incoming request for weather data", latitude, longitude)
    if latitude is None or longitude is None:
        return {"success": False, "error": "Missing latitude or longitude"}, 400

    def fetch_api (api_key):
        return requests.get(
            WEATHER_API,
            params={
                "location": f"{latitude},{longitude}",
                "apikey": api_key,
                "fields": [
                    "temperature",
                    "temperatureApparent",
                    "temperatureMin",
                    "temperatureMax",
                    "windSpeed",
                    "windDirection",
                    "humidity",
                    "pressureSeaLevel",
                    "uvIndex",
                    "weatherCode",
                    "precipitationProbability",
                    "precipitationType",
                    "sunriseTime",
                    "sunsetTime",
                    "visibility",
                    "moonPhase",
                    "cloudCover",
                ],
                "units": "imperial",
                "timesteps": ["current", "1h", "1d"],
                "timezone": "America/Los_Angeles",
            },
        )

    try:
        response = fetch_api(os.getenv("TOMORROW_API_KEY"))
        if response.status_code != 200:
            raise Exception("Failed to fetch weather data")
    except Exception as e:
        response = fetch_api(os.getenv("TOMORROW_API_FAILOVER_KEY"))

    data = response.json().get("data")
    if response.status_code != 200 or data is None:
        return {"success": False, "error": "Failed to fetch weather data"}, 500

    return {"success": True, "data": data}, 200


def get_geocode_info(address):
    """
    Get geocode information from Google Maps API.
    """
    response = requests.get(
        GOOGLE_MAPS_API,
        params={"address": address, "key": os.getenv("GOOGLE_MAPS_API_KEY")},
        headers={"Accept-language": "en"},
    )

    if response.status_code != 200:
        return {"success": False, "error": "Failed to fetch address info"}, 500

    data = response.json().get("results")
    if data and len(data) > 0:
        data = data[0]
    else:
        print(response.json())
        return {"success": False, "error": "Failed to fetch address info"}, 500
    coordinates = data.get("geometry").get("location")
    formatted_address = data.get("formatted_address")
    return {
        "success": True,
        "data": {
            "latitude": coordinates.get("lat"),
            "longitude": coordinates.get("lng"),
            "formatted_address": formatted_address,
        },
    }, 200


if __name__ == "__main__":
    weather_data = get_weather(34.0522, -118.2437)
    geocode_info = get_geocode_info("University of Southern California")

    with open("test.json", "w") as f:
        json.dump(
            {
                "weather_data": json.loads(weather_data),
                "geocode_info": json.loads(geocode_info),
            },
            f,
            indent=4,
        )

    print(json.dumps(json.loads(weather_data), indent=4))
    print(json.dumps(json.loads(geocode_info), indent=4))
