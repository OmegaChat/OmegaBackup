
export default (props, media) => {
    return (    
        <header>
            <nav>
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="">Plans</a></li>
                    <li><a href="">Download</a></li>
                </ul>
            </nav>
            <div class="appearence-switch">
                <span class="appearance-icon-light appearance-icon"><img src={media.lightIcon} /></span>
                <span class="appearance-icon-dark appearance-icon"><img src={media.darkIcon} /></span>
            </div>
        </header>
    )
}