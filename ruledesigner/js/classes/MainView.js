/**
 * Function to build the central view object
 * 
 * @param controller
 *            object
 * @returns {RuleDesignerView}
 */
function MainView(_controller) {

	var _self = this

	// set controller link
	var controller = _controller;

	// bind events on controller and GUI
	var _events = new Events(_self)

	Log('MainView.js - Create', 3)

	/**
	 * Function to generate the toolbar object
	 */
	var generateToolbar = function() {

		Log("MainView.js - generateToolbar - Generiere Toolbar");

		var ID = '#' + Configuration.GUI.TOOLBAR.ID;

		this.init = function() {
			var toolbar = document.createElement('div');
			toolbar.id = Configuration.GUI.TOOLBAR.ID
			toolbar.className = Configuration.GUI.TOOLBAR.CLASSES;

			var container = document.createElement('li');

			var menuopen = document.createElement('a');
			menuopen.id = 'menu-open';
			menuopen.innerHTML = '<span class="ui-icon ui-icon-menu"></span>';

			var menu = document.createElement('ul')
			menu.id = 'menu'

			var ruleNameForm = document.createElement('form');

			var ruleNameField = document.createElement('input');
			ruleNameField.name = 'txtRuleName';
			var ruleNameLabel = document.createElement('label');
			ruleNameLabel.innerHTML = 'Makro-Bez.';
			ruleNameLabel.htmlFor = 'txtRuleName';

			$(ruleNameForm).append(ruleNameLabel);
			$(ruleNameForm).append(ruleNameField);

			var inputLoad = document.createElement('input');
			inputLoad.type = 'file';
			inputLoad.id = 'inputLoad';

			var btnLoad = document.createElement('a');
			btnLoad.id = 'btnLoad';
			btnLoad.innerHTML = '<span class="ui-icon ui-icon-load"></span><b>Laden</b>';

			var btnSave = document.createElement('a');
			btnSave.id = 'btnSave';
			btnSave.innerHTML = '<span class="ui-icon ui-icon-store"></span><b>Speichern</b>';

			var btnSaveAs = document.createElement('a');
			btnSaveAs.id = 'btnSaveAs';
			btnSaveAs.innerHTML = '<span class="ui-icon ui-icon-storeas"></span><b>Speichern unter</b>';

			var btnNew = document.createElement('a');
			btnNew.id = 'btnNew';
			btnNew.innerHTML = '<span class="ui-icon ui-icon-new"></span><b>Neu</b>';

			var trash = document.createElement('div');
			trash.id = 'trash';
			trash.innerHTML = '<span class="ui-icon ui-icon-trash ui-corner-all"></span><b>Papierkorb</b>';

			$(trash).addClass('ui-corner-all ui-state-default');
			$(ruleNameForm).addClass('ui-corner-all ui-state-default');

			$(menuopen).addClass('ui-corner-all ui-state-default');

			$(menu).append(
					[ $(container).clone().html(btnNew),
							$(container).clone().html(btnLoad),
							$(container).clone().html(btnSave),
							$(container).clone().html(btnSaveAs) ]);
			$(toolbar).append(
					[ menuopen, inputLoad, menu, trash, ruleNameForm ]);
			return toolbar;
		};

		/**
		 * TODO
		 */
		this.setSize = function(width, height) {
			$(ID).css('width', width);
			$(ID).css('height', height);
		};

		/**
		 * TODO
		 */
		this.getID = function() {
			return ID;
		};
	};

	/**
	 * Function to generates the draggbar object
	 */
	var generateDraggableObjectList = function() {

		Log('MainView.js - generateDraggableObjectList - Generiere ObjectList',
				4);

		var ID = '#' + Configuration.GUI.DRAGBAR.ID;

		var flagSegmentation = _controller.getAvailableSegmentation().defaultFunc

		/**
		 * TODO
		 */
		this.setFlagSegmentation = function(setup) {
			flagSegmentation = setup
		}

		/**
		 * TODO
		 */
		this.init = function() {

			Log('MainView.js - generateDraggableObjectList.init', 4);

			var objList = document.createElement('div');
			objList.id = Configuration.GUI.DRAGBAR.ID;
			$(objList).addClass(Configuration.GUI.DRAGBAR.OBJECT_LIST.CLASSES)
			objList.innerHTML = 'ObjectList not loaded yet';

			return objList;
		};

		/**
		 * TODO
		 */
		this.actualize = function() {

			$(ID).html('')

			Log('MainView.js - generateDraggableObjectList.actualize', 4);

			var categories = _controller.getItems(flagSegmentation)

			for (key in categories) {
				categories[key] = $.map(categories[key], function(elem, i) {
					elem.DRAG_CLASS = [
							(elem.READINGS.length > 0 ? 'drag-sensor' : ''),
							(elem.SETS.length > 0 ? 'drag-actor' : '') ]
					return elem
				})
			}

			var vdevs = $.map(_controller.getVirtualDevices(),
					function(elem, i) {
						Log('elem', elem, 5)
						var tmp = elem
						tmp.ID = tmp.TYPE
						tmp.DRAG_CLASS = [ (tmp.IS_VDEV ? 'drag-vdev' : ''),
								(tmp.IS_ACTOR ? 'drag-vdev-actor' : ''),
								(tmp.IS_SENSOR ? 'drag-vdev-sensor' : '') ]
						return tmp
					})
			categories['virtual_devices'] = vdevs

			var gathers = $.map(_controller.getGatherList(), function(elem, i) {
				Log('elem', elem, 5)
				var tmp = {}
				tmp.ID = elem[0]
				tmp.NAME = tmp.ID
				tmp.ICON_CLASS = ('RD_ICON_' + tmp.ID).toLowerCase()
				tmp.DRAG_CLASS = [ 'drag-gather' ]
				return tmp
			})
			categories['gathers'] = gathers

			var rules = $.map(_controller.getRules(), function(rule, i) {
				var info = rule.getInfo()
				rule.ID = rule.SYS_ID
				rule.NAME = (info.PARAMS.Name || info.ID || rule.ID)
				rule.DRAG_CLASS = [ 'drag-rule-actor' ]
				return rule
			})
			categories['rules'] = rules

			if (categories === undefined || categories === null)
				return;

			var node;

			for (cat in categories) {
				var blocks = categories[cat]

				if ($(blocks).size() > 0) {
					node = document.createElement('ul');
					$(node)
							.addClass(
									Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.CLASSES)
					node.id = cat
					$(ID).append(node);

					var i = 0;
					if (i <= 0) {
						var e = document.createElement('li');
						e.innerHTML = cat
						$(e)
								.addClass(
										Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.HEAD)
						$(node).append(e);
						$(node).append('<hr>');
					}
					i++;

					for (key in blocks) {
						var e = document.createElement('li');
						e.id = blocks[key].ID;
						e.setAttribute('rel', blocks[key].ID)
						$(e)
								.addClass(
										Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.BODY);
						$(e).addClass((blocks[key].DRAG_CLASS).join(' '))
						var url = (blocks[key].ICON_CLASS != '' ? $(e)
								.addClass(blocks[key].ICON_CLASS) : '')
						e.innerHTML = blocks[key].NAME;
						$(node).append(e);
						_events.enableItemDragging($(e));
					}
					;

				}

			}
			;

		};
	}

	/**
	 * TODO
	 */
	var generateAdditionals = function() {

		var ID = '#' + Configuration.GUI.ADDITIONALS.ID;

		var links = {
			'JSON' : [ 'demo/demo.html', 'JSON-Examples', 'Switch to test app' ],
			'PARSE' : [ 'demo/parseDemo.html', 'Parse JSON',
					'Switch to parse app' ]
		}

		/**
		 * Function
		 */
		var createLinks = function() {
			var tmp = []
			for (key in links) {
				var a = document.createElement('a')
				a.setAttribute('href', links[key][0])
				a.innerHTML = links[key][1]
				a.setAttribute('title', links[key][2])
				tmp.push(a.outerHTML)
			}
			return tmp.join(' ')
		}

		/**
		 * TODO
		 */
		this.addSelectorOptions = function() {
			var tmp = _controller.getAvailableSegmentation()
			var options = Object.keys(tmp);
			for (key in options) {
				if (options[key] != 'defaultFunc') {
					var option = document.createElement('option')
					option.value = options[key]
					option.innerHTML = options[key].substring(3)
					$(ID + ' select.filter-seg').append(option.outerHTML)
				}
			}
			$(ID + ' select.filter-seg').val(tmp.defaultFunc)
		}

		/**
		 * TODO
		 */
		this.init = function() {
			var tmp = document.createElement('div')
			tmp.id = Configuration.GUI.ADDITIONALS.ID
			$(tmp).append(createLinks())
			$(tmp).append('<hr/>')
			var selectX = document.createElement('select')
			selectX.className = 'filter-seg'
			$(tmp).append(selectX.outerHTML)
			return tmp
		}

	}

	/**
	 * TODO
	 */
	var generateDropableObjectField = function() {

		Log("MainView.js - generateDropableObjectField");

		var ID = '#' + Configuration.GUI.EDITOR.ID;

		var Preview_ID = 'rd_rules_preview';

		/**
		 * Function which is displaying an new rule
		 * 
		 * @param obj -
		 *            Object of the created rule
		 * @see /classes/objects/Rule.js
		 */
		this.addRuleTab = function(rule) {

			var info = rule.getInfo()

			var div = document.createElement('div');
			div.id = 'Tab_' + rule.SYS_ID;
			div.setAttribute('rel', rule.SYS_ID);

			$(div).insertBefore('#' + Preview_ID);

			// Init first display
			var tmp = rule.display(_events)
			Log(tmp, 5)
			$('#Tab_' + rule.SYS_ID).html(tmp)

			var li = document.createElement('li');
			$(li)
					.html(
							'<a href="#Tab_'
									+ rule.SYS_ID
									+ '"><span class="ui-icon ui-icon-close" role="presentation"></span>'
									+ (info.PARAMS.Name || info.ID || rule.SYS_ID)
									+ '</a>');
			// alert($('li[rel="' + Preview_ID + '"]').html());

			// Add generated tabular
			$(li).insertBefore($('li[rel="' + Preview_ID + '"]'));

			// Make it draggable (for trashing)
			$(li).draggable({
				opacity : 0.5,
				revert : true,
				containment : 'trash'
			});

			// Refresh tabs
			$(ID).tabs("refresh");

			// Refresch window - set the correct calculate size attributes to
			// the div tags
			$(window).trigger('resize');

			// Make new tab active
			$(ID).tabs('option', 'active', $(ID + ' > div ').length - 2);

		};

		/**
		 * Function to initialize the main object field
		 */
		this.init = function() {

			Log('MainView.js - generateDropableObjectField.init');

			var e = document.createElement('div');
			e.id = Configuration.GUI.EDITOR.ID;

			var ul_tab = document.createElement('ul');

			var div_preview = document.createElement('div');
			div_preview.id = Preview_ID;

			/* Create AddRule Tab-button */
			var li_addRule = document.createElement('li');

			var a = document.createElement('a');
			a.id = "btnAddRule";
			$(a).attr({
				"class" : "ui-tabs-anchor",
				"role" : "presentation",
				"tab-index" : -1
			});
			$(a)
					.html(
							'<span class="ui-icon ui-icon-plusthick" role="presentation"></span>AddRule');

			$(li_addRule).append(a);
			$(li_addRule).attr({
				"class" : "ui-state-default ui-corner-top",
				"role" : "tab",
				"tab-index" : -1
			});
			$(li_addRule).hover(function() {
				$(this).addClass("ui-state-hover");
			}, function() {
				$(this).removeClass("ui-state-hover");
			});

			var li_preview = document.createElement('li');
			$(li_preview)
					.html('<a href="#' + Preview_ID + '">JSON-Preview</a>');
			$(li_preview).attr('rel', Preview_ID);

			$(ul_tab).append(li_addRule);
			$(ul_tab).append(li_preview);

			$(e).append(ul_tab);
			$(e).append(div_preview);

			$(e).tabs();
			return e;
		};

		/**
		 * Set size of the main object field
		 * 
		 * @param height -
		 *            Höhe
		 * @param width -
		 *            Weite
		 */
		this.setSize = function(height, width) {

			Log('MainView.js - generateDropableObjectField.setSize');

			toolbar.innerwidth = width;
			toolbar.innerheight = height;
		};

		/**
		 * Returns HTML-ID
		 * 
		 * @return ID
		 */
		this.getID = function() {
			Log('MainView.js - generateDropableObjectField.getID')
			return ID;
		};

		/**
		 * Function which actualize the rules in the main object field
		 * 
		 * @param objects
		 * @see /classes/objects/Rules.js
		 */
		this.rebuildRules = function() {
			Log('MainView.js - generateDropableObjectField.actualizeRules', 4)
			var rules = controller.getRules()
			for (key in rules) {
				$('#Tab_' + key).html(rules[key].display())
			}
			;
		};

		/**
		 * Aktualize the main object field
		 * 
		 * @param objects
		 * @see /classes/objects/Rules.js
		 */
		this.actualize = function() {
			Log('MainView.js - generateDropableObjectField.actualize', 4);
			$('#rd_rules_preview').html(
					"<pre>" + _controller.generateJSONString() + "</pre>");
		};

	};

	var toolbar = new generateToolbar;
	var additionals = new generateAdditionals;
	var objList = new generateDraggableObjectList;
	var objField = new generateDropableObjectField;

	/**
	 * TODO
	 */
	this.addRule = function() {
		// _events.disableItemDragging() // Disable draggbar events
		if ((_rule = _controller.addNewRule()) != null) {
			objField.addRuleTab(_rule); // Add rule tab
			_self.actualize()
		}
	};

	/**
	 * TODO
	 */
	this.loadRule = function() {
		// _events.disableItemDragging() // Disable draggbar events
		if ((_rule = _controller.loadRule()) != null) {
			objField.addRuleTab(_rule); // Add rule tab
			_self.actualize()
		}
	};

	/**
	 * Function adds an element to an object, which is given by an relation id
	 * 
	 * @param SYS_ID
	 *            as relation id
	 * @param ID -
	 *            external object id / data id from the object which should
	 *            adding
	 * @return display-information for slight replacing or null
	 */
	this.addElement = function(rel, id, type) {
		return _controller.addElement(rel, id, type)
	}

	/**
	 * This initialize the removing of the element with the SYS_ID. Normally the
	 * function gets the SYS_ID from HTML-rel-attribute
	 * 
	 * @param SYS_ID
	 * @return true, if succeed
	 */
	this.removeElement = function(SYS_ID) {
		Log('MainView -', SYS_ID, 5)
		var bool = _controller.removeObject(SYS_ID)
		if(bool){
			objField.rebuildRules()
			_self.actualize()
			return true
		}
		objField.rebuildRules()
		return false
	}

	/**
	 * do changing the object list style
	 */
	this.changeObjectList = function(setup) {
		objList.setFlagSegmentation(setup)
		objList.actualize()
		$(window).resize()
	}

	/**
	 * TODO
	 */
	this.reset = function() {
		$(objList).children().remove();
		$(objField).children().remove();
		$('input[name=txtMakro]').val('');
	};

	/**
	 * TODO
	 */
	this.actualize = function() {
		objList.actualize();
		objField.actualize();
		additionals.addSelectorOptions()

		$(window).resize();
		_events.enableDropElementsRule()
		_events.enableAddActionGroupOnClick()
		_events.initializeTrashable()

	}

	/**
	 * Initialize MainView
	 */
	var init = function() {

		Log("RuleDesignerView.init");

		// Generates toolbar and add it to the view
		var _toolbar = toolbar.init();
		$(Configuration.GUI.APP_CONTAINER).append(_toolbar);
		_events.enableButtonEvents();
		_events.enableTrash()

		// Generates additionals
		var _additionals = additionals.init();
		$(Configuration.GUI.APP_CONTAINER).append(_additionals);
		_events.enableFilterSegmentation()

		// Generates droppable field and add it to the view
		var _objField = objField.init();
		$(Configuration.GUI.APP_CONTAINER).append(_objField);
		_events.enableAddButton()

		// Add predefined rules
		var _rules = _controller.getRules()
		for ( var key in _rules) {
			objField.addRuleTab(_rules[key])
		}

		_events.enableDropElementsRule()
		_events.initializeTrashable()

		// Generates draggable and add it to the view
		var _objList = objList.init();
		$(Configuration.GUI.APP_CONTAINER).append(_objList);

		$(window).resize()
	}();

};
