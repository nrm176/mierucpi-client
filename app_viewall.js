/**
 * Created by kojima37 on 5/3/15.
 */

var app = angular.module('view_all', ['nvd3']);


app.controller('ViewAllCtrl', function($scope,$http){
    //pagination
    URL = 'https://gentle-eyrie-4887.herokuapp.com'
    var DEFAULT_NUM_OF_ITEM_PER_PAGE = 30;
    var maxItemNum = 700;
    $scope.nv_length = [];
    for(var i=1; i<Math.ceil(maxItemNum/DEFAULT_NUM_OF_ITEM_PER_PAGE); i++){
        $scope.nv_length.push(i);
    }

    //when page button is clicked
    var itemPerPage = DEFAULT_NUM_OF_ITEM_PER_PAGE;
    $scope.onClick = function(pageNum, itemPerPage){
        var itemPerPage = DEFAULT_NUM_OF_ITEM_PER_PAGE;
        console.log(pageNum);
        console.log(itemPerPage);
        $scope.doRender(pageNum, itemPerPage);
    }

    //what to do when the page is first loaded by browser
    $scope.onInit = function(){
        $scope.doRender(1, itemPerPage);
    };

    //rendering part
    $scope.doRender = function(pageNum, itemPerPage){
        var url = URL+'/view_items?pageNo='+pageNum+'&itemPerPage='+itemPerPage;
        $http.get(url)
            .success(function(data,status,headers,config){
                $scope.dataSet = data['ResultSet'];
                console.log($scope.dataSet);
            })
            .error(function(data,status,headers,config){
                console.log(error);
            });

        var toolTipContentFunc = function(){
            return function (key, x, y, e) {
                return '<h3>' + key + '</h3>';
            }
        };

        //nvD3 representation
        $scope.options = {
            chart: {
                type:'lineChart',
                height:250,
                width:500,
                margin:{ top:20, right:20, bottom:60, left:65 },
                x:function(d){return d[0];},
                y:function(d){return Number(d[1]);},
                color:d3.scale.category10().range(),
                //useInteractiveGuideline:true,

                //Note that because the position of tooltip is messed up, nvd3.js used here is the forked version.
                //useInteractiveGuideLine is disabled to deal with that issue.

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
                },
                tooltips:{
                    //gravity:'s',
                    enabled:true
                }


            }
        };

    }


});