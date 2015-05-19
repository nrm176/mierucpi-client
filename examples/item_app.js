/**
 * Created by kojima37 on 5/1/15.
 */
var app = angular.module('item_app', []);

app.controller('ItemSelector', function($scope){
    $scope.items = ['みかん', 'ばなな', 'キウイ'];

    $scope.onInit = function(){
        $scope.selectedItem = $scope.items[1];
    }
    $scope.onChange = function(){
        console.log($scope.selectedItem);
    }
});

app.factory('Data', function(){
    //items = ['茄子', 'キャベツ', '白菜'];
    //return items;
    return {selectedItem:'null'}
})

//app.controller('SelectItem', function($scope, Data){
//    $scope.Data = Data;
//    $scope.items = [
//        {id:1,item:'茄子'},
//        {id:2,item:'キャベツ'},
//        {id:3, item:'白菜'}];
//
//    $scope.onInit=function(){
//        Data.selectedItem = $scope.items[1];
//    }
//
//});
//
//app.controller('ShowItem', function($scope, Data){
//    $scope.Data = Data;
//});
//TODO: change the element name of item.item to item.name
app.controller('SelectItem', function($scope, $http, Data){
    var select_box_url = 'http://127.0.0.1:5000/select.box.json';
    $scope.Data = Data;
    //$scope.items = ['茄子', 'キャベツ', '白菜'];

    $scope.onInit=function(){
        $http.get(select_box_url)
            .success(function(data,status,headers,config){
                $scope.items = data['ResultSet'];

            })
            .error(function(data,status,headers,config){
                console.log('error');
                console.log(error);
            })


        Data.selectedItem = null;
    }

});

app.controller('ShowItem', function($scope, Data){
    $scope.Data = Data;


});
