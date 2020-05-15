import React, { Component } from 'react';
import { ADD_CHAT } from '../../Events';

class Sidebar extends Component {

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {isHidden:true, newChatName:''};
    }

    handleClick(){
        this.setState(state => ({isHidden: !state.isHidden}));
    }

    handleSubmit = (e) => {
        const { socket, chats, addChat } = this.props
        const { newChatName } = this.state

        let searched_chat = chats.find(chat => chat.id === newChatName) 
        console.log(searched_chat)
        // todo: if searched_chat!==undefined create new chat
        // else add current by this id (or change to unique name)

        e.preventDefault()
        this.setState({newChatName:""})
        socket.emit(ADD_CHAT, newChatName, addChat)
        console.log(newChatName)
    }


    setActiveChat = (chat) => {
        const { username } = this.props
        this.props.setActiveChat(chat, username) 
        this.props.setUserToChat(chat.id, username)
    }


    render() {
        const { chats, activeChat, username} = this.props
        const { newChatName, isHidden } = this.state
        return (
            <div className="chat-sidebar">
                   
                <form className='chat'
                    onSubmit={ this.handleSubmit } >
                    <input 
                        id = "newChatName"
                        type = "text"
                        className = "chat-input"
                        value = { newChatName }
                        autoComplete = {'off'}
                        placeholder = "Add new chat"
                        onChange = {
                            ({target}) => {
                                this.setState({newChatName:target.value})
                            }
                        }
                    />
                    <button
                        disabled = { newChatName.length < 1 }
                        type = "submit"
                        className = "btn"
                    > 
                        <i className = 'plus icon'></i> 
                    </button>
				</form>
                
                <div > {
                        chats.map((chat) => {
                            if (chat.name){
                                const lastMessage = chat.messages[chat.messages.length - 1];

                                const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''
                                
                                return (
                                    <div>
                                        <div 
                                            key={chat.id} 
                                            className={`chat ${classNames}`}
                                            onClick={ ()=>{ this.setActiveChat(chat) } }
                                        >
                                            <div className="chat-info">
                                                <strong >{chat.name}</strong>
                                                    {lastMessage && 
                                                        <p>{lastMessage.sender === username.name ? 'you':
                                                        lastMessage.sender} : {lastMessage.message}</p>
                                                    }
                                                    {!isHidden && 
                                                    <div>
                                                        <p>users in chat:</p>
                                                        <p>{chat.users.map((user)=> {
                                                            return (
                                                                <p>
                                                                    {user.name}
                                                                </p>
                                                            )
                                                        })}</p>
                                                    </div>
                                                    }
                                            </div>
                                            <div>
                                                <button onClick={this.handleClick} className='btn'>
                                                    <i className='users icon'></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        })	
                    }
                </div>
            </div>
        );
    
    }
}

export default Sidebar;