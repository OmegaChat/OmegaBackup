
export default (props, media) => {
    return (    
        <main>
            <div className="sign-container">
                <div className="sign-title">
                    OMEGA-GROUP
                </div>
                <form>
                    <div className="email">
                        <input type="text" id="emailInput" placeholder="Enter Email"/>
                        <label htmlFor="emailInput">Email</label>
                    </div>
                    <div className="username">
                        <input type="text" id="usernameInput" placeholder="Enter Username"/>
                        <label htmlFor="usernameInput">Username</label>
                    </div>
                    <div className="password">
                        <input type="password" id="passwordInput" placeholder="Enter Password"/>
                        <label htmlFor="passwordInput">Password</label>
                    </div>
                    <div className="passwordRepeat">
                        <input type="password" id="passwordInputRepeat" placeholder="Repeat your Password"/>
                        <label htmlFor="passwordInputRepeat">Password</label>
                    </div>
                    <div className="submit">
                        <input type="submit" id="submit" value="Submit"/>
                    </div>
                </form>
            </div>
        </main>
    )
}