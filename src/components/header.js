import React, { Component } from 'react';
import '../App.css';
import { connect } from 'react-redux';
import { userService } from '../services/userService';
import { actionTypes } from '../redux/actionTypes';

const mapStateToProps = (state) => {
    return {
        userState: state.userState,
        userName: state.userName,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        login: (name) => dispatch(actionTypes.login(name)),
        logout: () => dispatch(actionTypes.logout())
    }
}

function RegistrationForm(props) {
    return (
        <form id="registrationForm">
            <label className="userName">Your name
                <input 
                    id="name" 
                    type="text" 
                    name="name" 
                    value = { props.name }
                    onChange = { props.onInputRegistrationFormChange } 
                />
            </label>

            <label className="email">Email
                <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    value = { props.email }
                    onChange = { props.onInputRegistrationFormChange } 
                />
            </label>

            <label className="password">Password
                <input 
                    id="password" 
                    type="password" 
                    name="password" 
                    value = { props.password }
                    onChange = { props.onInputRegistrationFormChange } 
                />
                Passwords must contain at least six characters, including uppercase, lowercase letters and numbers.
            </label>

            <button 
                data-formid="registrationForm" 
                id="sendDataRegistration" 
                type="submit"
                onClick = { props.onClickSendNewUser }
            >Send</button>
        </form>
    );
}

function LoginForm(props) {
    return (
        <form id="loginForm" onSubmit = { props.onClickSendDataLogin }>
            <label className="email">Email
                <input 
                    type="email" 
                    name="email" 
                    value = { props.email }
                    onChange = { props.onInputLoginFormChange } 
                />
            </label>
            
            <label className='password'>Password
                <input 
                    type="password" 
                    name="password" 
                    value = { props.password }
                    onChange = { props.onInputLoginFormChange }
                />
            </label>
            
            <button 
                data-formid="loginForm" 
                id="sendDataLogin" 
                type="submit"
            >Send</button>
        </form> 
    );
}

class HeaderApp extends Component{
    constructor(props){
        super(props);

        this.state = {
            registrationFormVisible: false,
            loginFormVisible: false,
            loginForm: {
                email: '',
                password: ''
            },
            registrationForm: {
                name: '',
                email: '',
                password: ''
            },
        }
    }

    async componentDidMount() {
        if (localStorage.getItem('sessionToken')) {
            console.log('componentDidMount');
            const result = await userService.getDataUser();
            this.props.login(result.payload);
        }
    }

    onInputRegistrationFormChange = (event) => {
        const registrationForm = {...this.state.registrationForm};
        registrationForm[event.target.name] = event.target.value;

        this.setState({ registrationForm });
    }

    onInputLoginFormChange = (event) => {
        this.setState({
            loginForm: {
                ...this.state.loginForm,
                [event.target.name]: event.target.value
            }
        });
    }

    onClickLogin = (event, data) => {
        event.preventDefault();
        this.setState({ loginFormVisible: !this.state.loginFormVisible });
    }

    onClickLogout = async (event) => {
        event.preventDefault();
        await userService.logoutUser();
        localStorage.removeItem('sessionToken');
        this.props.logout();
    }

    onClickRegistration = (event, data) => {
        event.preventDefault();
        this.setState({ registrationFormVisible: !this.state.registrationFormVisible });
    }

    onClickSendDataLogin =  async (event) => {
        event.preventDefault();

        const result = await userService.loginUser(this.state.loginForm);
    
        if (result.ok) {
            this.props.login();
        } else {
            alert(result.errorMessage);
        }
    }

    onClickSendNewUser = async (event, data) => {
        event.preventDefault();
        await userService.createUser(this.state.registrationForm);
        
        const result = await userService.loginUser(
            {
                email: this.state.registrationForm.email, 
                password: this.state.registrationForm.password
            }
        );
    
        if (result.ok) {
            this.props.login();
        } else {
            alert(result.errorMessage);
        } 
    }

    render() {
        if (this.props.userState === 'notAuthorized') {
            return (
                <div className="header">
                    <header>
                        <p>
                            Hello {this.props.userName}!
                        </p>
    
                        <button 
                        id="loginButton"
                        onClick = { this.onClickLogin }
                        >Login</button>
                        <button 
                        id="registrationButton"
                        onClick = { this.onClickRegistration }
                        >Registration</button>
    
                    { this.state.registrationFormVisible && <RegistrationForm 
                        email = { this.state.registrationForm.email }
                        name = { this.state.registrationForm.name }
                        password = { this.state.registrationForm.password }
                        onInputRegistrationFormChange = { this.onInputRegistrationFormChange }
                        onClickSendNewUser = { this.onClickSendNewUser }
                        
                    /> }
                    { this.state.loginFormVisible && <LoginForm 
                        email = { this.state.loginForm.email }
                        password = { this.state.loginForm.password }
                        onInputLoginFormChange = { this.onInputLoginFormChange }
                        onClickSendDataLogin = { this.onClickSendDataLogin }
                    /> }
                    </header>
                </div>
            );
        }

        return (
            <div className="header">
                <header>
                        <p>
                            Hello {this.props.userName}!
                        </p>
    
                    <button 
                        id="logoutButton"
                        onClick = { this.onClickLogout }
                    >Loguot
                    </button>
    
                    <button 
                    id="myProfileButton"
                    >My Profile</button>
                </header>
            </div>);
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderApp);
