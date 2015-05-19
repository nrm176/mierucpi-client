/**
 * Created by kojima37 on 5/6/15.
 */

var app=angular.module('typeAhead',['ui.bootstrap']);

app.controller('TypeAheadCtrl', function($scope, $http){
    $scope.selected = undefined;
    var select_box_url = 'http://127.0.0.1:5000/select.box.json';
    $http.get(select_box_url)
        .success(function(data,status,headers,config){
            $scope.items = data['ResultSet'];
            //console.log($scope.items)

        })
        .error(function(data,status,headers,config){
            console.log('error');
            console.log(error);
        })
})