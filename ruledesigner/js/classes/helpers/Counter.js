/**
 * This function creates a new counter object by call "new Counter()"
 * e.g. is defined by
 * # var myCounter = new Counter()
 * you must call
 * # myCounter()
 * to count.
 * 
 * @return enclosed function which return number
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