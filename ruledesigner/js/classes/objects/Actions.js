/**
 * 
 */

function Actions() {

	var _self = this

	// Generate SYS_ID
	this.SYS_ID = cSYS_ID()

	var _model = new ActionsModel(_self)

	var _view = new ActionsView(_self)

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
		var obj
		// Forall action-objects
		var actions = _model.getActions() 
		for ( var key in actions) {	
			if((obj = actions[key].search(SYS_ID)) != null) // Set obj variable, because actorgroup can search on lower tier
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

function ActionsModel(controller) {

	var _self = this

	var _controller = controller

	var _actions = {}
	
	/**
	 * This function is use to reset the member variables in variable environment
	 * @return bool - true if successful
	 */
	this.unset = function() {
		var bool = true 
		for(var key in _actions){
			if(!_actions[key].unset())
				bool=false
			delete _actions[key]
		}
		
		if(bool && Object.keys(_actions).length == 0)
			return true

		return false
	}
	
	/**
	 * Adds an action
	 * 
	 * @param object
	 *            of tyoe actor or actorgroup
	 * @return boolean - true if success
	 */
	this.addAction = function(obj) {
		if ((obj instanceof Actor || obj instanceof Actorgroup)
				&& (!(obj.SYS_ID in _actions))) {
			_actions[obj.SYS_ID] = obj
			return true

		}
		return false
	}

	/**
	 * Returns array of actions. You should type checking of Actor or Actorgroup
	 * before use
	 * 
	 * @return object
	 */
	this.getActions = function() {
		return _actions
	}

	/**
	 * Returns action. You should type checking of Actor or Actorgroup before
	 * use
	 * 
	 * @return object
	 */
	this.getAction = function(SYS_ID) {
		return _actions[SYS_ID]
	}

	/**
	 * Removes an action
	 * 
	 * @param SYS_ID
	 *            or object of types Actor or Actorgroup
	 * @return boolean - true if success
	 */
	this.removeAction = function(SYS_ID) {
		if ((SYS_ID instanceof Actor || SYS_ID instanceof Actorgroup)
				&& SYS_ID.SYS_ID in _actions) {
			delete _actions[SYS_ID.SYS_ID]
			return true
		} else if (SYS_ID in _actions) {
			delete _actions[SYS_ID]
			return true
		}
		return false
	}

	/**
	 * Generates JSON-tree information
	 * 
	 * @return JSON-object
	 */
	this.toJSON = function() {
		var tmp = []

//		var keys = Object.keys(_actions)
//		for (var n = 0; n < keys.length; n++) {
//			tmp.push(_actions[keys[n]].toJSON())
//		}
		for (var key in _actions) {
			tmp.push(_actions[key].toJSON())
		}
		
		return tmp
	}
}

function ActionsView(controller) {

	var _self = this

	var _controller = controller

	/**
	 * Function to generate the HTML-Output return HTML-string
	 */
	this.display = function(model) {
		var _actions = model.getActions()
		
		var actions = document.createElement('ul')
		actions.className = 'obj_actions'
		
		// Add the linked actions (actors and actorgroups)
		var container = document.createElement('li')
		for(key in _actions){
			actions.innerHTML += _actions[key].display()
		}
		
		// Adds permanently an placeholder to the actions output	
		var placeholder = document.createElement('span')
		placeholder.className = ['placeholder', 'drop-action'].join(' ')
		placeholder.setAttribute('rel', _controller.SYS_ID)
		placeholder.innerHTML = 'Action/ActorsGroup-placeholder <br/> Click for creating a new actorgroup'	
		actions.innerHTML += placeholder.outerHTML
		
		return actions.outerHTML
	}

}