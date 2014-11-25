Helpers.LoadAjax = function (successCallback) {
	const URL_JSONLIST2 = 'http://localhost:8083/fhem';
	const GET_PARAM = {'cmd':'jsonlist2','XHR':'1'};
	const TYPE = 'GET';
	const TIMEOUT = 50000;

	$.ajax({
		success: function(data){
			successCallback(JSON && JSON.parse(data) || $.parseJSON(data))
		},
		type: TYPE,
		data: GET_PARAM,
		url: URL_JSONLIST2,
		timeout: TIMEOUT
	});
};