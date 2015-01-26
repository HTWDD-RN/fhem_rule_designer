/**
 * TODO
 */
var Events = function(view) {
	var _view = view

	var flags = {
		menu : false
	}
	var ID = {
		DRAGBAR : '#' + Configuration.GUI.DRAGBAR.ID,
		TOOLBAR : '#' + Configuration.GUI.TOOLBAR.ID,
		EDITOR : '#' + Configuration.GUI.EDITOR.ID,
		ADDS : '#' + Configuration.GUI.ADDITIONALS.ID
	}

	var enableTrigger = false
	/**
	 * 
	 */
	var triggerPos = function() {
		if (enableTrigger) {
			setTimeout(triggerPos, 10000)
		}
	}
	/**
	 * 
	 */
	var getParentRel = function(src){
		var rel = src.parent()
		var att = rel.attr('rel')
		if( att === undefined && $(src) != $(ID.EDITOR)){
			getParentRel($(src.parent()))
		}
		return rel
	}	
	/**
	 * TODO
	 */
	this.enableButtonEvents = function() {

		// Toolbar buttons
		$(ID.TOOLBAR + ' a:not(.inputLoad)').button()

		$('#btnNew').click(function(e) {
			e.preventDefault()
			$('input[name="txtMakro"]').removeAttr('disabled');
			_view.reset()
		});

		$('#inputLoad').click(function(e) {
			e.preventDefault()
			if (view.loadRule()) {
				// TODO -Resetting the GUI
				$('input[name="txtMakro"]').attr('disabled', 'disabled');
			}
		});

		$('#btnLoad').click(function(e) {
			e.preventDefault()
			$("#inputLoad").trigger('click');
			return false;
		});

		// $('#btnSave').click(function(e) {
		//
		// });

		$('#btnSaveAs').click(function(e) {
			e.preventDefault()
			// if (_view.saveAsRule()) {
			// $('input[name="txtMakro"]').attr('disabled', 'disabled');
			// }
		});

	}
	
	/**
	 * TODO
	 */
	this.enableMenuButton = function() {
		
		if ($("ul.ui-menu").size()){
			$('#menu.ui-menu').hide();
			flags.menu = false
			return
		}
		
		$("#menu-open").css({display:'block'})
		$("#menu").menu(); // activate menu
		$('#menu').show().hide();
		
		$('#menu-open').click(function(e) {
			e.preventDefault()
			if (!flags.menu) {
				$('#menu.ui-menu').show();
				flags.menu = true
			} else {
				$('#menu.ui-menu').hide();
				flags.menu = false
			}
		})

		$('#menu li').click(function(e) {
			e.preventDefault()
			$('#menu.ui-menu').hide();
			flags.menu = false
		})
		

	}
	
	/**
	 * TODO
	 */
	this.disableMenuButton = function() {
		
		if ($("ul.ui-menu").size()){ // is menu function activated
			$('#menu.ui-menu').hide()
			$("#menu-open").css({display:'none'})
			$("#menu.ui-menu").menu('destroy'); // deactivate menu
			$('#menu').css({display:'inline-block'})
			flags.menu = false
		}		
	
	}

	
	/**
	 * TODO
	 */
	this.enableAddButton = function() {
		$('#btnAddRule').click(function(e) {
			e.preventDefault()
			_view.addRule();
		});
	}

	/**
	 * Enable actualize object list by filter segmentions is changed
	 */
	 this.enableFilterSegmentation = function () {
	 		$(ID.ADDS + ' select.filter-seg').change(function () {
				_view.changeObjectList($(this).val())	 		
	 		})
	 }


	/**
	 * Function to enable trashing
	 */
	this.enableTrash = function() {
		$('#trash').droppable(
				{
					accept : ('.ui-tabs-active, .trashable'),
					drop : function(event, ui) {
						var src = $(ui.draggable)
						var parent = getParentRel(src)		
						var rel
						if($('a',src).attr('href') !== undefined) {
							var hash = $('a',src).attr('href').replace('#', '') 
							if ($('#' + hash).size() == 1) {
								rel = $('#' + hash).attr('rel')
							} else {
								rel = $(src).attr('rel')
							}
						} else {
							rel = $(src).attr('rel')
							// TODO: Change display
						}				
						if(!_view.removeElement(rel)) // removeData
							return false
												
						src.remove() // remove tab and other
						// elements
						if (hash != undefined && bool) { // the hash is use
															// for tabbing and
							// is equal to the partner container
							// id
							$('#' + hash).remove() // remove tab container
						}
						return true
					}
				})
	}

	/**
	 * 
	 */
	this.initializeTrashable =function(){
			var setup = {
				revert : true,
				start : function(event, ui) {
					Log('Drg start', ui, 5)
					$(ID.EDITOR).css({
						overflow : 'visible'
					})
					if (Configuration.DEBUG_LEVEL >= 5)
						enableTrigger = true
					triggerPos()
				},
				drag : function(event, ui) {
				},
				stop : function(event, ui) {
					$(ID.EDITOR).css({
						'overflow' : 'scroll'
					})
					enableTrigger = false
				},
				appendTo : '#trash',
				containment: 'window',
				scroll : false,
				zIndex : 9999
			}
			$('.trashable').draggable(setup)
	}

	/**
	 * 
	 */
	this.enableTrashable =function(obj){

			var setup = {
				revert : true,
				start : function(event, ui) {
					Log('Drg start', ui, 5)
					$(ID.EDITOR).css({
					// overflow : 'visible'
					})
					if (Configuration.DEBUG_LEVEL >= 5)
						enableTrigger = true
					triggerPos()
				},
				drag : function(event, ui) {
				},
				stop : function(event, ui) {
					$(ID.EDITOR).css({
						'overflow' : 'hidden'
					})
					enableTrigger = false
				},
				appendTo : '#trash',
				containment: 'window',
				scroll : false,
				zIndex : 9999
			}
			$(obj).draggable(setup)
	}
	
	/**
	 * Function to enables dragging
	 */
	this.enableItemDragging = function(elem) {

		var enableTrigger = false

		var setup = {
			revert : true,
			start : function(event, ui) {
				Log('Drg start', ui, 5)
				$(ID.DRAGBAR).css({
					overflow : 'visible'
				})
				if (Configuration.DEBUG_LEVEL >= 5)
					enableTrigger = true
				triggerPos()
			},
			drag : function(event, ui) {
			},
			stop : function(event, ui) {
				$(ID.DRAGBAR).css({
					'overflow-y' : 'scroll'
				})
				enableTrigger = false
			},
			appendTo : 'body',
			containment: 'window',
			scroll : false,
			zIndex : 9999
		}
		$(elem).draggable(setup)
	}

	/**
	 * Function to disables dragging
	 */
	this.disableItemDragging = function(elem) {
		$(elem).draggable('disable')
	}
	
	/**
	 * A generalized function for enableDrop of an specific element
	 * 
	 * @param ui
	 * @param accepts
	 */
	this.enableDropElementsRule = function() {
		var DROP_CLASSES = {
				'.drop-condition': "'.drag-gather', '.drag-sensor'",
				'.drop-gather': "'.drag-gather, .drag-sensor'",
				'.drop-vdev-cond': "'.drag-vdev-sensor'",
				'.drop-vdev': "'.drag-vdev'",
				'.drop-action':  "'.drag-actor, .drag-actorgroup'",
				'.drop-actor': "'.drag-actor'",
				'.drop-vdev-actorgroup': "'.drag-actor-vdev'"
		}
		
		var drop = function(event, ui) {
		Log('DROP: ',$(ui.draggable), $(event), 5)
		var id = $($(ui.draggable)[0]).attr('id')
		var rel = $($($(event)[0].target)[0]).attr('rel')
		var parent = getParentRel($($(event)[0].target))
		alert(parent.html())
		var type = $($($(event)[0].target)[0])
		if(id !== undefined && rel !== undefined){
			var disp = _view.addElement(rel, id, type)
		//	$(parent).html($(disp).html())
		//	_view.actualize() // Refresh JSON-Preview
			return true
		}
		return false
		}
	
		for(key in DROP_CLASSES){
			cmd = '$("'+key+'")'
			var setup = '{drop: drop, accept: ('+DROP_CLASSES[key]+')}'
			cmd+='.droppable('+setup+')'
	// Log(cmd)
			eval(cmd)
		}
	}

	
	/**
	 * TODO
	 */
	this.enableAddActionGroupOnClick = function(){
		$('.obj_actions .placeholder').click(function(e){
			e.preventDefault()
			var rel = $(this).attr('rel')
			var disp = _view.addElement(rel, 'Actorsgroup')
			$(this).parent().html($(disp).html())
			_view.actualize() // Refresh JSON-Preview
		})
	}
	
}