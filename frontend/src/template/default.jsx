import darkIcon from "../assets/media/darkmode.svg";
import lightIcon from "../assets/media/lightmode.svg";

export default (props) => {
    return (    
        <header>
            <div className="placeholder">

            </div>
            <nav>
                <ul>
                    <li><a href="">Home</a></li>
                    <li><a href="">Plans</a></li>
                    <li><a href="">Download</a></li>
                </ul>
            </nav>
            <div class="appearence-switch" style={{display: props.plan}}>
                <span className="appearance-icon-light appearance-icon"><img src={lightIcon} /></span>
                <span className="appearance-icon-dark appearance-icon"><img src={darkIcon} /></span>
            </div>
        </header>
    )
}