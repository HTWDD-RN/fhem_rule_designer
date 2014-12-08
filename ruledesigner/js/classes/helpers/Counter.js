/**
 * This function creates a new counter object by call "new Counter()"
 * e.g. is defined by
 * # var myCounter = new Counter()
 * you must call
 * # myCounter()
 * to count.
 * 
 * @return enclosed object
 */
function Counter () {

	return function(){
		var _instance = null

		var _count = 0

		return function() {
			if (_instance == null)
				_instance = this
			return ++_count
		}
	}()
	
}

/**
 * TODO: [LOW] remove - The first publication
 */
//counter : function() {
//
//	return function() {
//		var counter = 0;
//		return function() {
//			if (arguments[0] !== undefined) {
//				counter = arguments[0];
//			} else {
//				counter++;
//			}
//			return counter;
//		}
//	}
//},