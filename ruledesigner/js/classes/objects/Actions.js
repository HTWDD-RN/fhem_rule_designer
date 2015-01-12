/**
 * 
 */

function Actions (){
	
	var _self = this
	
	var _model = new ActionsModel(_self)
	
	var _view = new ActionsView(_self)
		
	this.display = function(){
		return _view.display(_model)
	}
	
	this.toJSON = function(){
		return _model.toJSON()
	}
	
}


function ActionsModel(controller){
	
	var _self = this
	
	var _controller = controller
	
	var Actions = []
	
	this.addAction = function(obj){
		if(obj instanceof Action || obj instanceof Actorsgroup)
			Actions.push(obj)
		else
			throw 'Unexpected type'
	}
	
	this.getActions = function(){
		return Actions
	}
	
	this.removeAction = function(SYS_ID){
		// TODO Actions.js removeAction
	}
	
	this.toJSON = function(){
		var tmp = []
		
		for(n = 0; n < Actions.length; n++)
			tmp.push(Actions[n].toJSON())
		
		return tmp
	}
}

function ActionsView(controller){
	
	var _self = this
	
	var _controller = controller
	
	this.display = function(model){
		
		var actions = model.getActions()
		
		if(actions.length > 0){
			var html = '<ul class="obj_actions">'
			for(n=0; n<actions.length; n++){
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