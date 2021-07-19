import React from 'react';
import "../assets/css/message.css";
const client = new WebSocket('https://chatapp-backend-nodejs.herokuapp.com/');

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

        return (
            <div>
                <section>
                    <nav>
                        Friends list

                        <ul>
                            {this.state.onlineUsers.map((users, index) => (
                                <li key={index}>  <button key={index} onClick={this.getUser}>{users}</button></li>
                            ))}
                        </ul>
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

                    <Loginbar isLoggedIn={this.state.isLoggedIn} loginHandler={this.loginHandler} loginChangeHandler={this.loginChangeHandler} />
                    <Status isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                    <Messagebar isLoggedIn={this.state.isLoggedIn} handleSubmit={this.handleSubmit} handleChange={this.handleChange} />

                </footer>
            </div >

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

function Messagebar(props) {
    if (props.isLoggedIn) {
        return (<form onSubmit={props.handleSubmit}>
            <label>
                YOU ::::
                <input type="text" onChange={props.handleChange} className="sendTerm" placeholder="enter your message here" />
                <input type="submit" value="send" className="sendButton" />
            </label>
        </form>)
    }
    return (<div></div>)
}

function Loginbar(props) {
    if (!props.isLoggedIn) {
        return (<form onSubmit={props.loginHandler}>
            <input
                type='text'
                onChange={props.loginChangeHandler}
            />
            <input
                type='submit'
            />
        </form>)
    }
    return (<div></div>)
}

function Chat(props) {

    return (
        props.messageArray.map((msg,index) => (
            <p key ={index}>{msg}</p>
        ))
    )
}
export default Message;