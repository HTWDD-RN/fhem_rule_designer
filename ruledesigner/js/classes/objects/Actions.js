/**
 * 
 */

function Actions() {

	var _self = this

	var _id = cSYS_ID()
	
	/**
	 * Return ID
	 * @return ID 
	 */
	this.getID = function(){
		return _id
	}
	
	var _model = new ActionsModel(_self)

	var _view = new ActionsView(_self)

	this.display = function() {
		return _view.display(_model)
	}

	// Bind model functions
	var keys = Object.keys(_model)
	for (var n = 0; n < keys.length; n++) {
		eval('_self.' + keys[n] + ' = _model.' + keys[n])
	}

}

function ActionsModel(controller) {

	var _self = this

	var _controller = controller
	
	var Actions = []

	this.addAction = function(obj) {
		if (obj instanceof Actor || obj instanceof Actorsgroup) {
			Actions.push(obj)
			return true
		}
		return false
	}

	this.getActions = function() {
		return Actions
	}

	this.removeAction = function(SYS_ID) {
		for (var n = 0; n < _actors.length; n++) {
			if (_action[n].getID() == SYS_ID
					|| ((SYS_ID instanceof Actorsgroup || SYS_ID instanceof Actor) && SYS_ID === _actions[n])) {
				_actions.splice(n, 1)
				return true
			}
		}
		return false
	}

	this.toJSON = function() {
		var tmp = []

		for (n = 0; n < Actions.length; n++)
			tmp.push(Actions[n].toJSON())

		return tmp
	}
}

function ActionsView(controller) {

	var _self = this

	var _controller = controller

	this.display = function(model) {

		var actions = model.getActions()

		if (actions.length > 0) {
			var html = '<ul class="obj_actions">'
			for (n = 0; n < actions.length; n++) {
				html += '<li>' + actions[n].display() + '</li>'
			}
			html += '</ul>'
			return html
		} else {
			// TODO: Platzhalter
			return '<span class="placeholder">Action/ActorsGroup-placeholder</span>'
		}
	}

}