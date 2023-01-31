// const dotenv = require('dotenv');
// console.log(process.env.DATABASE);
const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/user/login',
            data: {
                email: email,
                password: password
            }
        });
        if (res.data.status == "success") {
            location.assign('/view');
        }
    } catch (err) {
        console.log(err.response.data.message);
        if (err.response.data.status == 'fail' || err.response.data.status == 'errors') {
            document.getElementById("error").innerHTML = err.response.data.message;
        }

    }
};

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let count = 0;
    if (email == "") {
        count++;
        document.getElementById("erroremail").innerHTML = "email is require";
    } else {
        document.getElementById("erroremail").innerHTML = " ";
    }
    if (password == "") {
        count++;
        document.getElementById("errorpassword").innerHTML = "Password is require";
    } else if (password.length < 6) {
        count++;
        document.getElementById("errorpassword").innerHTML = "Password should be more than 6 character";

    } else {
        document.getElementById("errorpassword").innerHTML = " ";
    }
    if (count == 0) login(email, password);
});