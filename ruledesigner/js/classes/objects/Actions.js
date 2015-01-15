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
	 * Function to generate the HTML-Output return HTML-string
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

function ActionsModel(controller) {

	var _self = this

	var _controller = controller

	var _actions = {}

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
		var actions = model.getActions()
		if (actions.length > 0) {
			var html = '<ul class="obj_actions">'
				
//			var keys = Object.keys(_actions)
//			for (n = 0; n < actions.length; n++) {
//				html += '<li>' + actions[n].display() + '</li>'
//			}
			
			for(key in actions){
				html += '<li>' + actions[key].display() + '</li>'
			}
			html += '</ul>'
			return html
			
		} else {
			// TODO: Platzhalter
			return '<span class="placeholder">Action/ActorsGroup-placeholder</span>'
		}
	}

}