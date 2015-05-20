/**
 * Created by kojima37 on 5/1/15.
 */

var app = angular.module('mieru_cpi', ['nvd3','ui.bootstrap']);



app.controller('MainCtrl', function($scope, $http){

    URL = 'https://gentle-eyrie-4887.herokuapp.com'

    //item name to select
    //retrieve item names from Restful Flask via JSON
    //and put them into select options
    var select_box_url = URL+'/select.box.json';
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

    $scope.barMsg = ''; //initially do not show any msg because chart has not been rendered at this point.

    //year form
    $scope.years = [
        {id:"yr1",label:"Past 1 yr"}, {id:"yr3",label:"Past 3 yr"},
        {id:"yr5",label:"Past 5 yr"}, {id:"yr10",label:"Past 10 yr"},
        {id:"all",label:"All"}
    ];

    $scope.selectedYr = null;

    $scope.onChangeItem = function(){
        console.log("Change detected in Item selector");
        $scope.render_lineChart();
    }

    $scope.onChangeYr = function(){
        console.log("Change detected in Year selector");
        $scope.render_lineChart();
    }

    $scope.render_barChart = function(){
        console.log("Render bar chart now");
        $scope.barMsg = '安倍政権誕生(2012/12)から現在(2015/04)までの品目毎指数変化率';

        var url = URL+"/view_monthly_change?month1=201504&month2=201211";
        console.log('retrieving json from '+url);

        var toolTipContentFunc = function(){
            return function (key, x, y, e, d) {
                //console.log(key);
                //console.log(x);
                //console.log(y);
                return x+'|'+y;
            }
        };

        var callbacks = function(){
            /* i want to do this
             .nv-label text{
             font: 20px Verdana;
             }
             */
            return function(){
                d3.selectAll('.nvd3.nv-axis text').style('font-size','10px');
            }
        };

        $http.get(url)
            .success(function(data,status,headers,config){
                $scope.data_barChart = data['ResultSet'];

            })
            .error(function(data,status,headers,config){
                console.log(error);
            });
        $scope.options_barChart = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                width: 9000,
                margin: {
                    top: 5,
                    right: 20,
                    bottom: 100,
                    left: 50
                },
                x: function(d,i){
                    return d.label;
                    //return i;
                },

                xAxis:{
                    rotateLabels:90 //rotelabels 90 degree
                },

                y: function(d){return Number(d.value);},

                //showYAxis: false,
                /*
                showValues: true,

                valueFormat: function(d){
                    return d3.format(',.2f')(d);
                },*/
                discretebar: {  //this is a way to dispatch function on certain action. there are more element such as
                    //  elementDblClick, elementMouseover, and etc.
                    dispatch: {
                        elementClick: function (e) {
                            console.log("u have just clicked the bar");
                        }
                    }
                },
                tooltipContent: toolTipContentFunc(),
                callback: callbacks()
            }
        }

    }

    //function to call when submit button is clicked.
    $scope.render_lineChart = function(){

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
        var url = URL+"/data.json?itemName="
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
        $scope.options_lineChart = {
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