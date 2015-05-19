/**
 * Created by kojima37 on 5/2/15.
 */

var app = angular.module('table_app', []);

var nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
var numsList = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,16]
]
app.controller('TableCtrl', function($scope){
    var array = [];
    for (var i=0; i<nums.length; i++){
        if (i%4==0)array.push([]);
        array[array.length-1].push(nums[i]);
    }
    console.log(array);
    return $scope.array = array;
});

app.controller('Table2Ctrl', function($scope){
    return $scope.numsList = numsList;

});