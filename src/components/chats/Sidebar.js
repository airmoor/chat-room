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
        const { socket } = this.props
        const { newChatName } = this.state
        e.preventDefault()
        this.setState({newChatName:""})
        socket.emit(ADD_CHAT, newChatName, this.setChat)
        console.log(newChatName)
    }

    setChat = ( chat ) => {
        const { chats, setChats } = this.props
        chats.push(chat)
        setChats(chats)
        console.log(chats)
    }


    render() {
        const { chats, activeChat, setActiveChat, username} = this.props
        const { newChatName, isHidden } = this.state
        console.log('chats',chats);
        console.log(username); 
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
                {!isHidden && 
                    <div className='chat'>
                        Active users in chat:
                        <div className='user'>
                            user
                        </div>
                    </div>
                }
                <div 
                    ref='users' 
                    onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null, username) }}> {
                        chats.map((chat) => {
                            if (chat.name){
                                const lastMessage = chat.messages[chat.messages.length - 1];

                                const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''
                                
                                return (
                                    <div>
                                        <div 
                                            key={chat.id} 
                                            className={`chat ${classNames}`}
                                            onClick={ ()=>{ setActiveChat(chat, username) } }
                                        >
                                            <div className="chat-info">
                                                <strong >{chat.name}</strong>
                                                    {lastMessage && 
                                                        <p>{lastMessage.sender === username.name ? 'you':
                                                        lastMessage.sender} : {lastMessage.message}</p>
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