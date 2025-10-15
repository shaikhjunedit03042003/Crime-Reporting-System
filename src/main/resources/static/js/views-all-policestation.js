
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async function() {
            const id = this.dataset.id;
            const confirmed = confirm("Are you sure you want to delete this Police Station?");
            if (confirmed) {
                try {
                    const response = await fetch(`/onlinecrimereportingsystem/admins/deletepolicestation/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        window.location.href = '/onlinecrimereportingsystem/admins/viewpolicestation';
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



