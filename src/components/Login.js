import "../assets/css/login.css";

function Loginbar(props) {
    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={props.loginHandler}>
                <input
                    type='text'
                    onChange={props.loginChangeHandler}
                    placeholder="Enter your name here" required className = "loginbar" />
                <button
                    type='submit'
                    className="btn btn-primary btn-block btn-large" >Let me in.</button>
            </form>
        </div>)
}

function Status(props) {
    if (props.isLoggedIn) {
        return (<p>{props.username} is logged in</p>)
    }
    else {
        return (<p>Please login</p>)
    }
}
export { Loginbar, Status };


