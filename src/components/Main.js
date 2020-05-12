import React, { Component } from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from '../Events';
import Login from './Login';
import ChatContainer from './chats/ChatContainer';

const socketUrl = "http://localhost:3003"
class Main extends Component {

    constructor(props) {
      super(props);
    
      this.state = {
          socket:null,
          user:null
      };
    }

    componentDidMount() {
        this.initSocket()
    }

    // Connect to and initializes the socket
    initSocket = () => {
        const socket = io(socketUrl)
        socket.on('connect', () => {
            console.log("Connected");
        })
        this.setState({ socket })
    }
    
    // Sets the user property in state 
    setUser = (user) => {
        const { socket } = this.state
        socket.emit(USER_CONNECTED, user);
        this.setState({ user })
    }
    
    // Sets the user property in state to null
    logout = () => {
        const { socket } = this.state
        socket.emit(LOGOUT)
        this.setState({ user:null })
    }
    
    render() {
        const { socket, user } = this.state
        return (
            <div className='ui container'>
            {
                !user ?
                    <Login socket={socket} setUser={this.setUser} />
                :
                    <ChatContainer socket={socket} user={user} logout={this.logout}/>
            }
            </div>
        );
    }
}

export default Main;
