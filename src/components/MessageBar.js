function Messagebar(props) {
    return (
    <form onSubmit={props.handleSubmit}>
        <label>
            <input type="text" onChange={props.handleChange} className="sendTerm" placeholder="enter your message here" required />
            <input type="submit" value="send" className="sendButton" />
        </label>
    </form>
    )
};

export { Messagebar };