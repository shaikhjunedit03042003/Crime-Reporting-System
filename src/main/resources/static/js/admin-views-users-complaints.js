

//Update Complaints
document.addEventListener("DOMContentLoaded",function(){
	document.querySelectorAll(".update-btn").forEach(btn => {
		btn.addEventListener("click",function(){
			const id=this.dataset.id;
			console.log("complaintId==" + id);
			  window.location.href=`/onlinecrimereportingsystem/users/updatecomplaints/${id}`;
			  
		});
	});
});





document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.dataset.id;
            const confirmed = confirm("Are you sure you want to delete this complaint?");
            if (confirmed) {
                try {
                    const response = await fetch(`/onlinecrimereportingsystem/users/deletecomplaints/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        window.location.href = '/onlinecrimereportingsystem/users/viewallcomplaints';
                    } else {
                        const text = await response.text();
                        alert("Error: " + text);
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error deleting complaint.");
                }
            }
        });
    });
});



//Delete Complaints
/*
document.addEventListener("DOMContentLoaded",function(){
	document.querySelectorAll(".delete-btn").forEach(btn=>{
		btn.addEventListener("click",function(){
			const id=this.dataset.id;
			deleteComplaints(id);
		});
	});
	
});
*/
