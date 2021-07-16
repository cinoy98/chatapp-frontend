import React from 'react';
import "../assets/css/message.css";
const client = new WebSocket('ws://localhost:8080/');

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            messages: [],
            isLoggedIn: false,
            username: "",
            userId: "",
            reciever: "abi",
            onlineUsers: []
        };

        // this.handleNameChange = this.handleNameChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleLoginClick = this.handleLoginClick.bind(this);
        this.client = client;
    }

    componentDidMount() {
        client.onerror = function () {
            console.log('Connection Error');
        };
        // client.
        client.onopen = function () {
            console.log('WebSocket Client Connected');
            // client.onmessage = function(id){
            //     console.log(id.data);
            // }
        };

        client.onclose = function () {
            console.log('Websocket connection Closed');
        };

        this.client.onmessage = function (incoming) {
            console.log("message recievet at client :", incoming.data);
            var message = JSON.parse(incoming.data);
            if (message.type == "userId") {
                this.setState({ userId: message.userId });
            }


            if (message.type == "username") {
                if (message.userId == this.state.userId) {
                    this.setState({ username: message.username })
                }
            }


            if (message.type == "text") {
                let y = this.state.messages.map((message) => (
                    message
                ));
                console.log(`message recieved ${message.message} from ${message.from}`)
                y.push(message.message);
                this.setState({ messages: y });
            }

            if (message.type == "online") {
                let users = message.online;
                console.log("users onlinelist", users);
                this.setState({ onlineUsers: users });
                console.log("users onlinelist state", this.state.onlineUsers);
            }
            // if (message.type === "userId") {
            //     let register = {
            //         username: this.state.username,
            //         type: "register",
            //         userId: message.userId
            //     }
            //     client.send(JSON.stringify(register));
            // }
        }.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        let info = {
            username: this.state.username,
            message: this.state.value,
            userId: this.state.userId,
            reciever: this.state.reciever,
            type: "text"
        }
        console.log("message sent to server", info);
        client.send(JSON.stringify(info));
        event.preventDefault();
    }

    loginHandler = (event) => {
        event.preventDefault();
        this.setState({ isLoggedIn: true });
        this.setState({ value: event.target.value });
        let register = {
            username: this.state.username,
            type: "register",
            userId: this.state.userId
        }
        client.send(JSON.stringify(register));
    }
    loginChangeHandler = (event) => {
        this.setState({ username: event.target.value });

    }

    render() {

        return (
            <div>
                <section>
                    <nav>
                        Friends list
                        <ul>
                            {this.state.onlineUsers.map((users, index) => (
                                <li key={index}>{users}</li>
                            ))}
                        </ul>
                    </nav>
                    <article>

                        <ul>
                            {this.state.messages.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                    </article>
                </section>
                <footer>

                    <form onSubmit={this.loginHandler}>
                        <input
                            type='text'
                            onChange={this.loginChangeHandler}
                        />
                        <input
                            type='submit'
                        />
                    </form>
                    <Status isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            YOU ::::
                            <input type="text" onChange={this.handleChange} className="sendTerm" placeholder="enter your message here" />
                            <input type="submit" value="send" className="sendButton" />
                        </label>
                    </form>

                </footer>
            </div>

        )
    }
}

function Status(props) {
    if (props.isLoggedIn) {
        return (<p>{props.username} is logged in</p>)
    }
    else {
        return (<p>Please login</p>)
    }
}

export default Message;