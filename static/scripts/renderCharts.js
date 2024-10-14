import {Meteogram} from "./meteogram";

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

function fuck(hourlyWeather) {
  console.log(hourlyWeather)
  window.meteogram = new Meteogram(hourlyWeather, 'hourly-weather');



  // Highcharts.ajax({
  //   url,
  //   dataType: 'json',
  //   success: json => {
  //     window.meteogram = new Meteogram(json, 'container');
  //   },
  //   error: Meteogram.prototype.error,
  //   headers: {
  //     // Override the Content-Type to avoid preflight problems with CORS
  //     // in the Highcharts demos
  //     'Content-Type': 'text/plain'
  //   }
  // });
}

function renderHourlyWeather(hourlyWeather) {
  console.log("hourlyWeather", hourlyWeather);
  const temperatures = [];
  const pressures = [];
  const winds = [];
  const humidities = [];
  let skip = false;

  hourlyWeather.forEach(item => {
    const x = new Date(item.startTime).getTime();

    // Temperature
    temperatures.push({
      x: x,
      y: item.values.temperature,
    });

    // Pressure
    pressures.push({
      x: x,
      y: item.values.pressureSeaLevel,
    });

    humidities.push({
      x: x,
      y: item.values.humidity,
    });

    // Wind speed and direction (for windbarbs)
    if (!skip) {
      winds.push({
        x: x,
        value: item.values.windSpeed,
        direction: item.values.windDirection,
      });
    }
    skip = !skip;
  });

  // Chart options similar to Meteogram prototype
  Highcharts.chart('hourly-weather', {
    chart: {
      type: 'spline',
    },
    title: {
      text: 'Hourly Weather (Next 5 Days)'
    },
    xAxis: [{
      type: 'datetime',
      tickInterval: 36000 * 2, // 2 hours
      labels: {
        format: '{value:%H}'  // Format to show hour
      },
      crosshair: true,
      gridLineWidth: 1,
    }],
    yAxis: [{ // Temperature Y-axis
      title: {
        text: 'Temperature (°F)'
      },
      labels: {
        format: '{value}°F'
      },
    }, { // Pressure Y-axis
      title: {
        text: 'Pressure (inHg)',
        align: 'high'
      },
      opposite: true,
      labels: {
        format: '{value} inHg'
      }
    }],
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        return `<b>${Highcharts.dateFormat('%A %b %e %H:%M', this.x)}</b><br>
                    <b>Temperature:</b> ${this.points[0].y}°F<br>
                    <b>Pressure:</b> ${this.points[1].y} inHg<br>
                    <b>Wind Speed:</b> ${this.points[2].point.value} mph<br>
                    <b>Wind Direction:</b> ${this.points[2].point.direction}°`;
      }
    },
    series: [{
      name: 'Temperature',
      data: temperatures,
      color: '#FF3333',
      tooltip: {
        valueSuffix: '°F'
      }
    }, {
      name: 'Pressure',
      data: pressures,
      yAxis: 1,
      color: '#ffab00',
      dashStyle: 'ShortDot',
      tooltip: {
        valueSuffix: ' inHg'
      }
    }, {
      name: 'Humidity',
      data: humidities,
      color: '#66ccff',
      // show as bar
      type: 'column',
    }, {
      name: 'Wind Speed and Direction',
      type: 'windbarb',
      data: winds,
      vectorLength: 8,
      yOffset: -20,
      color: '#565395',
      tooltip: {
        valueSuffix: ' mph'
      }
    }]
  });
}

export const renderCharts = (weeklyWeather, hourlyWeather) => {
  console.log("about to render charts");
  renderTemperatureRanges(weeklyWeather);
  // renderHourlyWeather(hourlyWeather);
  fuck(hourlyWeather);
}


