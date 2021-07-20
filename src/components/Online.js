import "../assets/css/online.css";
function Online(props) {
    return (
        <ul>
            {props.onlineUsers.map((users, index) => (
                <li key={index}>  <button key={index} onClick={props.getUser}>{users}</button></li>
            ))}
        </ul>
    )
}

export { Online };