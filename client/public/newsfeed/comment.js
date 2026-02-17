const showCont = document.querySelectorAll(".show_reply");

showCont.forEach((btn) =>
    btn.addEventListener("click", (e) => {
        let parent = e.target.closest('.comment_container');
        let _id = parent.id;
        if (_id) {
            let child = parent.querySelectorAll(`[dataset=${_id}]`);
            child.forEach((temp) =>
                temp.classList.toggle("opened")
            );
        }
    })
);

function show(temp) {
    var parentDiv = temp.parentNode.parentNode.parentNode;
    temp = parentDiv.getAttribute("id");
    let div = document.createElement('div');
    div.classList.add('comment_box');
    let nw_id = temp + "_reply";
    div.id = nw_id;
    let par = document.getElementById(temp);
    let child = document.getElementById(nw_id);



    if (par.contains(child)) {
        console.log(child);
        par.removeChild(child);
    }
    else {
        let form = `<form action="" id = "reply_form">
            <textarea name="message" placeholder="write comment" id = "comment_text"></textarea>
            <input type="submit">
            </form>`;
        div.insertAdjacentHTML('beforeend', form);
        par.appendChild(div);
    }

}