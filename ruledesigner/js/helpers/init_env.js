/**
 * Create a clone function
 * 
 * @param object
 *            to clone
 * @return cloned object
 */
Function.prototype.clone = function(_obj_to_clone) {
	return JSON.parse(JSON.stringify(_obj_to_clone));
};



function Helpers() {};

/**
 * This function counts his call itself
 * 
 * @returns {Function}
 */
Helpers.counter = function() {
	return function() {
		var counter = 0;
		return function() {
			if (arguments[0] !== undefined) {
				counter = arguments[0];
			} else {
				counter++;
			}
			return counter;
		};
	}();
}
