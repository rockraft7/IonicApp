/**
 * Created by faizal on 1/18/16.
 */
angular.module('starter.services', [])
  .factory('googlemap', [], function() {
    return plugin;
  })

  .factory('currencyConverter', ['$http', function($http) {
    var YAHOO_FINANCE_URL_PATTERN =
      '//query.yahooapis.com/v1/public/yql?q=select * from '+
      'yahoo.finance.xchange where pair in ("PAIRS")&format=json&'+
      'env=store://datatables.org/alltableswithkeys&callback=JSON_CALLBACK';

    var currencies = ['EUR', 'USD', 'MYR'];
    var exchangeRate = {};

    var convert = function(amount, inCurr, outCurr) {
      return amount * (exchangeRate[outCurr] / exchangeRate[inCurr]);
    };

    var refresh = function() {
      var url = YAHOO_FINANCE_URL_PATTERN.replace('PAIRS', 'USD' + currencies.join('","USD'));
      console.log("Requesting to " + url);
      return $http.jsonp(url).then(function(response) {
        console.log("Response: " + angular.toJson(response));
        var newUsdToForeignRates = {};
        angular.forEach(response.data.query.results.rate, function(rate) {
          var currency = rate.id.substring(3,6);
          newUsdToForeignRates[currency] = window.parseFloat(rate.Rate);
        });
        exchangeRate = newUsdToForeignRates;
      });
    };

    refresh();

    return {
      currencies : currencies,
      convert : convert
    }
  }])
;
