/**
* @author : sbhardwa@adobe.com
* v1.0 
* Directive to interact with menuView template.
*/
(function(){
	angular.module("list_menu_directive",[]);
	angular.module("list_menu_directive").directive("menuView",function(){
		return {
			restrict: 'E',
			templateUrl: 'app/template/menuView.html',
			scope: {
				items: '=',
				incr: '&',
				decr: '&',
				pricePlaceHolder: '@'
			}
		};
	});
})();