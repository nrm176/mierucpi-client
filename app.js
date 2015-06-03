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

    $scope.month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    $scope.year = ['2015','2014','2013','2012'];
    $scope.topbottom = [5,10,20,50,100];

    $scope.selectedYr = null;

    $scope.onChangeItem = function(){
        console.log("Change detected in Item selector");
        $scope.render_lineChart();
    }

    $scope.onChangeYr = function(){
        console.log("Change detected in Year selector");
        $scope.render_lineChart();
    }

    $scope.render_horizontalBarChart = function(){
        console.log("Rendering horizontal bar chart");

        //asynchronous http call
        $http({
            url: URL+"/view_monthly_change?month1=201504&month2=201211",
            method: 'GET'
            })
            .success(function(data,status,headers,config){
                $scope.data_horizontalBarChart = data['ResultSet'].monthlyChange;
            })
            .error(function(data,status,headers,config){
                console.log(error);
            });

        $scope.options_horizontalBarChart = {
            chart: {
                type: 'multiBarHorizontalChart',
                width: 750,
                height:9000,
                margin: {
                    top: 30,
                    right: 40,
                    bottom: 50,
                    left: 200
                },
                color: d3.scale.category10().range(),
                x: function (d, i) {
                    return d.label;
                },
                y: function (d) {
                    return Number(d.value);
                },
                showControls:false,
                showValues:true,
                useInteractiveGuideline:true

            }
        }

    };

    $scope.render_barChart = function(from_year,from_month,to_year,to_month,n){
        var fromdt = from_year+from_month
        var todt = to_year+to_month
        console.log(fromdt);
        console.log(todt);
        console.log("Render bar chart now");
        $scope.barMsg =  fromdt+ 'から'+ todt + 'までの品目毎指数変化率';

        var url = URL+"/view_monthly_change?month1="+fromdt+"&month2="+todt+"&n="+n;
        console.log('retrieving json from '+url);

        var toolTipContentFunc = function(){
            return function (key, x, y, e, d) {
                return x+'|'+y;
            }
        };

        var callbacks = function(){
            /* i want to do this
             .nvd3.nv-axis text{
             font: 10px Verdana;
             }
             */
            return function(){
                d3.selectAll('.nvd3.nv-axis text').style('font-size','10px');
            }
        };

        //it is better to change bar chart width dynamically. set the width of one bar to 10px
        //so that the width is 10*num of items
        var getWidth = function(num){
            return 10 * num;
        }
        //$scope.lenBarChartData = 0;
        //LENONEBAR = 12;

        //rewrite asynchronous http call
        $http({
            url: url,
            method: 'GET'
            })
            .success(function(data,status,headers,config){
                $scope.data_barChart = data['ResultSet'];
                //console.log($scope.data_barChart);
                console.log('length of array:' + $scope.data_barChart[0].values.length);

                var num = $scope.data_barChart[0].values.length;
                $scope.options_barChart = {
                    chart: {
                        type: 'discreteBarChart',
                        height: 450,
                        width: getWidth(num),
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
                            //  elementDblClick, elementMouseover, and etc. see the below
                            // , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'stateChange', 'changeState', 'renderEnd',
                            // 'chartClick', 'elementClick', 'elementDblClick', 'elementMouseover', 'elementMouseout')

                            dispatch: {
                                elementClick: function (e) {
                                    console.log("u have just clicked the bar");
                                    //want to show what is clicked
                                    console.log(e.point.id + ':'+ e.point.label);
                                    var id = e.point.id;
                                    var labelTxt = e.point.label;
                                    $scope.selectedItem = {id:id,name:labelTxt};

                                }
                            }
                        },
                        tooltipContent: toolTipContentFunc(),
                        callback: callbacks()
                    }
                }

            })
            .error(function(data,status,headers,config){
                console.log(error);
            });


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