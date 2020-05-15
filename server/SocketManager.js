const io = require('./index.js').io

const { VERIFY_USER, USER_CONNECTED, USER_DISCONNECTED, 
         LOGOUT, MAIN_CHAT, ADD_CHAT, MESSAGE_RECIEVED, MESSAGE_SENT, USER_TO_CHAT,USER_IN_CHAT, TYPING  } = require('../src/Events')

const { createUser, createMessage, createChat } = require('../src/Creations')

let connectedUsers = { }
let newChat = createChat()


module.exports = function(socket) {
                    
    console.log("Socket Id:" + socket.id);

    let sendMessageToChatFromUser;
    let sendTypingFromUser;
    let addUserToChatFromUser;


    //Verify Username
    socket.on(VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({ isUser:true, user:null })
        }
        else {
            callback({ 
                isUser:false, 
                user:createUser({name:nickname}) })
        }
    })

    // //User Connects with username
    socket.on(USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user)
        socket.user = user

        sendMessageToChatFromUser = sendMessageToChat(user.name)
        sendTypingFromUser = sendTypingToChat(user.name)

        //broadcast for all connected users
        io.emit(USER_CONNECTED, connectedUsers)
        console.log(connectedUsers);
    })
    
    // //User disconnects
    socket.on('disconnect', () => {
        if("user" in socket){
            connectedUsers = removeUser(connectedUsers, socket.user.name)
            io.emit(USER_DISCONNECTED, connectedUsers)
            console.log(socket.user.name, "is disconnected");
        }
    })

    // //User logout
    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name)
        io.emit(USER_DISCONNECTED, connectedUsers)
        console.log(socket.user.name, "is disconnected");
    })

    // //Get main Chat
    socket.on(MAIN_CHAT, (callback) => {
        newChat.name='Main chat';
        console.log('main chat', socket.user)
        callback(newChat)
    })

    socket.on(ADD_CHAT, (chatname, callback) => {
        let newChat = createChat()
        newChat.name=chatname;
        console.log(newChat);
        callback(newChat);        
    })


    socket.on(MESSAGE_SENT, (chatId, message) => {
        sendMessageToChatFromUser(chatId, message)
    })

    socket.on(USER_IN_CHAT, (chatId, user) => {
        addUserToChatFromUser = addUserToChat()
        addUserToChatFromUser(chatId, user)
    })

    socket.on(TYPING, ({chatId, isTyping}) => {
        sendTypingFromUser(chatId, isTyping)
        console.log(chatId, isTyping)
    })

}

// Returns a function that will take a chat id and a boolean isTyping
// and then emit a broadcast to the chat id that the sender is typing
function sendTypingToChat(user) {
    return (chatId, isTyping) => {
        io.emit(`${TYPING}-${chatId}`, {user, isTyping})
    }
}


// Returns a function that will take a chat id and message
// and then emit a broadcast to the chat id.
function sendMessageToChat(sender) {
    console.log(`sendMessageToChat sender`, sender)

    return (chatId, message) => {
        console.log('sendMessageToChat: chatId message', chatId, message)
        let newMessage = createMessage({message, sender})
        // create message and send object
        io.emit(`${MESSAGE_RECIEVED}-${chatId}`, newMessage)
        console.log('newMessage',newMessage)
    }
}

function addUserToChat() {
    console.log('addUserToChat run')
    
    return (chatId, user) => {
        io.emit(`${USER_TO_CHAT}-${chatId}`, user)
        console.log('user add to chat',user, chatId )
    }
}


// Adds user to list passed in.
function addUser(userList, user) {
    let newList = Object.assign({}, userList)
    newList[user.name] = user
    return newList
}


//  Removes user from the list passed in.
function removeUser(userList, username) {
    let newList = Object.assign({}, userList)
    delete newList[username]
    return newList
}


// Checks if the user is in list passed in.
function isUser(userList, username){
    return username in userList
}