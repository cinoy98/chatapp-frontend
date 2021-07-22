import "../assets/css/displaymessage.css"
function Chat(props) {
    if (props.ready) {
        return (
            <main>
                <header>
                    <div>
                        <h2>Chat with {props.friend}</h2>
                        <h3>Start your converstation here</h3>
                    </div>

                </header>
                <ul id="chat">
                    {props.messageArray.map((msg, index) => (

                        <User message={msg} user={props.user} />

                        // <li className="message" key={index}>{msg.message}</li>
                    ))}
                </ul>
            </main>
        )
    }
    else {
        return (
            <div className = "welcome"><h4>Welcome</h4>
                <img src="https://raw.githubusercontent.com/cinoy98/chatapp-frontend/main/src/assets/images/tenor.gif" height= "auto"/></div>
            )
    }

}

function User(props) {
    if (props.message.from == props.user) {
        return (
            <li className="me">
                <div className="entete">
                    <span className="status green"></span>
                    <h2>{props.message.from}</h2>

                    <h3>{new Date().toLocaleTimeString()}</h3>
                </div>
                <div className="message">
                    {props.message.message}
                </div>
            </li>
        )
    }
    else {
        return (
            <li className="you">
                <div className="entete">
                    <h3>{new Date().toLocaleTimeString()}</h3>
                    <h2>{props.message.from}</h2>
                    <span className="status blue"></span>
                </div>
                <div className="message">
                    {props.message.message}
                </div>
            </li>
        )
    }


}

export { Chat }



