/**
* Description: Contains routing configuration
* @author: Atul Rajmane
*/

(function () {
	angular.module("main_module", [
			"ngRoute", "modal_module", "restaurant_controller_module", "checkout_module", 
			"ngCookies", "list_menu_directive", "restaurant_menu_controller_module"
	]);

	angular.module("main_module").config(function($routeProvider, $locationProvider) {
		$routeProvider
		.when("/", {
			templateUrl: 'app/page/user_details.html',
			resolve: {
				/**
				 * check function does two things:
				 * 1. When it's the revisiting user AND we don't intend to bypass the redirection(i.e. bpr is absent in query parameters)
				 *    send him to the restaurants listing page.
				 *    We say user is a revisitor when all the user details - name, address, city - are set in the localStorage
				 * 2. Doesn't redirect user to the restaurant listing page when there is a query parameter "bpr=1".
				 *    Here bpr stands for bypass the redirection
				 */
				"check": function($location, $route) {
					var revisitor = localStorage.getItem("userName") != null && localStorage.getItem("userName") != "" &&
							localStorage.getItem("userAddress") != null && localStorage.getItem("userAddress") != "" &&
							localStorage.getItem("userCity") != null && localStorage.getItem("userCity") != ""
						? true
						: false;
	
					if (revisitor && $location.search().bpr != "1") {
						$location.path("/restaurants");
					}
					else if ($location.search().bpr == "1") {
						showModalDialogue();
					}
				}
			}
		})
		.when("/restaurants", {
			templateUrl: 'app/page/restaurants.html'
		})
		.when("/restaurant/:res_id", {
			templateUrl: 'app/page/restaurant.html'
		})
		.when("/checkout", {
			templateUrl: 'app/page/checkout.html'
		})
		.otherwise({
			templateUrl: 'app/page/user_details.html'
		});

	});
})();