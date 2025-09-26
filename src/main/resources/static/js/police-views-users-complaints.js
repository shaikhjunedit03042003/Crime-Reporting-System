    $(document).ready(function() {
        // Fetch and populate crime types
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
                $select.find('option').remove();
                // Add default option
                $('<option>').val("0").text("Select a Crime Type").appendTo($select);

                if (responseJson && Object.keys(responseJson).length > 0) {
                    $.each(responseJson, function(key, value) {
                        // Create option and check if it matches the Thymeleaf field value
                        var $option = $('<option>').val(key).text(value);
                        if (key === $select.attr('value')) {
                            $option.prop('selected', true); // Pre-select if matches
                        }
                        $option.appendTo($select);
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

        // Fetch and populate police stations
        console.log("Loading Police Stations...");
        $.ajax({
            url: '/onlinecrimereportingsystem/users/allpolicestation',
            method: "GET",
            dataType: "json",
            headers: {
                "Accept": "application/json"
            },
            success: function(responseJson) {
                var $select = $('#policeStation');
                $select.find('option').remove();
                // Add default option
                $('<option>').val("0").text("Select a Police Station").appendTo($select);

                if (responseJson && Object.keys(responseJson).length > 0) {
                    $.each(responseJson, function(key, value) {
                        // Create option and check if it matches the Thymeleaf field value
                        var $option = $('<option>').val(key).text(value);
                        if (key === $select.attr('value')) {
                            $option.prop('selected', true); // Pre-select if matches
                        }
                        $option.appendTo($select);
                    });
                } else {
                    console.warn("No Police Stations available.");
                }
            },
            error: function(xhr, status, error) {
                console.error("Failed to fetch Police Stations:", status, error);
            }
        });
    });
