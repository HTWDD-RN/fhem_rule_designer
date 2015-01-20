function printListOfSensors() {
	var url = FHEM_URL+"?cmd=jsonlist2&XHR=1";
	$.getJSON( url, function( data ) {
		$.each( data.Results, function( i, item ) {
			var cnt = $.map(item.Readings, function(n, i) { return i; }).length;
			
			if(cnt > 0) {
				$( "<option>" )
					//.attr("Readings", item.Readings)
					//.attr("Attributes", item.Attributes)
					.attr("Name", item.Name).text( item.Name ).appendTo( "#input_sensors" );
			}
		})
	});
}

function printSensor() {
	var device = $( "#input_sensors option:selected" ).attr("Name");
	var url = FHEM_URL+'?cmd=jsonlist2%20'+device+'&XHR=1';

	$.getJSON( url, function( data ) {
		var device = data.Results[0];
		var id = device.Name + Math.floor(Math.random() * 100);
		
		var template = '<div class="device_list sensor_list" id="'+id+'">'; 
		template += '<span class="device sensor_name '+id+'">'+ device.Name +'</span>';
		template += '<select class="device_reading '+id+'" name="select_device_reading_'+ id +'" size="1">';
		
		$.each( device.Readings, function( i, item ) {
			template += '<option value="'+ i +'">';
			template += i;
			template += '</option>';
		});
		
		template += '</select> ist gleich ';
		
		if(device.PossibleSets) {
			template += '<select class="sensor_value '+id+'" id="input_device_reading_'+ id +'">';
			
			$.each( device.PossibleSets.split(" "), function( i, item ) {
				var str = item.split(":")[0];
				if(str.length > 0 && str != " ") {
					template += '<option value="'+ item +'">';
					template += item.split(":")[0];
					template += '</option>';
				}
			})
			
			template += '</select>';
		} else {
			template += '<input class="sensor_value '+id+'" type="text" id="input_device_reading_'+ id +'" />';
		}

		template += '<input type="button" value="entfernen" onclick="deleteById('+id+')" />';
		template += '</div>';
		
		$(template).appendTo("#new_rule_if_and_list")
	});
}

function printListOfActors() {
	var url = FHEM_URL+"?cmd=jsonlist2&XHR=1";
	$.getJSON( url, function( data ) {
		$.each( data.Results, function( i, item ) {
			var cnt = item.PossibleSets.split(" ").length;
			
			//if(cnt > 0) {
			if(item.PossibleSets) {
				$( "<option>" )
					//.attr("Readings", item.Readings)
					//.attr("Attributes", item.Attributes)
					.attr("Name", item.Name).text( item.Name ).appendTo( "#input_actors" );
			}
		})
	});
}

function printActor() {
	var device = $( "#input_actors option:selected" ).attr("Name");
	var url = FHEM_URL+'?cmd=jsonlist2%20'+device+'&XHR=1';

	$.getJSON( url, function( data ) {
		var device = data.Results[0];
		var id = device.Name + Math.floor(Math.random() * 100);
		
		var template = '<div class="device_list actor_list" id="'+id+'">'; 
		template += 'Setze <span class="device actor_name '+id+'">'+ device.Name +'</span> auf';
		template += '<select class="device_set actor_value '+id+'" name="select_device_set_'+ id +'" size="1">';
		
		$.each( device.PossibleSets.split(" "), function( i, item ) {
			var str = item.split(":")[0];
			if(str.length > 0 && str != " ") {
				var v = item.split(":")[0];
				template += '<option value="'+ v +'">';
				template += v
				template += '</option>';
			}
		});
		
		template += '</select> ';
		
		template += '<input type="button" value="entfernen" onclick="deleteById('+id+')" />';
		template += '</div>';
		
		$(template).appendTo("#new_rule_then_and_list")
	});
}

function deleteById(id) {
	$(id).remove();
}

function printRule() {
	var rule = generateRule();
	
	postRule(rule);
	
	//$("#rule_text").text(rule);
}

function postRule(rule) {
	var url = CGI_RUL+"?q=define";
	var data = "json="+encodeURIComponent(rule);
	
	$.post(url, data, function() {
		//$("#rule_text").text(rule);
	});
}



function refresh() {
	$('#rulelist').text("");
	loadRulelist();
}

function activateRule(ruleID) {
	var url = CGI_RUL+"?q=activate";
	var data = "id="+encodeURIComponent(ruleID);
	
	$.post(url, data, function() {});
	
	refresh();
}

function deactivateRule(ruleID) {
	var url = CGI_RUL+"?q=deactivate";
	var data = "id="+encodeURIComponent(ruleID);
	
	$.post(url, data, function() {});
	
	refresh();
}

function deleteRule(ruleID) {
	var url = CGI_RUL+"?q=delete";
	var data = "id="+encodeURIComponent(ruleID);
	
	$.post(url, data, function() {});
	
	refresh();
}

function loadRulelist() {
	var url = CGI_RUL+"?q=rulelist";
	
	$.getJSON( url, function( data ) {
		//$("#rulelist").text(data);
		$.each( data, function( i, item ) {
				var state;
				var stateclass;
			
				switch(item.STATE) {
			    case "1":
			        state = "aktiv";
			        stateclass = "active";
			        break;
			    case "0":
			    	state = "deaktiviert";
			    	stateclass = "deactive";
			        break;
			    default:
			    	state = "undefiniert";
			    	stateclass = "conflict";
				} 
			
				var template = '<div class="rule">';
				template += '<p class = "rulename '+stateclass+'">'+ item.NAME +' ('+ state +')</p>';
				template += '<p class = "ruledescription">'+ item.DESCRIPTION +'</p>';
				template += '<p class = "rulelistmenu">';
				template += '<span>bearbeiten</span>';
				
				if(item.STATE == "1")
					template += '<span onclick="deactivateRule(\''+ item.NAME +'\')">deaktivieren</span>';
				
				if(item.STATE == "0")
					template += '<span onclick="activateRule(\''+ item.NAME +'\')">aktivieren</span>';
				
				template += '<span onclick="deleteRule(\''+ item.NAME +'\')">löschen</span>';
				template += '</p></div>';
				$(template).appendTo( "#rulelist" );
			})
	});
}