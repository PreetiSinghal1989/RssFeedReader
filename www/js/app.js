var app = angular.module('ionicApp', ['ionic', 'ngSanitize'])

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

app.controller('FeedController', function($http, $scope) {

    $scope.platform = ionic.Platform;

    $scope.init = function() {

        $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fdailyutahchronicle.com%2Fcategory%2Fsports%2Ffeed%2F'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", {
                transformResponse: function(cnv) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(cnv);
                    return aftCnv.query.results.body.rss.channel;
                }
            })
            .success(function(data) {
                $scope.entries = data.item;
            })
            .error(function(data) {
                console.log("ERROR: " + data);
            });

        $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fdailyutahchronicle.com%2Fcategory%2Fnews%2Ffeed%2F'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", {
                transformResponse: function(cnv) {
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(cnv);
                    return aftCnv.query.results.body.rss.channel;
                }
            })
            .success(function(data) {
                $scope.news = data.item;
            })
            .error(function(data) {
                console.log("ERROR: " + data);
            });
    }

    $scope.toggleRss = function(entry) {
        if ($scope.isEntryShown(entry)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = entry;
        }
    };

    $scope.isEntryShown = function(entry) {
        return $scope.shownGroup === entry;
    };

    $scope.refreshFeed = function() {
        $scope.init();
        $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.getSubstring = function(entry) {
        return entry.toString().substring(0, entry.toString().indexOf('http') - 1);
    }
});