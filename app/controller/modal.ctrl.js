/**
* Description: This controller takes care of the modal dialogue functionalities. Such as, 
*              1. creating user detail variables inside this scope that will be used by the view
*              2. Saving the user details into local storage
* @author: Atul Rajmane
*/
(function() {
	var ng = angular.module("modal_module", ['ngRoute']);

	ng.controller("ModalController", ['$scope', '$location', function($scope, $location) {
		$scope.userName = (localStorage.getItem("userName") != null) ? localStorage.getItem("userName") : "";
		$scope.userAddress = (localStorage.getItem("userAddress") != null) ? localStorage.getItem("userAddress") : "";
		$scope.userCity = (localStorage.getItem("userCity") != null) ? localStorage.getItem("userCity") : "";

		$scope.saveAddressDetails = function() {
			localStorage.setItem("userName", document.getElementById("user-name").value);
			localStorage.setItem("userAddress", document.getElementById("user-address").value);
			localStorage.setItem("userCity", document.getElementById("user-city").value);

			$location.url("/restaurants");
		};
	}]);

})();