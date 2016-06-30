module.exports = function() {
	var menu = require("./restaurantMenu.json");
	var location = require("./locationRestaurant.json");
	return {
		location,menu
	}
}