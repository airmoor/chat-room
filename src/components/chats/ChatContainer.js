import React, { Component } from 'react';
import { COMMUNITY_CHAT, PRIVATE_MESSAGE, MESSAGE_SENT, MESSAGE_RECIEVED, TYPING, ADD_CHAT } from '../../Events'
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import Messages from '../messages/Messages';
import MessageInput from '../messages/MessageInput';
import './../../style/chat.css'


class ChatContainer extends Component {

    constructor(props) {
        super(props);	
        this.state = {
            chats:[],
            activeChat:null
        };
      }


    componentDidMount() {
        const { socket } = this.props
        // socket.emit(ADD_CHAT,  this.addChat(chat))
        socket.emit(COMMUNITY_CHAT,  this.resetChat)
        // this.initSocket(socket)
    }  

    initSocket(socket) {
        socket.emit(COMMUNITY_CHAT,  this.resetChat)
        socket.on(PRIVATE_MESSAGE, this.addChat)
    }

   
    // Reset the chat back to only the chat passed in.
    resetChat = (chat) => {
        return this.addChat(chat, true)
    }
    
    // Adds chat to the chat container, 
    // Sets the message and typing socket events for the chat.
    addChat = (chat, reset = false) => {
        console.log('chat',chat)
        const { socket } = this.props
        const { chats } = this.state

        const newChats = reset ? [chat] : [...chats, chat]
        // invite in first chat automaticly
        // this.setState({chats:newChats, activeChat:reset ? chat : this.state.activeChat})

        this.setState({chats:newChats})

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`

        socket.on(typingEvent, this.updateTypingInChat(chat.id))
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }
    
    
    // Returns a function that will 
    // adds message to chat with the chatId passed in. 
    addMessageToChat = (chatId) => {
        return message => {
            const { chats } = this.state
            let newChats = chats.map((chat)=>{
                if(chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })
            this.setState({chats:newChats})
        }
    }

    
    // Updates the typing of chat with id passed in.
    updateTypingInChat = (chatId) => {
        return ({isTyping, user}) => {
            if(user !== this.props.user.name) {
                const { chats } = this.state
                let newChats = chats.map((chat) => {
                    if (chat.id === chatId) {
                        if(isTyping && !chat.typingUsers.includes(user)) {
                            chat.typingUsers.push(user)
                        }
                        else if (!isTyping && chat.typingUsers.includes(user)) {
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user)
                        }
                    }
                    return chat
                })
                this.setState({chats:newChats})
            }
        }
    }

    setActiveChat = (activeChat) => {
        this.setState({activeChat})
        
    }

    sendMessage = (chatId, message) => {
        const { socket } = this.props
        socket.emit(MESSAGE_SENT, {chatId, message} )
    }

    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props
        socket.emit(TYPING, {chatId, isTyping})
    }

    setChats = (chats) => {
        this.setState({chats});
    }

    render() {
        const { user, logout, socket } = this.props
        const { chats, activeChat, addChat, setChat } = this.state
        return (
     
            <div className='chat-container'>
           
                <div className='chat-header h2'>
                    Welcome to chat, {user.name}!
                 
                    <div onClick={()=>{logout()}} title="Logout">
                        <i className='sign out icon'></i>
                    </div>
                    
                </div>
            
                <div className='chat-main'>
                    <Sidebar 
                        chats={chats}
                        setChats={this.setChats}
                        activeChat={activeChat}
                        setActiveChat={this.setActiveChat}
                        username={user}
                        addChat={addChat}
                        socket={socket}
                        setChat={setChat}
                        sendPrivateMessage={this.sendPrivateMessage}
                    />
                    {
                        activeChat !== null ? (
                            <div >
                                <ChatHeader name={activeChat.name}/>
                                <div className='chat-messages-container'>
                                    <Messages messages = {activeChat.messages}
                                    user = {user} 
                                    typingUsers={activeChat.typingUsers} />
                                    <MessageInput  
                                        sendMessage = {
                                            (message)=>{
                                            this.sendMessage(activeChat.id, message)
                                            }
                                        }
                                        sendTyping={
                                            (isTyping)=>{
                                                this.sendTyping(activeChat.id, isTyping)
                                            }
                                        } />
                                </div>
                            </div>
                        )
                        :
                            <div className='hello-text'>
                                You have not chats now. Add some at the side :)
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default ChatContainer;
