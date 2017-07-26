'use strict';

/* Controllers */

// # days to predict
var forecastRange = 5,
  weekdaysAbbr = ['su','mo','tu','we','th','fr','sa'],
  weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

var foreCasticApp = angular.module('foreCasticApp', []);

foreCasticApp.controller('WeatherReportCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
  
  // set (blank) defaults
  $scope.bgImg = '';
  $scope.bgImg = 'assets/img/background/seattle/bg.jpg';
  $scope.ready = '';      // initial view not ready
  $scope.focus = 0;       // initial view open
  $scope.limitMin = 20;   // limit for min temp
  $scope.limitMax = 100;  // limit for max temp

  // set a class on the <body> element so view can update via css
  $scope.bodyClass = function( ready ) {
    return $scope.ready + 'active-' + $scope.focus;
  }
  // set classes on each day's weather report to control display via css
  $scope.reportClass = function( index ) {
    var className = 'day-' + index;
    if( $scope.focus === index ) {
      className += ' active';
    }
    return className;
  }

  // user selects new location from dropdown
  $scope.changeLocation = function( location ) {
    // clear everything 
    $scope.forecast = null;
    $scope.createForecast( location );
  }

  // user selects different day
  $scope.changeDay = function(index) {
    $scope.focus = index;
  }

  // callback on successful
  $scope.returnForecast = function( prediction ) {
    // focus is on first item in array
    // console.log( 'returnForecast');
    $scope.focus = 0;
    $scope.bgIcon = prediction[0].icon;
    // TODO: multiple images per location for different conditions
    // use icon string as identifier

    $scope.bgImg = $scope.location.img;

    if (forecastRange === prediction.length - 1 ) {
      $scope.forecast = prediction;
      $scope.ready = 'loaded ';      // initial view not ready

      // data won't display until click action
      // TODO: fix this!
      $( '#click-targ' ).click();
      // $scope.displayForecast();
    }
  }
  // only here to give #click-targ something to do
  $scope.displayForecast = function() {
    // console.log( $scope.forecast);
  }

  // round temperatures to nearest integer
  $scope.roundTemp = function( data ) {
    if ( data ) {
      data = Math.round( data );
    }
    return data;
  }

  // parse the raw data returned from ForecastIO into what we need for the app
  $scope.parseForecastData = function( data, n ) {
    var timeStamp = new Date( data.getTime() * 1000 ),    // forecastIO returns secs, needs millisecs
      dateDisplay = timeStamp.getMonth() + '.' +
        timeStamp.getDate() + '.' +
        timeStamp.getFullYear().toString().substr( 2 ),
      isCurrent = !! data.getTemperature(),
      // FPO random values for POC
      // Real deal will require much data
      randomLowDate = timeStamp.getFullYear() - Math.floor(Math.random() * 60),
      randomHiDate = timeStamp.getFullYear() - Math.floor(Math.random() * 20),
      randomLowTemp = isCurrent ? data.getTemperature() - 20 - Math.floor(Math.random() * 10) : data.getMinTemperature() - 10 - Math.floor(Math.random() * 10),
      randomHiTemp = ( isCurrent ? data.getTemperature() : data.getMaxTemperature() ) + 20 + Math.floor(Math.random() * 10),
      obj = {
        index: n,
        day: isCurrent ? 'now' : weekdaysAbbr[ timeStamp.getDay() ],
        dayFull: isCurrent ? 'now' : weekdays[ timeStamp.getDay() ],
        date: dateDisplay,
        summary: data.getSummary(),
        cloudCover: data.getCloudCover(),
        minTemp: $scope.roundTemp( data.getMinTemperature() ),
        maxTemp: $scope.roundTemp( data.getMaxTemperature() ),
        temp: $scope.roundTemp( data.getTemperature() ),
        icon: data.getIcon(),
        recordLow: {
          date: randomLowDate,
          temp:Math.round( randomLowTemp )
        },
        recordHi: {
          date: randomHiDate,
          temp:Math.round( randomHiTemp )
        }
      };

    // console.log( data.getTime() + '; ' + dateDisplay + '; isCurrent = ' + isCurrent );
    return obj;
  }


  // call ForecastIO & pass in location
  $scope.createForecast = function( location ) {
    
    // Clear existing data + bg
    // TODO: animate background
    $scope.location = location;
    $scope.bgImg = '';

    var ForecastIO = require(['assets/js/forecast.io'], function(ForecastIO) {
        //This function is called when scripts/helper/util.js is loaded.
        //If util.js calls define(), then this function is not fired until
        //util's dependencies have loaded, and the util argument will hold
        //the module value for 'helper/util'.

      
      // use proxy to handle X domain error
      // API key located in proxy.php
      $scope.forecastIO = new ForecastIO({
        PROXY_SCRIPT: 'proxy.php'
      });

      $scope.data = [];

      // get current conditions
      $scope.forecastIO.getCurrentConditions( location, function(conditions) {

        for (var i = 0; i < conditions.length; i++) {
          $scope.data.unshift( $scope.parseForecastData( conditions[i], i ) );
        }
        $scope.returnForecast( $scope.data );

      });
/*
      // get conditions for next 5 days
      $scope.forecastIO.getForecastWeek( location, function(conditions) {

        // hard-code 5 days only
        for (var i = 1; i <= forecastRange; i++) {
          $scope.data.push( $scope.parseForecastData( conditions[i], i ) );
        }
        $scope.returnForecast( $scope.data );

      });
      */

      $scope.forecastIOConditions = new ForecastIOConditions({
        PROXY_SCRIPT: 'proxy.php'
      });
       $scope.forecastIOConditions.getMinTemperature( location, function(conditions) {

        // testing historical data
        console.log( 'conditions' ); 
        console.log( conditions ); 
        for (var i = 1; i <= forecastRange; i++) {
          $scope.data.push( $scope.parseForecastData( conditions[i], i ) );
        }
        $scope.returnForecast( $scope.data );

      });
      // TODO: call forecastIO Time Machine to log lows and highs from past ~50 years into DB
      // https://api.darksky.net/forecast/API_KEY/LAT,LONG,409467600?exclude=currently,flags,hourly
      // pass in discrete dates


    });

  }

  // calculate x pos of temperature along scale
  $scope.positionLabel = function(temp) {
    
    var limitMin = 20,  // left limit for min temp
      limitMax = 100;  // right limit for min temp
      if( temp < limitMin ) {
        temp = limitMin;
      } else if( temp > limitMax ) {
        temp = limitMax;
      }
    return ( 100 * ( temp - limitMin ) / ( limitMax - limitMin ) );
  }

  // load locations data & initialize ForecastIO w first entry
  $http.get('data/locations.json').success(function(data) {
    // populate dropdown
    $rootScope.locations = data;
    // get conditions using PROXY method
    $scope.createForecast( $rootScope.locations[0] );

  });
  
}]);

