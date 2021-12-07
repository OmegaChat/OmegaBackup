function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    if(document.querySelector('.appearance-icon-light') && document.querySelector('.appearance-icon-dark') && document.querySelector('.appearence-switch') && document.querySelector('.App')) {
        if(document.querySelector('.App').getAttribute('data-plan') == 0) {
            //invertet
            document.querySelector('.appearence-switch').innerHTML = '';

            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                setLightMode();
            } else {
                setDarkMode();
            }
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                e.matches ? setLightMode() : setDarkMode();
            });
            console.log('only free')
        } else {
                // Switch
                document.querySelector('.appearence-switch').addEventListener('click', (event) => {
                    changeAppearence();
                })
            
                //Listener
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                    e.matches ? setDarkMode() : setLightMode();
                });
                initialize();
        }
        
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
    document.querySelector('.App').setAttribute('data-appearance', 'light');
    if(document.querySelector('.App').getAttribute('data-plan') != 0) {
        document.querySelector('.appearance-icon-dark').style.display = 'none';
        document.querySelector('.appearance-icon-light').style.display = 'block';
        document.cookie = "appearence=light";
    }
    document.querySelector('.App').classList.remove('dark');
    document.querySelector('.App').classList.add('light');
}

function setDarkMode() {
    document.querySelector('.App').setAttribute('data-appearance', 'dark');
    if(document.querySelector('.App').getAttribute('data-plan') != 0) {
        document.querySelector('.appearance-icon-dark').style.display = 'block';
        document.querySelector('.appearance-icon-light').style.display = 'none';
        document.cookie = "appearence=dark";
    }
    document.querySelector('.App').classList.remove('light');
    document.querySelector('.App').classList.add('dark');
}