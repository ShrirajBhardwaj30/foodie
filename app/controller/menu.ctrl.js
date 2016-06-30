/**
*	@author : sbhardwa@adobe.com
*	v1.0
*	restaurantMenuController is implemented in this js.
*/


(function(){

		angular.module("restaurant_menu_controller_module",["sql_module","restaurant_api_module"]);
		angular.module("restaurant_menu_controller_module").controller("restaurantMenuController",function($scope,SQLService,RestaurantAPI,$routeParams){

			     //scope variables for storing the cart.
				 $scope.totalPrice = 0;
				 $scope.buyingItems = [];

				 // scope variables for user details
				 $scope.userName = localStorage.getItem("userName");
				 $scope.userAddress = localStorage.getItem("userAddress");
				 $scope.userCity = localStorage.getItem("userCity");

				 //to fetch the restaurant details and show it on the page.
				 RestaurantAPI.getRestaurant($routeParams.res_id).then(function(result){
				 	$scope.logoRestaurant = result.thumb;
				 	$scope.nameRestaurant = result.name;
				 	$scope.ratingRestaurant = result.user_rating.aggregate_rating;
				 	$scope.votes = result.user_rating.votes;
				 	$scope.cuisines = result.cuisines;
				 },function(result){
				 	console.log("No such Restaurant");
				 });

				 //clicking event for increasing the item Quantity.
				 $scope.increase = function(dish){
				 	dish.quantity = dish.quantity+1;
				 	var flag = true;
				 	$scope.totalPrice = $scope.totalPrice+dish.price;
				 	for (i=0;i<$scope.buyingItems.length;i++) {
				 		if($scope.buyingItems[i].name == dish.name){
				 			//SQLService for caching inside browser.
				 			SQLService.deleteRow(dish.name);
				 			$scope.buyingItems[i].computePrice = dish.price * dish.quantity;
				 			flag = false;
				 		}
				 	}
				 	if(flag)
				 	{
				 		dish.computePrice = dish.price;
				 		$scope.buyingItems.push(dish);
				 	}
				 	//browser caching.
				 	SQLService.add(dish.name,dish.price,dish.quantity,$routeParams.res_id);
				 };

				 //clicking event for decreasing the item Quantity.
				 $scope.decrease = function(dish){
				 	if(dish.quantity!=0){
				 		dish.quantity = dish.quantity-1;
				 		SQLService.deleteRow(dish.name);
				 		$scope.totalPrice = $scope.totalPrice - dish.price;

				 	}
			 	 	for(i=0;i<$scope.buyingItems.length;i++){
				 		if($scope.buyingItems[i].name == dish.name){
				 			if(dish.quantity==0)
				 				$scope.buyingItems.splice(i,1);
				 			else 
				 				{
				 					$scope.buyingItems[i].computePrice = dish.price * dish.quantity;
				 					SQLService.add(dish.name,dish.price,dish.quantity,$routeParams.res_id);
				 				}
				 		}
				 	}
				 };

				 //checkout clicking event.
				 $scope.checkout = function(){
				 	console.log("coming");
				 };

				 //to fetch the menu of restaurant.
				 RestaurantAPI.getMenu($routeParams.res_id).then(function(result){
				 	$scope.Dishes = result;
				 	for(i=0;i<$scope.Dishes.length;i++){
				 		$scope.Dishes[i].quantity = 0;
				 	}
				 	loadPreviousData();
				 },function(result){
				 	console.log("No such Restaurant");
				 });

				 //loading old cart of same restaurant.
				 //landing on same restaurant again and again will not result in removing your cart.
				 function loadPreviousData(){
				 	SQLService.init();
				 	function store(tx,rs){
				 		var len = rs.rows.length;
						for(var j=0;j<len;j++){
							if(rs.rows.item(j).RID == $routeParams.res_id)
							{
								for(var i=0;i<$scope.Dishes.length;i++){
									if($scope.Dishes[i].name == rs.rows.item(j).NAME){
										$scope.Dishes[i].quantity = rs.rows.item(j).ITEM;
										$scope.Dishes[i].computePrice = $scope.Dishes[i].quantity * $scope.Dishes[i].price;
										$scope.buyingItems.push($scope.Dishes[i]);
										$scope.totalPrice = $scope.totalPrice + $scope.Dishes[i].computePrice;
									}
								}
							}
							else {
								SQLService.deleteTable();
								SQLService.init();
							}
						}
						$scope.$apply();
					}
				 	SQLService.retrieveAll(store);
				 };
			});
})();