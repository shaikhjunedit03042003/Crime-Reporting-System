$(document).ready(function() {
    console.log("Loading crime types...");
    $.ajax({
        url: '/onlinecrimereportingsystem/users/allcrimetypes',
        method: "GET",
        dataType: "json", 
        headers: {
            "Accept": "application/json"
        },
        success: function(responseJson) {
            var $select = $('#crimeType');
			var $selecttext = $('#crimeType').val();
            $select.find('option').remove();
			if($selecttext!=0){
			$('<option>').val($selecttext).text($selecttext).appendTo($select);
			}
			else{
				$select.find('option').remove();
				$('<option>').val("0").text("Select a Crime Type").appendTo($select);
			}
           
            if (responseJson && Object.keys(responseJson).length > 0) {
                $.each(responseJson, function(key, value) {
					
                    $('<option>').val(value).text(value).appendTo($select);
               
					 });
            } else {
                console.warn("No crime types received from server.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch crime types:", status, error);
            alert("Error loading crime types. Please try again later.");
        }
    });
	console.log("Loading PoliceStation");
	$.ajax(
		{url:'/onlinecrimereportingsystem/users/allpolicestation',
			method:"GET",
			dataType:"json",
			headers:{
				"Accept": "application/json"
			},
			success:function(responseJson){
				var $select=$('#policeStation');
				var $selecttext=$('#policeStation').val();

				$select.find('option').remove();
				if($selecttext!=0){
					$('<option>').val($selecttext).text($selecttext).appendTo($select);

					
				}
				else{	
					$select.find('option').remove();			
				$('<option>').val("0").text("select a Police Station").appendTo($select);
				}
				if(responseJson && Object.keys(responseJson).length>0){
					$.each(responseJson,function(key,value){

						
						$('<option>').val(value).text(value).appendTo($select);
					
					});
				}else{
					console.warn("No Police Station Are Available.....");
				}
				
			},error:function(xhr,status,error){
				console.error("Failed to fetch Police Station....",status,error);
			}
			
		});
});