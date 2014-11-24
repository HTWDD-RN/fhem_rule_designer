/**
 * Add Events
 */
$(window)
		.resize(function() {

			var margin = 10;
			var border_size = 1;

			var quad_size_of_connectors = 21;

			var width = $(window).width();
			var height = $(window).height() - 20;

			// BodyResize
				$('body > div').css('margin', margin);
				$('body > div').css('margin-bottom', 0);

				if (width >= 400) {

					var h = $('#rd_toolbar').height();
					height -= (h + (2 * border_size + margin));

					height -= (2 * border_size + 2 * margin);

					$('#rd_draggbar').css('height', height);
					$('#rd_draggbar').css('width', 150);
					$('#rd_draggbar').css('float', 'left');

					$('#rd_rules').css('width',
							width - 190 - (4 * border_size + 2 * margin));
					$('#rd_rules').css('margin-left', 0);
					$('#rd_rules').css('height', height);
					$('#rd_rules').css('float', 'right');

					$('#rd_rules > div').css('height', height - 100);

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
									var width = $(this).width() + 20 + 2*border ;
									var height = $(this).height() + 10 + 2*border;

									var connector_padding = (quad_size_of_connectors - border) / 2 + 2*border;

									$(this).css('border',
											border + 'px solid #333');

									$('span.connector').css('width', 20);
									$('span.connector').css('height', 20);

									$('span.connector').css('border',
											border + 'px solid #aaa');

									$('span.connector-left', this).css('left',
											0 - connector_padding);
									$('span.connector-left', this).css('top',
											height / 2 - connector_padding);
									$('span.connector-right', this).css(
											'right', 0 - connector_padding);
									$('span.connector-right', this).css('top',
											height / 2 - connector_padding);
									$('span.connector-top', this).css('top',
											0 - connector_padding);
									$('span.connector-top', this).css('left',
											width / 2 - connector_padding);
									$('span.connector-bottom', this).css('bottom',
											0 - connector_padding);
									$('span.connector-bottom', this).css('left',
											width / 2 - connector_padding);

								});
				$('div.placeholder').css({'border-style': 'dashed', 'text-align':'center'});
				
			
				$('.rule-obj-box').draggable({
					cancel: '.placeholder',
				    stop: function(){
				        $(this).draggable('option','revert','invalid');
				    }
				});
			});

/**
 * 
 * @returns {RuleDesignerView}
 */
function RuleDesignerView(_controller) {

	var controller = _controller;

	var generateToolbar = function() {

		console.log("RuleDesignerView.generateToolbar - Generiere Toolbar");

		var id = 'rd_toolbar';

		this.init = function() {
			var toolbar = document.createElement('div');
			toolbar.id = id;
			toolbar.style.backgroundColor = '#eee';
			toolbar.style.border = '1px solid #000';

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

			$(inputLoad).css( {
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

			var trash = document.createElement('img');
			trash.id = 'imgTrash';

			$(toolbar).append(ruleNameForm);
			$(toolbar).append(btnNew);
			$(toolbar).append(inputLoad);
			$(toolbar).append(btnLoad);
			$(toolbar).append(btnSave);
			$(toolbar).append(btnSaveAs);
			$(toolbar).append(trash);

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

		console
				.log("RuleDesignerView.generateDraggableObjectList - Generiere ObjectList");

		var id = 'rd_draggbar';

		this.init = function() {

			console.log("RuleDesignerView.generateDraggableObjectList.init");

			var objList = document.createElement('div');
			objList.id = id;
			objList.style.backgroundColor = '#ddd';
			objList.style.border = '1px solid #000';
			objList.innerHTML = 'ObjectList';
			objList.style.fload = '#left';

			return objList;
		};

		this.actualize = function(o, rules) {

			console
					.log("RuleDesignerView.generateDraggableObjectList.actualize");

			if (o === undefined || o === null)
				return;

			var node;

			// Create List Of Devices
			node = document.createElement('ul');
			node.setAttribute('class', 'ui-widget-content');
			$('#' + id).html(node);

			$.each(o, function(key, item) {
				var e = document.createElement('li');
				e.id = item._UNIQUE_ID;
				e.setAttribute('rel', item._UNIQUE_ID);
				e.innerHTML = item.name;

				// e.setAttribute('draggable', 'true');
				// e.setAttribute('ondrag', 'drag(event)');

				$(node).append(e);
			});

			// Create List Of Rules
			if (rules === undefined || rules === null)
				return;

			node = document.createElement('ul');
			node.setAttribute('class', 'ui-widget-content');

			$.each(rules, function(key, item) {
				var e = document.createElement('li');
				e.id = item._UNIQUE_ID;
				e.setAttribute('rel', item.getUID());
				e.innerHTML = item.Name;
				$(node).append(e);
			});

			$('#' + id).append(node);

			$('#' + id + ' ul').children("li").each(function() {
				$(this).draggable({
		            revert: true
				});
			});

		};

		this.getID = function() {

			console.log("RuleDesignerView.generateDraggableObjectList.getID");

			return id;
		};
	};

	var generateDropableObjectField = function() {

		console.log("RuleDesignerView.generateDropableObjectField");

		var ID = 'rd_rules';

		var Preview_ID = 'rd_rules_preview';

		var setConnector = function(_class, _rel) {
			var c = document.createElement('span');
			$(c).attr('rel', _rel);
			$(c).addClass('connector');
			$(c).addClass(_class);
			return c;
		};
		
		var buildPlaceholder = function(bool, _RULE_ID){
			
			var box = document.createElement('div');
			$(box).addClass('rule-obj-box');
			
			console.log(arguments);
			if(bool){
				$(box).append(setConnector('connector-left', _RULE_ID + '.actor'));
				$(box).attr('rel', _RULE_ID + '.actor');
			} else {
				$(box).append(setConnector('connector-right', _RULE_ID + '.sensor'));
				$(box).attr('rel', _RULE_ID + '.sensor');
			}
			
			var title = document.createElement('span');
			$(title).addClass('title');
			title.innerHTML = 'Placeholder';			
			$(box).append(title);
			
			$(box).addClass('placeholder');
			$(box).append('<p>This object will remove when first ' + ( bool ? 'actor' : 'sensor' ) + ' is dropped.</p>');
			return box;
		};

		var buildBox = function (_title, _obj) {
			var box = document.createElement('div');
			$(box).addClass('rule-obj-box');
			
			console.log(arguments);
			var _rel = ((arguments[2] !== undefined && arguments[2] != null) ? arguments[2] + '.': '') +_obj.getUID()
			$(box).attr('rel', _rel);
			
			$(box).append(setConnector('connector-left', _rel + '.prev'));
			$(box).append(setConnector('connector-right', _rel + '.follow'));
			$(box).append(setConnector('connector-top', _rel + '.up'));
			$(box).append(setConnector('connector-bottom', _rel + '.down'));
			
			var title = document.createElement('span');
			$(title).addClass('title');
			title.innerHTML = _title;			
			$(box).append(title);
			return box;
		};

		this.addRuleTab = function(_rule) {
			var div = document.createElement('div');
			div.id = 'Tab_' + _rule.getUID();
			div.setAttribute('rel', _rule.getUID());
			
			$(div).insertBefore('#' + Preview_ID);

			var li = document.createElement('li');
			$(li).html(
					'<a href="#Tab_' + _rule.getUID() + '"><span class="ui-icon ui-icon-close" role="presentation"></span>' + _rule.Name + '</a>');
			// alert($('li[rel="' + Preview_ID + '"]').html());
			$(li).insertBefore($('li[rel="' + Preview_ID + '"]'));

			$(li).each(function() {
				$(this).draggable({
					opacity: 0.5,
		            revert: true
				});
			});
			// $('#' + ID).tabs( "destroy" );
			// $('#' + ID).tabs( );

			// Refresh tabs
			$('#' + ID).tabs("refresh");
			
			// Refresch window - set the correct calculate size attributes to
			// the div tags
			$(window).trigger('resize');

			// Make new tab active
			$('#' + ID).tabs('option', 'active',
					$('#' + ID + ' > div ').length - 2);

		};

		this.init = function() {

			console.log("RuleDesignerView.generateDropableObjectField.init");

			var e = document.createElement('div');
			e.id = ID;

			var ul_tab = document.createElement('ul');

			var div_preview = document.createElement('div');
			div_preview.id = Preview_ID;

			var li_addRule = document.createElement('li');
			
			var a = document.createElement('a');
			a.id = "btnAddRule";
			$(a).attr({ "class": "ui-tabs-anchor", "role": "presentation", "tab-index": -1 });
			$(a).html('<span class="ui-icon ui-icon-plusthick" role="presentation"></span>AddRule');
			
			$(li_addRule).append(a);
			$(li_addRule).attr({ "class": "ui-state-default ui-corner-top", "role": "tab", "tab-index": -1 });		
			$(li_addRule).hover(
					  function() {
					    $( this ).addClass( "ui-state-hover" );
					    $( this ).css('cursor', 'pointer');
					  }, function() {
					    $( this ).removeClass( "ui-state-hover" );
					    $( this ).css('cursor', '');
					  }
					);
			
			var li_preview = document.createElement('li');
			$(li_preview)
					.html('<a href="#' + Preview_ID + '">JSON-Preview</a>');
			$(li_preview).attr('rel', Preview_ID);
			

			$(ul_tab).append(li_addRule);
			$(ul_tab).append(li_preview);

			$(e).append(ul_tab);
			$(e).append(div_preview);

			$(e).tabs();

			// e.setAttribute('ondrop', 'drop(event)');
			// e.setAttribute('ondragover', 'allowDrop(event)');
			return e;
		};

		this.setSize = function(height, width) {

			console.log("RuleDesignerView.generateDropableObjectField.setSize");

			toolbar.innerwidth = width;
			toolbar.innerheight = height;
		};

		this.getID = function() {
			console.log('CALL RuleDesignerView.generateDropableObjectField.getID')
			return id;
		};

		var actualizeRules = function(_rules) {
			console.log('CALL RuleDesignerView.generateDropableObjectField.actualizeRules')
			$.each(_rules, function(_key, _rule) {
				
				$('#Tab_' + _key).html("");
				
				if(_rule.getSensorList().getRootItem() == null){
					$('#Tab_' + _key).append(buildPlaceholder(false, _key));
					
				} else {
				$.each(_rule.getSensorList().getObjectsAsList(), function(_UNIQUE_ID, _obj) {
					$('#Tab_' + _key).append(buildBox(_obj.getItem()._UNIQUE_ID, _obj, _key));
				});
			}
				if(_rule.getActorList().getRootItem() == null){
					$('#Tab_' + _key).append(buildPlaceholder(true, _key));
				} else {
				
				$.each(_rule.getActorList().getObjectsAsList(), function(_UNIQUE_ID, _obj) {
					$('#Tab_' + _key).append(buildBox(_obj.getItem()._UNIQUE_ID, _obj, _key));
				});
				}
		//		$('#Tab_' + _key).append(ret);

			});
		};

		this.actualize = function(_rules) {
			console.log('RuleDesignerView.ObjField.actualize');
			console.log('call _controller.generateDisplayRuleData');
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

		$('body').append(toolbar.init());
		$('body').append(objList.init());
		$('body').append(objField.init());

		$('#btnAddRule').click(function(e) {
			_controller.newRule();
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
		
		$()
		
		// TODO - Schliesse TABs
		/*
		 * $('#rd_rules').delegate( "span.ui-icon-close", "click", function() {
		 * $(this) var ID = $( this ).closest( "li" ).remove().attr(
		 * "aria-controls" ); var UNIQUE_ID = $( '#' + ID
		 * ).remove().attr("rel"); $('rd_rules').tabs( "refresh" ); });
		 */
	    
	    $('#imgTrash').droppable( {
			tolerance: "touch",
			drop : function(event, ui) {
				obj = ui.draggable;
	    		if(obj.attr( "aria-controls" ) !== undefined){ // Drop Rule Tab
	    			var ID = obj.attr( "aria-controls" );
	    			obj._RULE_ID = $( '#' + ID ).remove().attr("rel");
	    		} else if( $(obj).parent().attr("rel") !== undefined)	{ // Drop Rule Elements
					console.log($(obj));
	    			obj._UNIQUE_ID = $(obj).attr("rel");
	    			obj._RULE_ID = $(obj).parent().attr("rel");
	    		}
				ui.draggable.remove();
				_controller.doEventAction("drop.trash", obj, event);
				
			}
		});

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
		var Rules = _controller.getRules();
		objList.actualize(_controller.getDevices(), Rules);
		objField.actualize(Rules);
		
		$('span.connector, div[rel$=".sensor"], div[rel$=".actor"]').droppable( {
			tolerance: "touch",
			drop : function(event, ui) {
				_controller.doEventAction( 'drop.ruleTarget', ui.draggable, event);
			}
		});
		
		$(window).trigger('resize');

	};

	this.init();

};

/**
 * Events
 */
/*
 * this.events = function() {
 * 
 * return this.events; };
 * 
 * this.allowDrop = function(ev) { ev.preventDefault(); };
 * 
 * this.drag = function(ev) { ev.dataTransfer.effectAllowed = 'move';
 * ev.dataTransfer.setData("Text", ev.target.id); };
 * 
 * this.drop = function(ev) { ev.preventDefault();
 * 
 * var rel = $( [ rel = ev.dataTransfer.getData("Text") ]);
 * 
 * console.log("DROP elements - doAction(" + rel + ")");
 * _controller.doEventAction(ev.dataTransfer.getData("Text")); };
 */