var CronJob = require("cron").CronJob;
var getJSON = require("get-json");

function Unix_timestamp(t) {
  var dt = new Date(t * 1000);
  return dt.getDate();
}

function getForecast() {
  var cur_datetime = new Date();
  getJSON(
    "http://api.openweathermap.org/data/2.5/forecast/daily?q=Kyiv&appid=d01946c71f847270df726ba46cc786b6&mode=json&units=metric&cnt=2"
  )
    .then(function(response) {
      for (var i = 0; i < response.list.length; i++) {
        if (cur_datetime.getDate() == Unix_timestamp(response.list[i].dt)) {
          if (response.list[i].temp.morn < 0) {
            getJSON("http://192.168.0.77:1880/floor").catch(function(error) {
              console.log(error);
            });
          }
        }
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

new CronJob(
  "* * 6 * * *",
  function() {
    getForecast();
    console.log("go!");
  },
  null,
  true,
  "America/Los_Angeles"
);

