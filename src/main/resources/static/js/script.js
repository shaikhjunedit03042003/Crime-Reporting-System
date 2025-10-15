// Wait until DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const roleElement = document.getElementById('role');
    console.log("roleElement===", roleElement);
    const secretKeyField = document.getElementById('secretKeyField');
    const secretKeyForPolice = document.getElementById('secretKeyForPolice');

    function toggleSecretKeyField() {
        if (secretKeyField) {
            secretKeyField.style.display = roleElement.value === 'ADMIN' ? 'block' : 'none';
        }
        if (secretKeyForPolice) {
            secretKeyForPolice.style.display = roleElement.value === 'POLICE' ? 'block' : 'none';
        }
    }

    toggleSecretKeyField();
    roleElement.addEventListener('change', toggleSecretKeyField);
});
// Request OTPaa
function requestOTP() {
    const emailid = document.getElementById('emailid').value;
    const otpField = document.getElementById('otpField'); // container div for OTP input + verify button
    const sendOtpButton = document.getElementById('sendOTPButton');

    if (!emailid || !/^\S+@\S+\.\S+$/.test(emailid)) {
        alert("Please enter a valid email address.");
        return;
    }

    sendOtpButton.disabled = true;
    sendOtpButton.textContent = "Sending OTP...";

    fetch(`/onlinecrimereportingsystem/otp/signup/send_otp?email=${encodeURIComponent(emailid)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (otpField) otpField.style.display = "block"; // show OTP input section
                sendOtpButton.disabled = false;
                sendOtpButton.textContent = "OTP Sent";
                sendOtpButton.style.backgroundColor = ""; // reset style
                alert("OTP sent to your email!");
            } else {
                alert(data.errorMessage || "Failed to send OTP. Please try again.");
                sendOtpButton.disabled = false;
                sendOtpButton.textContent = "Send OTP";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while sending OTP!");
            sendOtpButton.disabled = false;
            sendOtpButton.textContent = "Send OTP";
        });
}

// Verify OTP
document.addEventListener("DOMContentLoaded", function () {
    const verifyBtn = document.getElementById("verifyOtpButton");

    if (verifyBtn) {
        verifyBtn.addEventListener("click", function () {
            const otp = document.getElementById("otp").value.trim();
            const submitButton = document.getElementById('submitButton');
            const sendOtpButton = document.getElementById('sendOTPButton');
            const otpError = document.getElementById('otpError');

            if (otp.length !== 6) {
                alert("Please enter a valid 6-digit OTP.");
                return;
            }

            fetch('/onlinecrimereportingsystem/otp/signup/verify_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: document.getElementById("emailid").value,
                    otp: otp
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        sendOtpButton.disabled = false;
                        sendOtpButton.textContent = "OTP Verified ✅";
                        sendOtpButton.classList.remove("btn-warning", "btn-primary");
                        sendOtpButton.classList.add("btn-success");

                        submitButton.disabled = false;
                        otpError.style.display = "none";

                        alert("OTP Verified Successfully  !!!!!!");
                    } else {
                        submitButton.disabled = true;
                        otpError.style.display = "block";
                        sendOtpButton.classList.remove("btn-success");
                        sendOtpButton.classList.add("btn-warning");

                        alert("Invalid OTP! Please try again.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    otpError.style.display = "block";
                    submitButton.disabled = true;
                    alert("An error occurred while verifying OTP.");
                });
        });
    }
});
