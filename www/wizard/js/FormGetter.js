function getID() {
	return $("#input_rule_name").val();
}

function getDescription() {
	return $("#input_rule_descr").val();
}


/*****************
 * 
 * SENSOR GETTER
 * 
 *****************/
function getSensorIDs() {
	return $.map($('.sensor_list'), function(n, i) { return $(n).attr('id'); });
}

function getSensorName(id) {
	return $('.'+id+'.sensor_name').text();
}

function getSensorValue(id) {
	var value = "";
	
	if ($('.'+id+'.sensor_value').is('select')) {
		value = $('.'+id+".sensor_value option:selected").val();
	} else {
		value = $('.'+id+'.sensor_value').val();
	}
	
	return value;
}

/*****************
 * 
 * ACTOR GETTER
 * 
 *****************/
function getActorIDs() {
	return $.map($('.actor_list'), function(n, i) { return $(n).attr('id'); });
}

function getActorName(id) {
	return $('.'+id+'.actor_name').text();
}

function getActorValue(id) {
	var value = "";
	
	if ($('.'+id+'.actor_value').is('select')) {
		value = $('.'+id+".actor_value option:selected").val();
	}
	
	return value;
}

function getConditions() {
	$("#new_rule_if_and_list");
}