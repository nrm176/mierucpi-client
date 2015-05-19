/**
 * Created by kojima37 on 5/1/15.
 */


var app = angular.module('form_app', []);

app.controller('typeCtrl', function($scope,$http){
        $scope.years = [
            {id:"yr1",label:"Past 1 yr"},
            {id:"yr3",label:"Past 3 yr"},
            {id:"yr5",label:"Past 5 yr"},
            {id:"yr10",label:"Past 10 yr"},
            {id:"all",label:"All"}
        ];
        $scope.selectedYr = null;

        $scope.submit = function(){
            console.log("Showing yearrrrr");
            console.log($scope.selectedYr);

        }
    }

)