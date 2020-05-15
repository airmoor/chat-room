import React, { Component } from 'react';
import { MAIN_CHAT, MESSAGE_SENT, MESSAGE_RECIEVED, TYPING, USER_TO_CHAT, USER_IN_CHAT } from '../../Events'
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
        socket.emit(MAIN_CHAT, this.addChat)
    }  

 
    // Adds chat to the chat container, 
    // Sets the message and typing socket events for the chat.
    addChat = (chat) => {
        const { chats } = this.state
        const newChats = [...chats, chat]
        console.log('added chat',chat)
        console.log('chats now',newChats)
        // to invite in first chat automaticly 
        // this.setState({chats:newChats, activeChat:reset ? chat : this.state.activeChat})
        this.setState({chats:newChats})
        this.setActions(chat);
    }

    setActions = (chat) => {
        const { socket } = this.props
        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`
        const typingEvent = `${TYPING}-${chat.id}`

        socket.on(typingEvent, this.updateTypingInChat(chat.id))
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }
    
    // Returns a function that will 
    // adds message to chat with the chatId passed in. 
    addMessageToChat = (chatId) => {
        console.log('addMessageToChat', chatId)
        return message => {
            const { chats } = this.state
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    chat.messages.push(message)
                return chat
            })
            console.log('addMessageToChat', newChats)

            this.setState({chats:newChats})
        }
    }
    
    // Updates the typing of chat with id passed in.
    updateTypingInChat = (chatId) => {
        return ({isTyping, user}) => {
            if (user !== this.props.user.name) {
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

    setActiveChat = (activeChat, username) => {
        const { socket } = this.props
        let chats = this.state.chats;
        const addUsertoChatEvent = `${USER_TO_CHAT}-${activeChat.id}`
        this.setState({activeChat})

        let chat = chats.find(chat => chat.id === activeChat.id)



       console.log(chat.users, chat.users.includes(username), username)
        if (chat.users.includes(username)) {
            console.log('user is already in chat ') 
        }
        else {
            socket.on(addUsertoChatEvent, this.addUserToChat(chat.id))
        }
    }

    addUserToChat = (chatId) => {
        return user => {
            const { chats } = this.state
            let newChats = chats.map((chat) => {
                if (chat.id === chatId)
                    if(!chat.users.includes(user)) {
                        chat.users.push(user)
                    }
                return chat
            })
            this.setState({chats:newChats})
            console.log('newChats', newChats)
        }
    }

    
    setUserToChat = (chatId, user) => {
        const { socket } = this.props
        let chats = this.state.chats;

        let newChats = chats.map((chat) => {
            if (chat.id === chatId) {
                let status=chat.users.find(u => u.id === user.id)
                if(!status) {
                    socket.emit(USER_IN_CHAT, chat.id, user )
                }
                else console.log('user is already in chat ') 
            }
            return chat
        })
        this.setState({chats:newChats})
    }



    sendMessage = (chatId, message) => {
        const { socket } = this.props
        socket.emit(MESSAGE_SENT, chatId, message )
        console.log(chatId, message)
    }

    sendTyping = (chatId, isTyping) => {
        const { socket } = this.props
        socket.emit(TYPING, {chatId, isTyping})
    }


    render() {
        const { user, logout, socket } = this.props
        const { chats, activeChat } = this.state
        return (
     
            <div className='chat-container'>
                <div className='chat-header h2'>
                    Welcome to chat, {user.name}!
                 
                    <div onClick={() => {logout()}} title="Logout">
                        <i className='sign out icon'></i>
                    </div>
                </div>
            
                <div className='chat-main'>
                    <Sidebar 
                        chats={chats}
                        activeChat={activeChat}
                        setActiveChat={this.setActiveChat}
                        username={user}
                        addChat={this.addChat}
                        socket={socket}
                        setUserToChat = {
                            (chatId, user) => {
                                this.setUserToChat(chatId, user)
                            }
                        }
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
