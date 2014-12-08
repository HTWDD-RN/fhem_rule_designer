/**
 * 
 */

function Rules() {

	var _self = this // Important to simulate a singleton

	var _instance

	var _model

//	var _view
//
//	this.display = function() {
//		return _view.display(_model)
//	}

	this.serialize = function() {
		return _model.toJSON()
	}
	
	this.getInfo = function(){
		return _model.getInfo()
	}

	this.createRule = function(){
		var newRule = new Rule(cSYS_ID())
		_model.addRule(newRule)
		return newRule
	}
	
	return function() {
		if (_instance === undefined || _instance == null) {
			_instance = _self // not this!!! - it returns the rule designer
			_model = new RulesModel(_instance)
//			_view = new RulesView(_instance)
		}
		return _instance
	}()
}

function RulesModel(controller) {

	var _self = this

	var _controller = controller

	var rules = []

	this.addRule = function(rule) {
		rules.push(rule)
	}

	this.getRules = function() {
		return rules
	}

	this.toJSON = function() {
		var tmp = []

		for (n = 0; n < rules.length; n++)
			tmp.push(rules[n].toJSON())

		return tmp
	}
	
	this.getInfo = function (){
		var tmp = {}
		for(n =0; n < rules.length; n++){
			var info = rules[n].getInfo()
			tmp.push[info.ID] = info
		}
		return tmp
	}
	
}

//function RulesView(controller) {
//
//	var _self = this
//
//	var _controller = controller
//
//	this.display = function(_model) {
//
//	}
//
//}