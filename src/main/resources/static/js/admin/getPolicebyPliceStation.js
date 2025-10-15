$(document).ready(function () {

    // Function to load Police Officers based on police station value
    function loadPoliceOfficers(policeStationValue) {
        if (!policeStationValue || policeStationValue.trim() === "") {
            console.log("No Police Station provided, skipping AJAX call.");
            return;
        }

        console.log("Loading Police Officers for:", policeStationValue);

        $.ajax({
            url: '/onlinecrimereportingsystem/admins/adminhandlecomplaints/policeofficerbtstation',
            method: "GET",
            data: { policeStation: policeStationValue },
            dataType: "json",
            headers: {
                "Accept": "application/json"
            },
            success: function (responseJson) {
                var $select = $('#policeOfficers');
                $select.empty();

                // Default option
                $('<option>').val("0").text("Select a Police Officer").appendTo($select);

                // Populate list
                if (responseJson && Object.keys(responseJson).length > 0) {
                    $.each(responseJson, function (key, value) {
                        $('<option>').val(key).text(value).appendTo($select);
                    });
                } else {
                    console.warn("No Police Officers received from server.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Failed to fetch Police Officers:", status, error);
                alert("Error loading Police Officers. Please try again later.");
            }
        });
    }

    // 🔹 Trigger when user changes or types in Police Station
    $('#policeStation').on('change input', function () {
        var policeStationValue = $(this).val();
        loadPoliceOfficers(policeStationValue);
    });

    // 🔹 Also trigger automatically when page loads (for default value)
    var initialValue = $('#policeStation').val();
    if (initialValue && initialValue.trim() !== "") {
        console.log("Page loaded with Police Station:", initialValue);
        loadPoliceOfficers(initialValue);
    }
});
