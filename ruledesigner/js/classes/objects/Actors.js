var Actors = function(){

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()
	
	var _model = new ActorsModel(_self)
	
	var _view = new ActorsView(_self)
		
	/**
	 * This function is looking for an device with SYS_ID
	 * @param SYS_ID - internal id
	 * @return object if found, else null
	 */
	this.search = function(SYS_ID){
		// Proof this object
		if (this.SYS_ID == SYS_ID) {
			return _self
		}
		
		// Forall sub-objects
		var obj
		var actors = _model.getActors()
		for ( var n =0; n<actors.length ; n++ ) {	
			if(( obj = actors[n].search(SYS_ID)) != null)
				return obj
		}
		return null
	}
	
	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(_events) {
		return _view.display(_model, _events)
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
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		while (_actors.length > 0){
			delete _actors.splice(0,1)
		}
		if (_actors.length == 0)
			return true

		return false
	}

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
		var result = ''
		var actors = model.getActors()
		for(var n=0; n<actors.length; n++){
			var actor = document.createElement('li')
			actor.innerHTML = actors[n].display()
			result += actor.outerHTML
		}		
		return result
	}
	
}