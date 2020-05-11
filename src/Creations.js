// module for creating objects

//universally unique identifier
// const uuid = require('uuid')
const { v4: uuid } = require ('uuid');


// Creates a user
const createUser = ({name = ""} = {}) => (
	{
		id:uuid(),
		name
	}
)

// Creates a messages object
const createMessage = ({message = "", sender = ""} = {}) => (
	{
		id:uuid(),
		time:getTime(new Date(Date.now())),
		message,
		sender	
	}
)

// Creates a Chat object
const createChat = ({messages = [], name = "Main chat", users = []} = {})=> (
	{
		id:uuid(),
		name,
		messages,
		users,
		typingUsers:[]
	}
)

// formating time
const getTime = (date) => {
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}

module.exports = {
	createMessage,
	createChat,
	createUser
}

