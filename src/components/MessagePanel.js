function Chat(props) {

    return (
        props.messageArray.map((msg, index) => (
            <li className="message" key={index}>{msg}</li>
        ))
    )
}

export { Chat }