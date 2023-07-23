async function apply_filter() {
    const price_min = document.getElementById('filter-price-min').value,
    price_max = document.getElementById('filter-price-max').value,
    division = document.getElementById('divisions').value,
    district = document.getElementById('distr').value,
    station = document.getElementById('polic_sta').value,
    category = document.getElementById('filter-category').value,
    searchValue = document.getElementById('searchValue').value
    
    let options = {
        method: 'POST',
        body : JSON.stringify({
            price_min: price_min,
            price_max: price_max,
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
    const response = await fetch("/post_filter", options);
    const responseJson = await response.json();
    const allpost = responseJson.filterPost
    for (let i = 0; i < allpost.length; i++) {
        allpost[i]["time_ago"] = responseJson.time_ago[i]
    }

    // sort part
    const sorton = document.getElementById('sort_type').value
    const sortdir = document.getElementById('sort_order').value
    if(sorton == "Date") {
        if(sortdir == "Descending") {
            allpost.reverse()
            responseJson.time_ago.reverse()
        } 
    }
    else {
        if(sortdir == "Ascending") {
            allpost.sort((a, b) => {
                return a.budget - b.budget
            })
        }
        else {
            allpost.sort((a, b) => {
                return b.budget - a.budget
            })
        }
    }

    //html add
    let allposthtml = ""
    for (let i = 0; i < allpost.length; i++) {
        let html = `<div class="post-content">
            <div class="heading" onclick="show_details(this)" data-id="${allpost[i]._id}">
                <p>${allpost[i].title}</p>
            </div>
            <div class="budget">
                <p>Est. budget: ${allpost[i].budget} BDT</p>
                <p>.</p>
                <p>Posted : ${allpost[i].time_ago}</p>
            </div>
            <div class="details">
                <p>${allpost[i].detail.substring(0, 100)}<span id="dots"> ...</span><button onclick="see_more(this)"
                        id="see_more">more</button><span id="more_details">${allpost[i].detail.substring(100)}</span>
                    <button onclick="see_less(this)" id="see_less">see less</button>
                </p>
            </div>
            <div class="post_tag">
                <ul>
                    <li>${allpost[i].category}</li>
                </ul>
            </div>
            <div class="location">
                <i class="fa-solid fa-location-dot"></i>
                <p>${allpost[i].division}</p>
            </div>
        </div>`
        allposthtml += html
    }
    
    document.querySelector('.post').innerHTML = allposthtml
}