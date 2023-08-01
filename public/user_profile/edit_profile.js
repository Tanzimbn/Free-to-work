
function edit_pp() {
    console.log("asche")
    document.querySelector('.pp__submit').click()
}
function edit_cp() {
    console.log("asche")
    document.querySelector('.cp__submit').click()
}
async function edit_profile() {
    let givenId = document.querySelector(".pd-img").getAttribute('data-givenId')
    let options = {
        method: 'POST',
        body : JSON.stringify({
            id: givenId
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    document.querySelector("#edit_status").innerHTML="processing...";
    const response = await fetch("/user_data", options);
    const data = await response.json();
    
    let nps = document.querySelector("#new-password").value
    let ops = document.querySelector("#old-password").value
    let bio = document.querySelector("#bio").value
    let cat = document.querySelector("#jobTags").value

    if(nps != "" && ops != data[0].password) {
        document.querySelector("#edit_status").innerHTML = "<p>Password is Wrong!</p>"
        setTimeout(function(){
            document.querySelector("#edit_status").innerHTML="";
        },1000);
        return
    }

    if(nps == "") nps = data[0].password
    if(bio == "") nps = data[0].bio
    if(cat == "") cat = data[0].category

    document.querySelector("#profile_bio").innerHTML = bio
    document.querySelector(".work_title").innerHTML = cat
    
    let edited = {
        method: 'POST',
        body : JSON.stringify({
            id : givenId,
            password : nps,
            bio: bio,
            category: cat
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    document.querySelector("#edit_status").innerHTML="Updating...";
    const nresponse = await fetch("/edit_user_info", edited);
    const ndata = await nresponse.json();
    document.querySelector("#edit_status").innerHTML="";
    editToggle()
}

const post_category = document.querySelector("#category_list");    
function show_all_category() {
    display_category_result(category);
}
function display_category_result(result){
    const content = result.map((list)=>{
        return `<option>${list}</option>`;
    });
    post_category.innerHTML = content.join('');
}
show_all_category();