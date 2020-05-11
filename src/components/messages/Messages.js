import React, { Component } from 'react';

export default class Messages extends Component {
    constructor(props) {
      super(props)
        this.scrollDown = this.scrollDown.bind(this)
    }

    scrollDown(){
        const { container } = this.refs
        container.scrollTop = container.scrollHeight
    }

    componentDidMount() {
        this.scrollDown()
    }

    componentDidUpdate() {
        this.scrollDown()
    }
    
    render() {
        const { messages, user, typingUsers } = this.props
        
        return (
            <div ref='container'
                className="chat-messages">
                    {
                        messages.map((mes)=>{
                            
                            const position = (mes.sender === user.name) ? 'right' : 'left';
                      
                            return (
                                <div
                                    key={mes.id}
                                    className={`message-container ${position}`}
                                >
                                    <div className="time">{mes.time}</div>
                                        <div className="message-content">
                                            <strong >{mes.sender}</strong>
                                            <p> {mes.message} </p>
                                        </div>
                                    </div>
                                )
                        })
                    }
                    {
                        typingUsers.map((name)=>{
                            return (
                                <div key={name} className="typing-user">
                                    {`${name} is typing . . .`}
                                </div>
                            )
                        })
                    }
            </div>
        );
    }
}
