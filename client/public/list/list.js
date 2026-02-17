// popup user image
// function popupImage() {
//     let url = localStorage.getItem('image');
//     let type = localStorage.getItem("imagetype")
    
//     document.querySelector(".nav_profile_img").src = `data:${type};base64,${url}`;
//     document.querySelector(".popup_image").src = `data:${type};base64,${url}`;
// }
// popupImage()
let alluser = [], cur_user_pos, filter_user = []

async function get_user() {
    
    
    document.querySelector('.list_items').innerHTML = `<div class="loading_gif">
            <img src="/list/pictures/amalie-steiness.gif">
        </div>`

    let options = {
        method: 'POST',
        body : JSON.stringify({
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/list_filter", options);
    const responseJson = await response.json();
    alluser = responseJson.alluser

    cur_user_pos = 0
    list_filter()
}
get_user()



function few_user() {
    console.log("asche")
    let alluserhtml = ""
    
    for (let i = 0; i < 10 && cur_user_pos < filter_user.length; i++, cur_user_pos++) {
        let imgHtml;
        if(filter_user[cur_user_pos].hasOwnProperty("img")) {
            let val = btoa(new Uint8Array(filter_user[cur_user_pos].img.data.data).reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, ''));
            imgHtml = `<img src = "data:${filter_user[cur_user_pos].img.contentType};base64,${val}" alt="dp"></img>`
        }
        else {
            imgHtml = '<img src = "../pictures/Noimage.png">'
        }
        
        let html = `<div class="list_data" data-id=${filter_user[cur_user_pos]._id} onclick="show_user(this)">
            <div class="list_info list_profile">
                ${imgHtml}
                <div class="list_profile_info">
                    <div>
                        <p id = "list_profile_name">${filter_user[cur_user_pos].fname} ${filter_user[cur_user_pos].lname}</p>
                    </div>
                    <div>`
        for(let j = 1; j <= 5; j++) {
            if(filter_user[cur_user_pos].rating >= j) html += `<span class="fa fa-star checked"></span>`
            else html += `<span class="fa fa-star"></span>`
        }
        html += `<span id="list_profile_rating">(${filter_user[cur_user_pos].rating})</span>
                </div>
                </div>
            </div>
            <div class="list_info list_profession">
                <p>${filter_user[cur_user_pos].category}</p>
            </div>
            <div class="list_info list_location">
                <p>${filter_user[cur_user_pos].station},</p>
                <p>${filter_user[cur_user_pos].district},</p>
                <p>${filter_user[cur_user_pos].division}</p>
            </div>
            <div class="list_info list_contact">
                <p>${filter_user[cur_user_pos].phone}</p>
            </div>
        </div>`
        alluserhtml += html
    }
    document.querySelector('.list_items').innerHTML += alluserhtml
    if(cur_user_pos == filter_user.length) {
        document.querySelector('.load_more').style.display = "none"
    }
}

function list_filter() {
    
    cur_user_pos = 0

    const filterUser = []
    
    const division = document.getElementById('divisions').value,
    district = document.getElementById('distr').value,
    station = document.getElementById('polic_sta').value,
    category = document.getElementById('filter-category').value,
    searchValue = document.getElementById('searchValue').value.toLowerCase()

    for(let i = 0; i < alluser.length; i++) {
        if(division != "" && division != alluser[i].division) {
            continue;
        }
        if(district != "" && district != alluser[i].district) {
            continue;
        }
        if(station != "" && station != alluser[i].station) {
            continue;
        }
        if(category != "" && category != alluser[i].category) {
            continue;
        }
        let username = alluser[i].fname + " " + alluser[i].lname
        if(searchValue != "" && username.toLowerCase().search(searchValue) == -1) {
            continue;
        }
        filterUser.push(alluser[i])
    }


    const sortdir = document.getElementById('sort_order').value
    if(sortdir == "Ascending") {
        filterUser.sort((a, b) => {
            return a.rating - b.rating
        })
    }
    else {
        filterUser.sort((a, b) => {
            return b.rating - a.rating
        })
    }

    filter_user = filterUser
    document.querySelector('.load_more').style.display = "inherit"
    document.querySelector('.list_items').innerHTML = ""
    few_user()
}


function show_user(ev) {
    const id = ev.getAttribute("data-id");
    if(id == "") return;
    window.location.assign(`/profile/${id}`);
}
