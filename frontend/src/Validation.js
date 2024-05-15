export default function Validation(username, password, password1) {
    const errors = {};
    //Minimum eight characters, at least one letter and one number
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (username === "") {
        errors.username = "Username is required.";
    }

    if (password === "") {
        errors.password = "Password is required.";
    } else if (!password_pattern.test(password)) {
        errors.password = "Minimum eight characters, at least one letter and one number";
    }

    if (password1 === "") {
        errors.password1 = "Password is required.";
    } else if (password1 !== password) {
        errors.password1 = "Passwords must match";
    }

    return errors;

}