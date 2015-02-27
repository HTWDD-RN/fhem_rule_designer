/**
 * Add Events
 */
$(window)
		.resize(
				function() {

					var margin = 5;
					var border_size = 1;
					var topPadding = 35;
					var topMargin = 2;

					var draggbar_width = 250;

					var quad_size_of_connectors = 21;

					var width = $(window).width();
					var height = $(window).height() - 20;

					// AppContainer Resize
					$(Configuration.GUI.APP_CONTAINER + ' > div').css('margin',
							margin);
					$(Configuration.GUI.APP_CONTAINER + ' > div').css(
							'margin-bottom', 0);

					$('#rd_rules > div').css('margin-top', topMargin);
					$('#rd_rules > div').css('padding-top', topPadding);

					$('#rd_toolbar > li:first').css('width', draggbar_width);

					if (width >= 720) {

						var h = $('#rd_toolbar').height();
						height -= (h + (2 * border_size + margin));
						width -= draggbar_width;

						$('#rd_draggbar').css('height', height);
						$('#rd_draggbar').css('width', draggbar_width);
						$('#rd_draggbar').css('float', 'left');
						$('#rd_draggbar li').css('padding', '2px 5px');
						$('#rd_draggbar li').css('width',
								(draggbar_width / 2 - (2 * margin)) - 10);
						$('#rd_draggbar li.ui-objlist-head').css('width',
								draggbar_width - 2 * margin - 20);

						$('#rd_rules').css('width', width + 1 * margin - 24);
						$('#rd_rules').css('margin-left', 0);
						$('#rd_rules').css('height', height);
						$('#rd_rules').css('float', 'right');

						$('#rd_rules > div').css('height',
								height - topMargin - topPadding - 60);

					} else if (width >= 480) {

						$('#rd_draggbar li').css('width', '');
						var h = $('#rd_toolbar').height();
						height -= (h + (2 * border_size + margin));
						draggbar_width = 125;
						width -= draggbar_width - 8;

						$('#rd_draggbar').css('height', height);
						$('#rd_draggbar').css('width', draggbar_width + 8);
						$('#rd_draggbar').css('float', 'left');
						$('#rd_draggbar').css('owerflow-x', 'hidden')
						$('#rd_draggbar li')
								.css('width', (draggbar_width - 20));

						$('#rd_rules').css('width',
								width - topPadding - margin + 8);
						$('#rd_rules').css('margin-left', 0);
						$('#rd_rules').css('height', height);
						$('#rd_rules').css('float', 'right');

						$('#rd_rules > div').css('height',
								height - topMargin - topPadding - 100);

					} else {

						$('#rd_draggbar').css('width', '');
						$('#rd_draggbar').css('height', '');
						$('#rd_draggbar').css('float', 'none');

						$('#rd_rules').css('margin-left', margin);
						$('#rd_rules').css('width', '');
						$('#rd_rules').css('height', $(window).height());
						$('#rd_rules').css('float', 'none');

					}

					$('div.rule-obj-box')
							.each(
									function() {

										var border = 1;
										var width = $(this).width() + 20 + 2
												* border;
										var height = $(this).height() + 10 + 2
												* border;

										var connector_padding = (quad_size_of_connectors - border)
												/ 2 + 2 * border;

										$(this).css('border',
												border + 'px solid #333');

										$('span.connector').css('width', 20);
										$('span.connector').css('height', 20);

										$('span.connector').css('border',
												border + 'px solid #aaa');

										$('span.connector-left', this).css(
												'left', 0 - connector_padding);
										$('span.connector-left', this).css(
												'top',
												height / 2 - connector_padding);
										$('span.connector-right', this).css(
												'right', 0 - connector_padding);
										$('span.connector-right', this).css(
												'top',
												height / 2 - connector_padding);
										$('span.connector-top', this).css(
												'top', 0 - connector_padding);
										$('span.connector-top', this).css(
												'left',
												width / 2 - connector_padding);
										$('span.connector-bottom', this)
												.css('bottom',
														0 - connector_padding);
										$('span.connector-bottom', this).css(
												'left',
												width / 2 - connector_padding);

									});
					$('div.placeholder').css({
						'border-style' : 'dashed',
						'text-align' : 'center'
					});

//					 var remember = ''
//					 $('.rule-obj-box').draggable({
//						 helper: function(){ // get cloned object
//							 return $('<divid="draggedItem">'+$(this).html()+'</div>');
//						 },
//						 start: function(e, ui) {
//							 remember = $(this).html();
//							 $(this).addClass('dragged'); // add class dragged if dragging start
//						 },
//						 stop: function(e, ui) {
//							 $(this).draggable('option', 'zIndex', 999);
//							 $(this).draggable('option', 'revert', 'invalid');
//							 $(this).removeClass('dragged'); // remove class dragged if dragging start
//						 }
//					 });

//					 $("ul li").draggable({
//						 helper: 'clone',
//						 start: function(e, ui) {
//							 remember = $(this);
//							 $(this).html("<div>"+remember.html()+"</div>");
//						 },
//						 stop: function(e, ui) {
//							 $(this).html(remember.html());
//						 }
//					 });
				});

/**
 * Function to build the central view object
 * 
 * @param controller
 *            object
 * @returns {RuleDesignerView}
 */
function MainView(_controller) {

	var _self = this

	Log('MainView.js - Create', 3)

	var controller = _controller;

	var generateToolbar = function() {

		console.log("MainView.js - generateToolbar - Generiere Toolbar");

		var id = 'rd_toolbar';

		this.init = function() {
			var toolbar = document.createElement('ul');

			var container = document.createElement('li');
			toolbar.id = id;

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

			var btnLoad = document.createElement('button');
			btnLoad.id = 'btnLoad';
			btnLoad.innerHTML = 'Laden';

			$(inputLoad).css({
				"display" : "none"
			});

			var btnSave = document.createElement('button');
			btnSave.id = 'btnSave';
			btnSave.innerHTML = 'Speichern';

			var btnSaveAs = document.createElement('button');
			btnSaveAs.id = 'btnSaveAs';
			btnSaveAs.innerHTML = 'Speichern unter';

			var btnNew = document.createElement('button');
			btnNew.id = 'btnNew';
			btnNew.innerHTML = 'Neu';

			var trash = document.createElement('div');
			trash.id = 'imgTrash';
			trash.innerHTML = '<div><span class="ui-corner-all"></span></div>';
			$(trash).addClass('ui-corner-all ui-state-default');
			$(ruleNameForm).addClass('ui-corner-all ui-state-default');
			$(toolbar).append(
					[ $(container).clone().html(ruleNameForm),
							$(container).clone().html(btnNew),
							$(container).clone().html(inputLoad),
							$(container).clone().html(btnLoad),
							$(container).clone().html(btnSave),
							$(container).clone().html(btnSaveAs),
							$(container).clone().html(trash) ]);

			return toolbar;
		};

		this.setSize = function(width, height) {
			$('#' + id).css('width', width);
			$('#' + id).css('height', height);
		};

		this.getID = function() {
			return id;
		};
	};

	var generateDraggableObjectList = function() {

		Log('MainView.js - generateDraggableObjectList - Generiere ObjectList');

		var id = 'rd_draggbar';

		this.init = function() {

			Log('MainView.js - generateDraggableObjectList.init');

			var objList = document.createElement('div');
			objList.id = id;
			$(objList).addClass(Configuration.GUI.OBJECT_LIST.CLASSES)
			objList.innerHTML = 'ObjectList not loaded yet';

			return objList;
		};

		this.actualize = function(blocks, rules) {

			$('#' + id).html('')

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
													Configuration.GUI.OBJECT_LIST.SEGMENTATION.CLASSES);
									node.id = key
									$('#' + id).append(node);
								}
								var i = 0;
								if (i <= 0) {
									var e = document.createElement('li');
									e.innerHTML = key
									e
											.setAttribute(
													'class',
													Configuration.GUI.OBJECT_LIST.SEGMENTATION.HEAD)
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
														e.setAttribute('rel',
																obj.ID);
														e
																.setAttribute(
																		'class',
																		Configuration.GUI.OBJECT_LIST.SEGMENTATION.BODY)
														var url = (obj.ICON_CLASS != '' ? $(
																e).addClass(
																obj.ICON_CLASS)
																: '')

														e.innerHTML = obj.NAME;

														// TODO: Tooltip
														if (obj.ALT) {
															$(e).attr('title',
																	obj.ALT);
														} else {
															$(e).attr('title',
																	obj.NAME);
														}

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
			if (rules === undefined || rules === null)
				return;

			node = document.createElement('ul');
			node.setAttribute('class', 'objlist-category ui-widget-content');
			Log(rules.getInfo(), 5)
			$.each(rules.getInfo(), function(rule, info) {

				var e = document.createElement('li');
				e.id = info._UNIQUE_ID;
				e.setAttribute('rel', info.getUID());
				e.setAttribute('class', 'objlist-category-head')
				e.innerHTML = info.Name;
				$(node).append(e);
			});

			$('#' + id).append(node);

			$('#' + id + ' ul').children("li").each(function() {

//				// Enable toolitips
//
//				// Enable Drag&Drop
//				 $(this).draggable({ // TODO:
//				 //containment : '#' + id + ' ul',
//				 //scroll : false,
//				 //revert : true
//				 
//					// scroll: true,
//					// revert : true
//					// TODO proof
//					revert: false,
//					helper: function(){
//							$copy = $(this).clone();
//							return $copy;
//					},
//					appendTo: 'body',
//					scroll: false,
//					zIndex: 999
//				 });
			});
			

			

		};

		this.getID = function() {

			console.log("MainView.js - generateDraggableObjectList.getID");

			return id;
		};
	};

	var generateDropableObjectField = function() {

		console.log("MainView.js - generateDropableObjectField");

		var ID = 'rd_rules';

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
			div.id = 'Tab_' + info.ID;
			div.setAttribute('rel', info.ID);

			$(div).insertBefore('#' + Preview_ID);

			// Init first display
			var tmp = rule.display()
			Log(tmp, 5)
			$('#Tab_' + info.ID).html(tmp)

			var li = document.createElement('li');
			$(li)
					.html(
							'<a href="#Tab_'
									+ info.ID
									+ '"><span class="ui-icon ui-icon-close" role="presentation"></span>'
									+ (info.PARAMS.Name || info.ID) + '</a>');
			// alert($('li[rel="' + Preview_ID + '"]').html());

			// Add generated tabular
			$(li).insertBefore($('li[rel="' + Preview_ID + '"]'));

			// Make it draggable (for trashing)
			$(li).draggable({
				opacity : 0.5,
				revert : true
			});

			// Refresh tabs
			$('#' + ID).tabs("refresh");

			// Refresch window - set the correct calculate size attributes to
			// the div tags
			$(window).trigger('resize');

			// Make new tab active
			$('#' + ID).tabs('option', 'active',
					$('#' + ID + ' > div ').length - 2);

		};

		/**
		 * Function to initialize the main object field
		 */
		this.init = function() {

			console.log('MainView.js - generateDropableObjectField.init');

			var e = document.createElement('div');
			e.id = ID;

			var ul_tab = document.createElement('ul');

			var div_preview = document.createElement('div');
			div_preview.id = Preview_ID;

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
				$(this).css('cursor', 'pointer');
			}, function() {
				$(this).removeClass("ui-state-hover");
				$(this).css('cursor', '');
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
			return id;
		};

		/**
		 * Function which actualize the rules in the main object field
		 * 
		 * @param objects
		 * @see /classes/objects/Rules.js
		 */
		var actualizeRules = function(_rules) {
			console
					.log('MainView.js - generateDropableObjectField.actualizeRules')
			$.each(_rules, function(_key, _rule) {

				$('#Tab_' + _key).html("");

				if (_rule.getSensorList().getRootItem() == null) {
					$('#Tab_' + _key).append(buildPlaceholder(false, _key));

				} else {
					$.each(_rule.getSensorList().getObjectsAsList(), function(
							_UNIQUE_ID, _obj) {
						$('#Tab_' + _key)
								.append(
										buildBox(_obj.getItem()._UNIQUE_ID,
												_obj, _key));
					});
				}
				if (_rule.getActorList().getRootItem() == null) {
					$('#Tab_' + _key).append(buildPlaceholder(true, _key));
				} else {

					$.each(_rule.getActorList().getObjectsAsList(), function(
							_UNIQUE_ID, _obj) {
						$('#Tab_' + _key)
								.append(
										buildBox(_obj.getItem()._UNIQUE_ID,
												_obj, _key));
					});
				}
				// $('#Tab_' + _key).append(ret);

			});
		};

		/**
		 * Aktualize the main object field
		 * 
		 * @param objects
		 * @see /classes/objects/Rules.js
		 */
		this.actualize = function(_rules) {
			Log('MainView.js - generateDropableObjectField.actualize', 4);
			actualizeRules(_rules);
			$('#rd_rules_preview').html(
					"<pre>" + _controller.generateJSONString() + "</pre>");
		};

	};

	var toolbar = new generateToolbar;
	var objList = new generateDraggableObjectList;
	var objField = new generateDropableObjectField;

	this.init = function() {

		console.log("RuleDesignerView.init");

		var _toolbar = toolbar.init()
		$(Configuration.GUI.APP_CONTAINER).append(_toolbar);

		var _objList = objList.init()
		$(Configuration.GUI.APP_CONTAINER).append(_objList);

		var _objField = objField.init()
		$(Configuration.GUI.APP_CONTAINER).append(_objField);
		$(_objField).droppable({
			drop : function(event, ui) {
				$(this)
				console.log(ui)
				alert(ui);
			}
		});

		$('#btnAddRule').click(function(e) {
			_controller.addNewRule();
		});

		$('#btnNew').click(function(e) {
			$('input[name="txtMakro"]').removeAttr('disabled');
		});

		$('#inputLoad').click(function(e) {
			if (_controller.loadRule()) {
				// TODO -Resetting the GUI
				$('input[name="txtMakro"]').attr('disabled', 'disabled');
			}
		});

		$('#btnLoad').click(function(e) {
			$("#inputLoad").trigger('click');
			return false;
		});

		$('#btnSave').click(function(e) {
			if (_controller.saveRule()) {
				$('input[name="txtMakro"]').attr('disabled', 'disabled');
			}
		});

		$('#btnSaveAs').click(function(e) {
			if (_controller.saveAsRule()) {
				$('input[name="txtMakro"]').attr('disabled', 'disabled');
			}
		});

		$("#rd_toolbar a, #rd_toolbar button").button()

		// TODO - Schliesse TABs
		/*
		 * $('#rd_rules').delegate( "span.ui-icon-close", "click", function() {
		 * $(this) var ID = $( this ).closest( "li" ).remove().attr(
		 * "aria-controls" ); var UNIQUE_ID = $( '#' + ID
		 * ).remove().attr("rel"); $('rd_rules').tabs( "refresh" ); });
		 */

		$('#imgTrash').droppable({
			tolerance : "touch",
			drop : function(event, ui) {
				obj = ui.draggable;
				if (obj.attr("aria-controls") !== undefined) { // Drop Rule Tab
					var ID = obj.attr("aria-controls");
					obj._RULE_ID = $('#' + ID).remove().attr("rel");
				} else if ($(obj).parent().attr("rel") !== undefined) { // Drop
					// Rule
					// Elements
					console.log($(obj));
					obj._UNIQUE_ID = $(obj).attr("rel");
					obj._RULE_ID = $(obj).parent().attr("rel");
				}
				ui.draggable.remove();
				_controller.doEventAction("drop.trash", obj, event);

			}
		});
		
		$( document ).tooltip();

	};

	this.addRuleTab = function(_rule) {
		objField.addRuleTab(_rule);
	};

	this.reset = function() {
		$(objList).children().remove();
		$(objField).children().remove();
		$('input[name=txtMakro]').val('');
	};

	this.actualize = function() {
		var rules = _controller.getRules();
		var blocks = _controller.getDevicesByType();
		console.log(blocks);
		objList.actualize(blocks, rules);
		// objField.actualize(Rules);

		$('span.connector, div[rel$=".sensor"], div[rel$=".actor"]').droppable(
				{
					tolerance : "touch",
					drop : function(event, ui) {
						_controller.doEventAction('drop.ruleTarget',
								ui.draggable, event);
					}
				});

		$(window).trigger('resize');

	};

	this.init();

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
		
	}

};
