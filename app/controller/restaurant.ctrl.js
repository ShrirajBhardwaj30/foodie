/**
* Description: Controllers related to restaurant pages
*/
(function() {
	var ng = angular.module("restaurant_controller_module", ["restaurant_api_module"]);

	/**
	 * Description: This controller pertains to restaurant listing, filtering the listing
	 * @author: Atul Rajmane
	 */
	ng.controller("RestaurantListController", function($scope, RestaurantAPI) {
		$scope.restaurants = originalRestaurants = [];
		$scope.cuisines = ['South Indian', 'North Indian', 'Chinese', 'Thai', 'Italian', 'American', 'Continental', 'Fast Food'];
		$scope.selectedCuisines = [];
		$scope.userName = localStorage.getItem("userName");
		$scope.userAddress = localStorage.getItem("userAddress");
		$scope.userCity = localStorage.getItem("userCity");
		$scope.numRestaurantsFound = 0;
		$scope.sortType = 'name';
		$scope.sortReverse = false;

		// fetching the list of restaurants in the user city
		(function() {
			RestaurantAPI.getRestaurants().then(function(result) {
				result.data.best_rated_restaurant.forEach(function(resto) {
					var obj = {
						"id": resto.restaurant.id,
						"name": resto.restaurant.name,
						"address": resto.restaurant.location.address,
						"rating": resto.restaurant.user_rating.aggregate_rating,
						"cuisines": resto.restaurant.cuisines
					};
					$scope.restaurants.push(obj);
				});
				$scope.numRestaurantsFound = $scope.restaurants.length;
				originalRestaurants = $scope.restaurants;
			});
		})();

		// Filter functionality
		$scope.filter = function(cuisine) {
			var idx = $scope.selectedCuisines.indexOf(cuisine);
			var result = [];
			if (idx > -1) {
				$scope.selectedCuisines.splice(idx, 1);
			}
			else {
				$scope.selectedCuisines.push(cuisine);
			}

			if ($scope.selectedCuisines.length == 0) {
				$scope.restaurants = originalRestaurants;
				$scope.numRestaurantsFound = $scope.restaurants.length;
			}
			else {
				$scope.selectedCuisines.forEach(function(csn) {
					originalRestaurants.forEach(function(resto) {
						if (resto.cuisines.indexOf(csn) > -1) {
							if (result.indexOf(resto) < 0) {
								result.push(resto);
							}
						}
					});
				});
				$scope.restaurants = result;
				$scope.numRestaurantsFound = $scope.restaurants.length;
			}
		}
	});
})();