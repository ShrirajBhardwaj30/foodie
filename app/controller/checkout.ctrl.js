/**
* @author: Abhishek
* Controller for the Checkout Module
*/

(function() { 
	var ng = angular.module("checkout_module", ["sql_module","order_api_module"]);

	ng.controller("CheckoutController", function($rootScope, $location,  OrderAPI,$scope, SQLService) {
		$scope.customerName = localStorage.getItem("userName");
		$scope.customerAddress = localStorage.getItem("userAddress");
    $scope.customerCity = localStorage.getItem("userCity");
		$scope.cartConfirmed = false;                      //indicates whether the cart has been confirmed or not
    $scope.order = [];                                 //contains the cart as a list of items
    $scope.total = 0;                                  //total price of the cart
    $scope.rid = 0;                                    //restaurant id
    $scope.orderInvalid = false;                       //indicates whether the cart is invalid(total price is 0) or not
  
    
    //loads the corresponding restaurant screen using restaurant id when "Back to Menu" is clicked
    $scope.loadMenu = function(){
      if($scope.rid == 0){
      	$location.path("/restaurants");
      }
      else {
      	$location.path("/restaurant/"+$scope.rid);
      }
    }

    //loads the restaurants screen and clears the cart when "Clear Cart" is clicked
    $scope.deleteCart = function(){
      SQLService.deleteTable();
      $location.path("/restaurants");
    }

    //confirms the cart and prompts with menu for choosing type of payment when "Confirm Cart" is clicked
		$scope.confirmCart = function() {
      //checks if cart is valid or not
      if($scope.total == 0) {
        $scope.orderInvalid = true;
      }
      else {
        $scope.orderInvalid = false;
        $scope.cartConfirmed = true;
      
      //disables the buttons not required
      document.getElementById("menuButton").disabled = "disabled";
      document.getElementById("clearButton").disabled = "disabled";
      document.getElementById("confirmButton").disabled = "disabled";
      document.getElementById("changeButton").disabled = "disabled";
      $('input[type="number"]').attr("disabled","disabled");

		  }
    }

    //loads the cart from database of the WebSQL using the SQL service
    function fillOrder(tx,rs) {
      var len = rs.rows.length;
      for(var j=0;j<len;j++){
          var obj = Object();
          obj.name = rs.rows.item(j).NAME;
          obj.price = rs.rows.item(j).PRICE;
          obj.quantity = rs.rows.item(j).ITEM;
          $scope.order.push(obj);
          $scope.rid = rs.rows.item(j).RID;
          $scope.total = $scope.total + (obj.price*obj.quantity);
      }
      $scope.$apply();
    }

    (function(){
      SQLService.retrieveAll(fillOrder);
    })();
    
    //this function is called whenever there is a change in the quantity of any item in the cart
		$scope.calculateTotal = function(dish) {
      $scope.total = 0;
      var i = 0;
      SQLService.deleteRow(dish.name);
      SQLService.add(dish.name,dish.price,dish.quantity,$scope.rid);
      for(; i<$scope.order.length; i++) {
        var item = $scope.order[i];
        $scope.total += (item.quantity * item.price);
      }
    }

    //this function is called whenever an item is deleted from the cart
    $scope.removeItem = function($event,dish) {
      SQLService.deleteRow(dish.name);
      var i = ($event.target).parentNode.parentNode.rowIndex;
      document.getElementById("orderTable").deleteRow(i);
      i=i-1;
      $scope.total -= ($scope.order[i].quantity * $scope.order[i].price);          
      $scope.order.splice(i,1);
    }

    $scope.cod = false;
    $scope.pay = false;
    $scope.orderPlaced = false;
    
    //this function is called whenever there is a change in the type of payment
    $scope.changePaymentType = function() {
      $scope.cod = document.getElementById("radioCod").checked;
      $scope.pay = document.getElementById("radioPay").checked;
    }

    //places the order, deletesit from WebSQL and dumps it in the orders file hosted on the JSON server
    $scope.finishOrder = function() {
      $scope.orderPlaced = true;
      var resultObj = {
        "userName": $scope.customerName,
        "userCity": $scope.customerCity,
        "userAddress": $scope.customerAddress,
        "cart": $scope.order,
        "id": Date.now()
      };
      // resultObj.userName = $scope.customerName;
      // resultObj.userCity = $scope.customerCity;
      // resultObj.userAddress = $scope.customerAddress;
      // resultObj.cart = $scope.order;
      // resultObj.id = Date.now();

      console.log(resultObj);

      //Dump the final order in the json file hosted on server
      document.getElementById("codButton").disabled = "disabled";
      document.getElementById("payButton").disabled = "disabled";
      $('input[type="radio"]').attr("disabled","disabled");
      SQLService.deleteTable();
    }

});

})();
