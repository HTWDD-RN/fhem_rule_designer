/**
 * 
 */

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function loadRuleparams() {
	if(getUrlParameter("id")) {
		
		var url = CGI_RUL+"?q=getrule";
		var data = "id="+encodeURIComponent(getUrlParameter("id"));
		
		$.post(url, data, function(data) {
			setID(data)
			setDescription(data);
			
			data.ACTION.forEach(function(entry) {
				printModifyActor(entry);
			});
			
			if(data.COND) {
				if(data.COND.AND) {
					data.COND.AND.forEach(function(entry) {
						printModifySensor(entry);
					});
				} else {
					printModifySensor(data.COND)
				}
			}
		});
		
	}
	
}

function setID(rule) {
	$("#input_rule_name").val(rule.ID);
}

function setDescription(rule) {
	
	$("#input_rule_descr").val(rule.PARAMS.descr);
}

function printModifySensor(device) {
	var url = FHEM_URL+'?cmd=jsonlist2%20'+device.SENSOR+'&XHR=1';

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

function printModifyActor(device) {
	var url = FHEM_URL+'?cmd=jsonlist2%20'+device.ACTOR+'&XHR=1';

	$.getJSON( url, function( data ) {
		var device = data.Results[0];
		id = device.Name + Math.floor(Math.random() * 100);
		
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
		
		return id;
	});
}