
export default (props, media) => {
    return (    
        <header>
            <div class="appearence-switch">
                <span class="appearance-icon-light appearance-icon"><img src={media.lightIcon} /></span>
                <span class="appearance-icon-dark appearance-icon"><img src={media.darkIcon} /></span>
            </div>
        </header>
    )
}