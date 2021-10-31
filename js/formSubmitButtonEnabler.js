const formSubmitButtonEnabler = function () {
    let userName = document.getElementById("userName").value;
    let userEmail = document.getElementById("userEmail").value;
    let userReason = document.getElementById("userReason").value;
    let submitButton = document.getElementById("submitButton");

    if (userName === "" || userEmail === "" || userReason === "") {
        submitButton.disabled = true;
    }
    else {
        submitButton.disabled = false;
    }
}

