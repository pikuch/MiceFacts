'use strict';

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

const validateName = function () {
    let userName = document.getElementById("userName").value;
    let errorMessageElement = document.getElementById("invalidNameMessage");

    let validators = [
        { name: "not only whitespace", regex: /^\s*\S+.*$/, message: "Name must contain non-whitespace characters" },
        { name: "only letters and spaces", regex: /^[A-Za-z ]+$/, message: "Name must contain only letters and spaces" },
        { name: "capitalized words", regex: /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/, message: "Each word in name must be capitalized" },
        { name: "up to 20 characters", regex: /^.{1,20}$/, message: "Name lenght must not exceed 20 characters"}
    ];

    for (let index = 0; index < validators.length; index++) {
        if (!(userName).match(validators[index].regex)) {
            errorMessageElement.innerHTML = validators[index].message;
            return false;
        }
    }

    errorMessageElement.innerHTML = "";
    return true;
}

const validateEmail = function () {
    let userEmail = document.getElementById("userEmail").value;
    let errorMessageElement = document.getElementById("invalidEmailMessage");

    let validators = [
        { name: "not only whitespace", regex: /^\s*\S+.*$/, message: "Email must contain non-whitespace characters" },
        { name: "valid email address", regex: /^[A-Z0-9_!#$%&'*+/=?`{|}~^-]+(?:\.[A-Z0-9_!#$%&'*+/=?`{|}~^-]+)*@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*$/i, message: "Email must be valid" }
    ];

    for (let index = 0; index < validators.length; index++) {
        if (!(userEmail).match(validators[index].regex)) {
            errorMessageElement.innerHTML = validators[index].message;
            return false;
        }
    }

    errorMessageElement.innerHTML = "";
    return true;
}

const clearForm = function () {
    let nameInput = document.getElementById("userName");
    let emailInput = document.getElementById("userEmail");
    let reasonInput = document.getElementById("userReason");
    nameInput.value = "";
    emailInput.value = "";
    reasonInput.value = "";
}

const verifyAndSend = function () {
    let nameIsValid = validateName();
    let emailIsValid = validateEmail();
    if (nameIsValid && emailIsValid) {
        alert("Message has been sent.");
        clearForm();
    }
}