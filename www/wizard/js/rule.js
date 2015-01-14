function generateRule() {
	var rule = '[{';
	
	rule += generateKeyValuePair("ID", getID())+",";
	rule += generateObject("PARAMS", generateParams(getID(), getDescription()) )+",";
	rule += generateObject("COND", generateConditions())+",";

	rule += generateArray("ACTION", generateActions(), "obj");
	
	rule += '';
	
	rule += '}]';
	
	return rule;
}

function generateActions() {
	return "";
}

function generateKeyValuePair(key, value) {
	return '"'+key+'":"'+value+'"';
}

function generateObject(key, parameters) {
	return '"'+key+'":{'+parameters+'}';
}

function generateArray(key, values, obj) {
	var vs = "";
	
	if (obj == "obj") {
		vs = $.map(values, function(n, i) { return '{'+n+'}'; });
	} else {
		vs = $.map(values, function(n, i) { return '"'+n+'"'; });
	}
	
	return '"'+key+'":['+vs+']';
}



function generateParams(name, descr) {
	return generateKeyValuePair("name", name)+","
		+generateKeyValuePair("descr", descr);
}

function generateConditions() {
	var cond = "";
	
	var ids = getSensorIDs();
	var c = new Array(ids.length);
	$.each(ids, function(i, item) {
		c[i] = generateCondition(getSensorName(item), 
				generateRefParam("==", getSensorValue(item)));
	});
	
	if(c.length > 1) {
		cond = generateGather("AND", c);
	} else {
		cond = c[0];
	}
	
	return cond;
}

function generateGather(log_gather, conditions) {
	return generateArray(log_gather, conditions, 'obj');
}

function generateCondition(sensor, ref_param) {
	return generateKeyValuePair("SENSOR", sensor)+","
		+generateObject("PARAMS", ref_param);
}

function generateRefParam(log_func, value) {
	var values = new Array(2);
	values[0] = log_func;
	values[1] = value;
	return generateArray("state", values);
}


function generateActions() {
	var ids = getActorIDs();
	var a = new Array(ids.length);
	
	$.each(ids, function(i, item) {
		a[i] = generateKeyValuePair("ACTOR", getActorName(item))+","
			+generateKeyValuePair("PARAMS", getActorValue(item));
	});
	
	return a;
}