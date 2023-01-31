const register = async (name, email, password, cpassword) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/user/signup',
            data: {
                name: name,
                email: email,
                password: password,
                confirm_password: cpassword
            }
        });
        console.log(res.data);
        if (res.data.status == "success") {
            location.assign('/view');
        }
    } catch (err) {
        if (err.response.data.message.startsWith("E11000")) {
            document.getElementById("error").innerHTML = "Email is already taken!!!";
        } else {
            document.getElementById("error").innerHTML = err.response.data.message;
        }

    }
};
document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const psw = document.getElementById('psw').value;
    const pswrepeat = document.getElementById('pswrepeat').value;
    let count = 0;
    if (email == "" || name == "" || psw == "" || pswrepeat == "") {
        count++;
        document.getElementById("error").innerHTML = "please fill out all the field";
    } else {
        document.getElementById("error").innerHTML = " ";


        if (psw.length < 6) {
            count++;
            document.getElementById("errorpassword").innerHTML = "Password should be more than 6 character";
        } else if (psw != pswrepeat) {
            count++;
            document.getElementById("errorpassword").innerHTML = "Password not match";
        } else {
            document.getElementById("errorpassword").innerHTML = " ";
        }
        if (count == 0) register(name, email, psw, pswrepeat);
    }
});