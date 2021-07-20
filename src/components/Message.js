import React from 'react';
import "../assets/css/message.css";
import { Loginbar, Status } from "./Login";
import { Chat } from "./MessagePanel";
import { Messagebar } from './MessageBar';
import { Online } from './Online';
const client = new WebSocket('wss://chatapp-backend-nodejs.herokuapp.com/');

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            messages: [],
            isLoggedIn: false,
            username: "",
            userId: "",
            reciever: "",
            onlineUsers: []
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.client = client;
        this.getUser = this.getUser.bind(this);

    }

    componentDidMount() {
        client.onerror = function () {
            console.log('Connection Error');
        };

        client.onopen = function () {
            console.log('WebSocket Client Connected');

        };

        client.onclose = function () {
            console.log('Websocket connection Closed');
        };

        this.client.onmessage = function (incoming) {

            var message = JSON.parse(incoming.data);
            if (message.type == "userId") {
                this.setState({ userId: message.userId });
            }


            if (message.type == "username") {
                this.setState({ username: message.username });
            }


            if (message.type == "text") {
                let messageArray = [];
                messageArray = this.state.messages.map((message) => (
                    message
                ));

                let index = messageArray.findIndex((msg) => {
                    return msg.from == message.from
                })
                let textMessage;
                if (index == -1) {
                    textMessage = {
                        from: message.from,
                        message: [`${message.from} : ${message.message}`]
                    }
                    messageArray.push(textMessage);
                }
                else {
                    messageArray[index].message.push(`${message.from} : ${message.message}`);
                }
                this.setState({ messages: messageArray });
            }

            if (message.type == "online") {
                let users = message.online;
                this.setState({ onlineUsers: users });
            }

        }.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        console.log("this is ", this);
        console.log("event is ", event);
        let info = {
            username: this.state.username,
            message: this.state.value,
            userId: this.state.userId,
            reciever: this.state.reciever,
            type: "text"
        }

        let messageArray = this.state.messages.map((message) => (
            message
        ));
        let index = messageArray.findIndex((msg) => {
            return msg.from == this.state.reciever
        })
        let textMessage;
        if (index == -1) {
            textMessage = {
                from: this.state.reciever,
                message: [`${this.state.username} : ${this.state.value}`]
            }
            messageArray.push(textMessage);
        }
        else {
            messageArray[index].message.push(`${this.state.username} : ${this.state.value}`);
        }
        this.setState({ messages: messageArray });
        client.send(JSON.stringify(info));
        this.setState({ value: "" });
        event.target.reset()
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

    getUser(event) {
        event.preventDefault();
        this.setState({ reciever: event.target.innerHTML });
    }



    render() {
        let listItems = [];
        let messageArray = [];

        this.state.messages.forEach((recievedMessage) => {
            if (this.state.reciever == recievedMessage.from) {
                listItems = Object.values(recievedMessage.message);

            }
        })

        listItems.forEach((msg) => {
            messageArray.push(msg);
        })
        if (this.state.isLoggedIn) {
            return (
                <div>
                    <section>
                        <nav>
                            People Online (click to start conversation)
                            <Online onlineUsers={this.state.onlineUsers} getUser={this.getUser} />
                        </nav>
                        <article>
                            <p>{this.state.reciever}</p>
                            <ul>
                                <Chat messageArray={messageArray} />

                            </ul>
                        </article>
                        <nav>
                            Messages (coming soon)
                        </nav>
                    </section>
                    <footer>
                        <Status isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                        <Messagebar isLoggedIn={this.state.isLoggedIn} handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
                    </footer>
                </div >

            )
        }
        else {
            return (<Loginbar isLoggedIn={this.state.isLoggedIn} loginHandler={this.loginHandler} loginChangeHandler={this.loginChangeHandler} />)

        }

    }
}








export default Message;