        function getLocationAndSend() {
			console.log("Me come in the Livwe Location ");
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    fetch("/onlinecrimereportingsystem/users/save-location", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: `latitude=${lat}&longitude=${lon}`
                    })
                    .then(response => response.text())
                    .then(data => {
                        //document.getElementById("liveLocationLink").innerHTML = data;  this for Element 
						document.getElementById("liveLocationLink").value = data;
						console.log("Live Location Link :="+data);

						alert("Live Location Link :="+data);

						 });
                   
                });
            } else {
				console.log("Geolocation is not supported by this browser");
                alert("Geolocation is not supported by this browser.");
            }
        }
