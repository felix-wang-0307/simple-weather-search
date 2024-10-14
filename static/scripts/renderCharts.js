import { Meteogram } from "./meteogram.js";

function renderTemperatureRanges(weeklyWeather) {
  const dates = weeklyWeather.map(item => new Date(item.startTime).valueOf());  // getTimeStamp
  const temperatureMax = weeklyWeather.map(item => item.values.temperatureMax);
  const temperatureMin = weeklyWeather.map(item => item.values.temperatureMin);
  let data = [];
  for (let i = 0; i < weeklyWeather.length; i++) {
    data.push([dates[i], temperatureMax[i], temperatureMin[i]]);
  }
  Highcharts.chart('temperature-ranges', {
    chart: {
      type: 'arearange',
      zooming: {
        type: 'x'
      },
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1
      }
    },
    title: {
      text: 'Temperature Ranges (Min, Max)'
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: '°F',
      xDateFormat: '%A, %b %e'
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Temperatures',
      data: data,
      marker: {
        fillColor: '#58acf7',  // Set the points to light blue
        lineWidth: 2,
        lineColor: '#58acf7',
        radius: 3
      },
      color: {
        linearGradient: {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 1
        },
        stops: [
          [0, '#ffab00'],
          [1, '#66ccff']
        ]
      },
      lineColor: '#ffab00',  // Set the line color to yellow
      lineWidth: 2           // Set the line width to make it visible
    }]
  });
}

function renderHourlyWeather(hourlyWeather) {
  window.meteogram = new Meteogram(hourlyWeather, 'hourly-weather');
}

export const renderCharts = (weeklyWeather, hourlyWeather) => {
  renderTemperatureRanges(weeklyWeather);
  renderHourlyWeather(hourlyWeather);
}


