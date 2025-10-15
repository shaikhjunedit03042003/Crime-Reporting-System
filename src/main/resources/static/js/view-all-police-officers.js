
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".delete-btn-policeofficer").forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.dataset.id;
            const confirmed = confirm("Are you sure you want to delete this Police Officers?");
            if (confirmed) {
                try {
					console.log("Come to PoliceOfficer Detele....");
                    const response = await fetch(`/onlinecrimereportingsystem/admins/addpoliceofficer/deletepoliceofficers/${id}`, {
                        method: 'DELETE'
                    });
					const text = await response.text();
                    if (response.ok) {
						alert("Success: " + text);
                        window.location.href = '/onlinecrimereportingsystem/admins/addpoliceofficer/viewsAllPoliceOfficers';
                    } else {
                        
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



