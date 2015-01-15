var Actors = function(){

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()
	
	var _model = new ActorsModel(_self)
	
	var _view = new ActorsView(_self)
	
	/**
	 * Function to generate the HTML-Output
	 * return HTML-string
	 */
	this.display = function() {
		return _view.display(_model)
	}
	
	// Bind model functions
//	var keys = Object.keys(_model)
//	for (var n = 0; n < keys.length; n++) {
//		eval('_self.' + keys[n] + ' = _model.' + keys[n])
//	}
	for (var key in _model){
		eval('_self.' + key + ' = _model.' + key)
	}
	
}

var ActorsModel = function(controller){

	var _self = this
	
	var _controller = controller
	
	var _actors = []

	/**
	 * Add actor to helper group
	 * @param obj
		 * @return boolean - true if success
	 */
	this.addActor = function(obj){
		if( obj instanceof Actor){
			_actors.push(obj)
			return true
		}
		return false
	}
	
	/**
	 * Remove actor from helper group
	 * @param actor object or ID
		 * @return boolean - true if successf
	 */
	this.removeActor = function(SYS_ID){
		for(var n = 0; n < _actors.length; n++) {
			if( _actors[n].SYS_ID == SYS_ID || (SYS_ID instanceof Actor && SYS_ID === _actors[n]) ){
				_actors.splice(n, 1)
				return true
			}
		}
		return false
	}
	
	/**
	 * Return actors
	 * @return _actors
	 */
	this.getActors = function(){
		return _actors
	}
	
	/**
	 * Generates JSON-tree information
	 * @return JSON-object
	 */
	this.toJSON = function (){
		var tmp = []
		for(var n = 0; n < _actors.length; n++){
			tmp.push(_actors[n].toJSON())
		}
		return tmp
	}

}

var ActorsView = function(controller){
	
	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output
	 * return HTML-string
	 */
	this.display = function(model){
		return '' //TODO:
	}
	
}