/**
 * Created by kojima37 on 5/1/15.
 */

var app = angular.module('plunker', ['nvd3','ui.bootstrap']);



app.controller('MainCtrl', function($scope, $http){

    //item name to select
    //retrieve item names from Restful Flask via JSON
    //and put them into select options
    var select_box_url = 'http://127.0.0.1:5000/select.box.json';
    $scope.onInit=function() {
        $http.get(select_box_url)
            .success(function (data, status, headers, config) {
                $scope.items = data['ResultSet'];

            })
            .error(function (data, status, headers, config) {
                console.log('error');
                console.log(error);
            })
    };

    //year form
    $scope.years = [
        {id:"yr1",label:"Past 1 yr"}, {id:"yr3",label:"Past 3 yr"},
        {id:"yr5",label:"Past 5 yr"}, {id:"yr10",label:"Past 10 yr"},
        {id:"all",label:"All"}
    ];

    $scope.selectedYr = null;

    $scope.onChangeItem = function(){
        console.log("Change detected in Item selector");
        $scope.render();
    }

    $scope.onChangeYr = function(){
        console.log("Change detected in Year selector");
        $scope.render();
    }

    //function to call when submit button is clicked.
    $scope.render = function(){

        if (!$scope.selectedYr){
            console.log("Year range not yet selected.");
            return;
        }

        if (!$scope.selectedItem){
            console.log("Item not yet selected.");
            return;
        }
        console.log("Year Selected:" + $scope.selectedYr.id);
        console.log("Item Name Selected:" + $scope.selectedItem.id);
        var yr = $scope.selectedYr;
        var url = "http://127.0.0.1:5000/data.json?itemName="
            + $scope.selectedItem.name + "&itemId="
            + $scope.selectedItem.id + "&range="+yr.id;
        console.log(url);

        //retrieve json CPI data thru Restful Flask
        $http.get(url)
            .success(function(data,status,headers,config){
                $scope.data = data['ResultSet'];
            })
            .error(function(data,status,headers,config){
                console.log(error);
            });

        //nvD3 representation
        $scope.options = {
            chart: {
                type:'lineChart',
                height:250,
                width:450,
                margin:{ top:20, right:20, bottom:60, left:65 },
                x:function(d){return d[0];},
                y:function(d){return Number(d[1]);},
                color:d3.scale.category10().range(),
                useInteractiveGuideline:true,

                xAxis:{
                    tickFormat:function(d) {
                        //console.log(new Date(d))
                        return d3.time.format('%y/%m')(new Date(d))
                    },
                    staggerLabels:true
                },

                yAxis:{
                    tickFormat:function(d){
                        return d3.format(',2f')(d)
                    }
                }
            }
        };

        //$scope.selectedItem = ''

    }
});