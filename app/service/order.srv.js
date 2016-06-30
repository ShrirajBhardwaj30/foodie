/**
* Description: Provides order related APIs
*/
(function() {
	angular.module("order_api_module", []);

	angular.module("order_api_module").service("OrderAPI", function($http, $q) {

		/**
		* Description: Put the order details in a JSON file
		* @author: Atul Rajmane
		*/
		this.saveOrder = function(ord) {
			console.log(ord);
			var cfg = {
				'Content-Type': 'application/json'
			};
			$http.post("http://localhost:9000/order", ord, cfg).then(
				function() {console.log("orderPlaced")},
				function() {console.log("orderCouldn't")}
			);
		}

	});
})();