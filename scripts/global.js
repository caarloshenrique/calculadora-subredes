function goTo(page) {
    if(page == 'home'){
        window.location.assign("#");
    }
    if(page == 'ip'){
        window.location.assign("pages/ip.html");
    }
    if(page == 'sub-net'){
        window.location.assign("pages/sub-net.html");
    }
}

function goToForSubnet(page) {
    if(page == 'home'){
        window.location.assign("../index.html");
    }
    if(page == 'ip'){
        window.location.assign("../pages/ip.html");
    }
    if(page == 'sub-net'){
        window.location.assign("#");
    }
}

function goToForIp(page) {
    if(page == 'home'){
        window.location.assign("../index.html");
    }
    if(page == 'ip'){
        window.location.assign("#");
    }
    if(page == 'sub-net'){
        window.location.assign("../pages/sub-net.html");
    }
}