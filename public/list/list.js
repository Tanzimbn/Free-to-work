async function list_filter() {
    const division = document.getElementById('divisions').value,
    district = document.getElementById('distr').value,
    station = document.getElementById('polic_sta').value,
    category = document.getElementById('filter-category').value,
    searchValue = document.getElementById('searchValue').value
    
    let options = {
        method: 'POST',
        body : JSON.stringify({
            division: division,
            district: district,
            station: station,
            category: category,
            searchValue : searchValue.toLowerCase()
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/list_filter", options);
    const responseJson = await response.json();
    const alluser = responseJson.filterUser
    console.log(alluser)
    // sort part
    // const sortdir = document.getElementById('sort_order').value
    // if(sortdir == "Ascending") {
    //     alluser.reverse()
    // }

    //html add
    let alluserhtml = ""
    console.log(alluser.length)
    for (let i = 0; i < alluser.length; i++) {
        let imgHtml;
        if(alluser[i].hasOwnProperty("img")) {
            let val = btoa(new Uint8Array(alluser[i].img.data.data).reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, ''));
            imgHtml = `<img src = "data:${alluser[i].img.contentType};base64,${val}" alt="dp"></img>`
        }
        else {
            imgHtml = '<img src = "../pictures/Noimage.png">'
        }
        
        let html = `<div class="list_data" data-id=${alluser[i]._id} onclick="show_user(this)">
            <div class="list_info list_profile">
                ${imgHtml}
                <div class="list_profile_info">
                    <div>
                        <p id = "list_profile_name">${alluser[i].fname} ${alluser[i].lname}</p>
                    </div>
                    <div>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star unchecked"></span>
                        <span id="list_profile_rating">(4.5)</span>
                    </div>
                </div>
            </div>
            <div class="list_info list_profession">
                <p>${alluser[i].category}</p>
            </div>
            <div class="list_info list_location">
                <p>${alluser[i].station},</p>
                <p>${alluser[i].district},</p>
                <p>${alluser[i].division}</p>
            </div>
            <div class="list_info list_contact">
                <p>${alluser[i].phone}</p>
            </div>
        </div>`
        alluserhtml += html
    }
    console.log("asche")
    document.querySelector('.list_items').innerHTML = alluserhtml
}
list_filter()

function show_user(ev) {
    const id = ev.getAttribute("data-id");
    if(id == "") return;
    window.location.assign(`/profile/${id}`);
}