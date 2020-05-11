import React, { Component } from 'react';
import { VERIFY_USER } from '../Events';
import './../style/login.css';
import './../style/login.js';

class Login extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
          nickname: "",
          error: ""
      };
    }

    setUser = ({ user, isUser }) => {
        if (isUser) {
            this.setError("Username is already taken")
        }
        else {
            this.setError("")
            this.props.setUser(user)
        }
    }

    setError = (error) => {
        this.setState({error})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { socket } = this.props
        const { nickname } = this.state
        socket.emit(VERIFY_USER, nickname, this.setUser)
    }

    handleChange = (e) => {
        this.setState({ nickname:e.target.value })
    }

    render() {	
        const { nickname, error } = this.state
        return (
            <main>
                <form className="form" onSubmit={this.handleSubmit} >
                    <div className="form__cover"></div>
                    <div className="form__loader">
                        <div className="spinner active">
                            <svg className="spinner__circular" viewBox="25 25 50 50">
                                <circle className="spinner__path" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"></circle>
                            </svg>
                        </div>
                    </div>
                    <div className="form__content">
                        <h1>What's your username?</h1>
                        <div className="styled-input">
                            <input type="text" className="styled-input__input" name="nickname"
                                ref={(input) => { this.textInput = input }} 
                                value={nickname}
                                onChange={this.handleChange}
                                placeholder={'username'}
                                />
                        </div>
                    
                        <button type="button" className="styled-button" onClick={this.handleSubmit}>
                            <span className="styled-button__real-text-holder">
                                <span className="styled-button__real-text">Submit</span>
                                <span className="styled-button__moving-block face">
                                    <span className="styled-button__text-holder">
                                        <span className="styled-button__text">Submit</span>
                                    </span>
                                </span>
                                <span className="styled-button__moving-block back">
                                    <span className="styled-button__text-holder">
                                        <span className="styled-button__text">Submit</span>
                                    </span>
                                </span>
                            </span>
                        </button>
                        <div className='light-text'>{error ? error : null}</div>
                    </div>
                </form>
            </main>
        );
    }
}

export default Login;
