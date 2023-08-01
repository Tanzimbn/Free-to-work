const toggleNoti = document.querySelector('.noti');
async function notiToggle(){
    document.querySelector('.fa-solid').classList.remove('taken')
    toggleNoti.classList.toggle('active');
}
function notiseen(ev) {
    ev.classList.remove('unseen')
}