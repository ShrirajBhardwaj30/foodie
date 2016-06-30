/**
* Description: Provides restaurant related APIs
*/
(function() {
	angular.module("restaurant_api_module", []);

	angular.module("restaurant_api_module").service("RestaurantAPI", function($http, $q) {

		/**
		* Description: Following method fetches a list of restaurants present in the user city.
		* @author: Atul Rajmane
		*/
		this.getRestaurants = function() {
			var deferred = $q.defer();
			$http.get("http://localhost:9000/location/" + localStorage.getItem("userCity").toLowerCase()).then(
				function(data) {
					deferred.resolve(data);
				},
				function(data) {
					deferred.reject(data);
				}
			);

			return deferred.promise;
		}

		/**
		* for the following methods
		* @author : sbhardwa@adobe.com
		*/

		// modularly handling data of json. 
		 function getMenu(result){
		 	var dishes = [];
		 	for(i=0;i<result.data.daily_menus.length;i++){
		 		for(j=0;j<result.data.daily_menus[i].daily_menu['dishes'].length;j++){
		 			dishes.push(result.data.daily_menus[i].daily_menu['dishes'][j].dish);
		 		}
		 	}
		 	return dishes;
		 }

		 //modularly handling data of json.
		 function getRestaurantDetails(result,res_id){
		 	for(i=0;i<result.data.length;i++){
		 		for(j=0;j<result.data[i].best_rated_restaurant.length;j++){
		 			if(res_id == result.data[i].best_rated_restaurant[j].restaurant.id){
		 				return result.data[i].best_rated_restaurant[j].restaurant;
		 			}
		 		}
		 	}
		 	return null;
		 }

		//will return the menu object of restaurant
		this.getMenu = function(res_id){
			deferred = $q.defer();
			$http.get("http://localhost:9000/menu/"+res_id).then(
				function(data){
					deferred.resolve(getMenu(data))
				},
				function(data){
					deferred.reject(data)
				}
			);
			return (deferred.promise);
		}

		//will return the array of objects of all cities
		this.getRestaurant = function(res_id){
			var deferred = $q.defer();
			$http.get("http://localhost:9000/location").then(
				function(data){
					deferred.resolve(getRestaurantDetails(data,res_id))
				},
				function(data){
					deferred.reject(data)
				}
			);
			return deferred.promise;
		}
		
		
	});
})();