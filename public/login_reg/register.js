function openpopup(){
    popup.classList.add("open-popup")
}
function verified() {
    popup.classList.add("open-popup")
    return false;
}
function closepopup() {
    popup.classList.remove("open-popup");
    window.location.assign("/login");
}

const form = document.getElementById("register_form")
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let p1 = document.getElementById('password').value,
    p2 = document.getElementById('confirmpassword').value;
    if(p1 != p2) {
        opennoti("passwords don't match!");
        return false;
    }
    if(document.getElementById('tc').value == "") {
        opennoti("You have to agree to the terms and conditions.");
        return;
    }
    let options = {
        method: 'POST',
        body : JSON.stringify({
            fname: document.getElementById('fname').value,
            lname: document.getElementById('lname').value,
            nid: document.getElementById('nid').value,
            gender: document.getElementsByName('gender').value,
            email : document.getElementById('email').value,
            password : p2,
            phone: document.getElementById('phone').value,
            division: document.getElementById('divisions').value,
            district: document.getElementById('distr').value,
            station: document.getElementById('polic_sta').value
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    console.log(options.body);
    const response = await fetch("/register", options);
    const data = await response.json();
    verified();
})
