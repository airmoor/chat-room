import React, { Component } from 'react';

class Sidebar extends Component {

    render() {
        const { chats, activeChat, setActiveChat, username} = this.props
        console.log(chats);
        return (
            <div className="chat-sidebar">
                <div 
                    ref='users' 
                    onClick={(e)=>{ (e.target === this.refs.user) && setActiveChat(null) }}> {
                        chats.map((chat) => {
                            if (chat.name){
                                const lastMessage = chat.messages[chat.messages.length - 1];

                                const user = chat.users.find(({name})=>{
                                    return name !== this.props.name
                                }) || { name:"Main chat" }
                                const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''
                                
                                return (
                                    <div 
                                        key={chat.id} 
                                        className={`chat ${classNames}`}
                                        onClick={ ()=>{ setActiveChat(chat) } }
                                    >
                                        <div className="chat-info">
                                            <strong >{user.name}</strong>
                                                {lastMessage && 
                                                // <div>
                                                    <p>{lastMessage.sender === username.name ? 'you':
                                                    lastMessage.sender} : {lastMessage.message}</p>
                                                // </div>
                                                }
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