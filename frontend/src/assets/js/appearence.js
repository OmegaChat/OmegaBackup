function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {

    if(document.querySelector('.appearance-icon-light') && document.querySelector('.appearance-icon-dark') && document.querySelector('.appearence-switch') && document.querySelector('.App')) {
        // Switch
        document.querySelector('.appearence-switch').addEventListener('click', (event) => {
            changeAppearence();
        })
    
        //Listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            e.matches ? setDarkMode() : setLightMode();
        });
        initialize();
    } else {
        console.log('could not load, because not are elements are placed')
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function initialize() {
    const currentAppearence = document.querySelector('.App').getAttribute('data-appearance');
    if(!currentAppearence) {
        console.log(getCookie('appearence'))
        if(getCookie('appearence')) {
            if(getCookie('appearence') == 'dark') {
                setDarkMode();
            } else if(getCookie('appearence') == 'light') {
                setLightMode();
            } else {
                if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    setDarkMode();
                } else {
                    setLightMode();
                }
            }
        } else {
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setDarkMode();
            } else {
                setLightMode();
            }
        }
    }
}

function changeAppearence() {
    if(document.querySelector('.App').getAttribute('data-appearance') == 'dark') {
        setLightMode();
    } else {
        setDarkMode();
    }
}  

function setLightMode() {
    if(document.querySelector('.App').getAttribute('data-appearance-invertet') == false) {
        setRealLightMode();
    } else {
        setRealDarkMode();
    }
}

function setDarkMode() {
    if(document.querySelector('.App').getAttribute('data-appearance-invertet') == false) {
        setRealDarkMode();
    } else {
        setRealLightMode();
    }
}

function setRealLightMode() {
    document.querySelector('.App').setAttribute('data-appearance', 'light');
    document.querySelector('.appearance-icon-dark').style.display = 'none';
    document.querySelector('.appearance-icon-light').style.display = 'block';
    document.querySelector('.App').classList.remove('dark');
    document.querySelector('.App').classList.add('light');
    document.cookie = "appearence=light";
}

function setRealDarkMode() {
    document.querySelector('.App').setAttribute('data-appearance', 'dark');
    document.querySelector('.appearance-icon-dark').style.display = 'block';
    document.querySelector('.appearance-icon-light').style.display = 'none';
    document.querySelector('.App').classList.remove('light');
    document.querySelector('.App').classList.add('dark');
    document.cookie = "appearence=dark";
}