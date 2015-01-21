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

		console.log("MainView.js - generateToolbar - Generiere Toolbar");

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
					[ 		
					  		$(container).clone().html(btnNew),
							$(container).clone().html(btnLoad),
							$(container).clone().html(btnSave),
							$(container).clone().html(btnSaveAs)
							]);
			$(toolbar).append([ menuopen,
							  	inputLoad,
								menu,
								trash,
								ruleNameForm
								]);
			return toolbar;
		};

		this.setSize = function(width, height) {
			$(ID).css('width', width);
			$(ID).css('height', height);
		};

		this.getID = function() {
			return ID;
		};
	};

	/**
	 * Function to generates the draggbar object
	 */
	var generateDraggableObjectList = function() {

		Log('MainView.js - generateDraggableObjectList - Generiere ObjectList');

		var ID = '#' + Configuration.GUI.DRAGBAR.ID;

		this.init = function() {

			Log('MainView.js - generateDraggableObjectList.init');

			var objList = document.createElement('div');
			objList.id = Configuration.GUI.DRAGBAR.ID;
			$(objList).addClass(Configuration.GUI.DRAGBAR.OBJECT_LIST.CLASSES)
			objList.innerHTML = 'ObjectList not loaded yet';

			return objList;
		};

		this.actualize = function(blocks, rules) {

			$(ID).html('')

			Log('MainView.js - generateDraggableObjectList.actualize');

			if (blocks === undefined || blocks === null)
				return;

			var node;
			$
					.each(
							blocks,
							function(key, value) {
								if ($('#' + key).size() <= 0) {
									// Create List Of Devices
									node = document.createElement('ul');
									node
											.setAttribute(
													'class',
													Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.CLASSES);
									node.id = key
									$(ID).append(node);
								}
								var i = 0;
								if (i <= 0) {
									var e = document.createElement('li');
									e.innerHTML = key
									e
											.setAttribute(
													'class',
													Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.HEAD)
									$(node).append(e);
									$(node).append('<hr>');
								}
								i++;
								$
										.each(
												value,
												function(index, obj) {
													var e = document
															.createElement('li');
													if (key != 'gather'
															&& obj.ID !== undefined) {
														e.id = obj.ID;
														e.setAttribute('rel',obj.ID);
														e.setAttribute('class', Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.BODY)
														var url = (obj.ICON_CLASS != '' ? $(e).addClass(obj.ICON_CLASS)	: '')

														e.innerHTML = obj.NAME;

														// TODO: Tooltip
														// if (obj.ALT) {
														// $(e).attr('title',
														// obj.ALT);
														// } else {
														// $(e).attr('title',
														// obj.NAME);
														// }

													} else {
														e.id = obj[0]
														e.innerHTML = obj[0]
													}
													// e.setAttribute('draggable',
													// 'true');
													// e.setAttribute('ondrag',
													// 'drag(event)');

													$(node).append(e);
												});

							})

			// Create List Of Rules
			if (Object.keys(rules).length > 0) {

				node = document.createElement('ul');
				node
				.setAttribute(
						'class',
						Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.CLASSES);
		node.id = 'rules'
		$(ID).append(node);
		var e = document.createElement('li');
		e.innerHTML = 'rules'
		e
				.setAttribute(
						'class',
						Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.HEAD)
		$(node).append(e);
		$(node).append('<hr>');
				for (rule in rules) {
					info = rules[rule].getInfo()

					var e = document.createElement('li');
					e.id = rules[rule].SYS_ID;
					e.setAttribute('rel', rules[rule].SYS_ID);
					e.setAttribute('class', Configuration.GUI.DRAGBAR.OBJECT_LIST.SEGMENTATION.BODY)
					e.innerHTML = (info.Name||info.ID);
					$(node).append(e);
				};

				$(ID).append(node);
			}

			_events.enableItemDragging();

		};

		this.getID = function() {

			console.log("MainView.js - generateDraggableObjectList.getID");

			return ID;
		};
	};

	var generateDropableObjectField = function() {

		console.log("MainView.js - generateDropableObjectField");

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

			console.log('MainView.js - generateDropableObjectField.init');

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

			console.log('MainView.js - generateDropableObjectField.setSize');

			toolbar.innerwidth = width;
			toolbar.innerheight = height;
		};

		/**
		 * Returns HTML-ID
		 * 
		 * @return ID
		 */
		this.getID = function() {
			console.log('MainView.js - generateDropableObjectField.getID')
			return ID;
		};

		/**
		 * Function which actualize the rules in the main object field
		 * 
		 * @param objects
		 * @see /classes/objects/Rules.js
		 */
		var actualizeRules = function(_rules) {
			Log('MainView.js - generateDropableObjectField.actualizeRules',4)
			$.each(_rules, function(_key, _rule) {
//
//				$('#Tab_' + _key).html("");
//
//				if (_rule.getSensorList().getRootItem() == null) {
//					$('#Tab_' + _key).append(buildPlaceholder(false, _key));
//
//				} else {
//					$.each(_rule.getSensorList().getObjectsAsList(), function(
//							_UNIQUE_ID, _obj) {
//						$('#Tab_' + _key)
//								.append(
//										buildBox(_obj.getItem()._UNIQUE_ID,
//												_obj, _key));
//					});
//				}
//				if (_rule.getActorList().getRootItem() == null) {
//					$('#Tab_' + _key).append(buildPlaceholder(true, _key));
//				} else {
//
//					$.each(_rule.getActorList().getObjectsAsList(), function(
//							_UNIQUE_ID, _obj) {
//						$('#Tab_' + _key)
//								.append(
//										buildBox(_obj.getItem()._UNIQUE_ID,
//												_obj, _key));
//					});
//				}
//				// $('#Tab_' + _key).append(ret);

			});
		};

		/**
		 * Aktualize the main object field
		 * 
		 * @param objects
		 * @see /classes/objects/Rules.js
		 */
		this.actualize = function() {
			Log('MainView.js - generateDropableObjectField.actualize', 4);
	//		actualizeRules(_controller.getRules());
			$('#rd_rules_preview').html(
					"<pre>" + _controller.generateJSONString() + "</pre>");
		};

	};

	var toolbar = new generateToolbar;
	var objList = new generateDraggableObjectList;
	var objField = new generateDropableObjectField;

	this.addRule = function() {
		// _events.disableItemDragging() // Disable draggbar events
		if ((_rule = _controller.addNewRule()) != null) {
			objField.addRuleTab(_rule); // Add rule tab
			_self.actualize()
		}
	};
	
	this.loadRule = function() {
		// _events.disableItemDragging() // Disable draggbar events
		if ((_rule = _controller.loadRule()) != null) {
			objField.addRuleTab(_rule); // Add rule tab
			_self.actualize()
		}
	};
	
	/**
	 * This initialize the removing of the element with the SYS_ID. Normally the
	 * function gets the SYS_ID from HTML-rel-attribute
	 * 
	 * @param SYS_ID
	 * @return true, if succeed
	 */
	this.removeElement = function(SYS_ID) {
		if (!_controller.removeRule(SYS_ID)) {// If SYS_ID not a rule
			return _controller.removeElement(SYS_ID) // search and remove element
		}
		return true
	}

	this.reset = function() {
		$(objList).children().remove();
		$(objField).children().remove();
		$('input[name=txtMakro]').val('');
	};

	this.actualizeObjectList = function(obj, vdev) {
		Log('MainView.js: actualizeObjectList', obj, 4)
		var blocks = eval('obj.' + obj.defaultFunc + '()')
		Log(blocks, 5)
		var rules = _controller.getRules();

		var vdevs = $.map(vdev, function(elem, i) {
			Log('elem', elem, 5)
			var tmp = elem
			tmp.ID = tmp.TYPE
			return tmp
		})

		var gather = _controller.getGatherList();
		Log('Gather', gather, 5)
		var gathers = $.map(gather, function(elem, i) {
			Log('elem', elem, 5)
			var tmp = {}
			tmp.ID = elem[0]
			tmp.NAME = tmp.ID
			tmp.ICON_CLASS = ('RD_ICON_' + tmp.ID).toLowerCase()
			return tmp
		})

		blocks['virtual_devices'] = vdevs

		blocks['gathers'] = gathers

		objList.actualize(blocks, rules);

		$(window).resize();

	}

	this.actualize = function() {
		
		objField.actualize();

		$(window).resize();
	}

	/**
	 * Initialize MainView
	 */
	var init = function() {

		console.log("RuleDesignerView.init");

		// Generates toolbar and add it to the view
		var _toolbar = toolbar.init();
		$(Configuration.GUI.APP_CONTAINER).append(_toolbar);
		_events.enableButtonEvents();
		_events.enableTrash()

		// Generates droppable field and add it to the view
		var _objField = objField.init();
		$(Configuration.GUI.APP_CONTAINER).append(_objField);
		_events.enableAddButton()
		
		// Add predefined rules
		var _rules = _controller.getRules()
		for (var key in _rules){
			objField.addRuleTab(_rules[key])
		}
				
		// Generates draggable and add it to the view
		var _objList = objList.init();
		$(Configuration.GUI.APP_CONTAINER).append(_objList);

		
		_self.actualize()
	}();

};
