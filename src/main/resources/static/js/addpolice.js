console.log("Loading PoliceStation");
$(document).ready(function() {
	$.ajax(
		{url:'/onlinecrimereportingsystem/admins/allpolicestation',
			method:"GET",
			dataType:"json",
			headers:{
				"Accept": "application/json"
			},
			success:function(responseJson){
				var $select=$('#policeStationselect');
				$select.find('option').remove();
				$('<option>').val("0").text("Select Police Station").appendTo($select);
				if(responseJson && Object.keys(responseJson).length>0){
					$.each(responseJson,function(key,value){
						$('<option>').val(key).text(value).appendTo($select);
					});
				}else{
					console.warn("No Police Station Are Available.....");
				}
				
			},error:function(xhr,status,error){
				console.error("Failed to fetch Police Station....",status,error);
			}
			
		});
});