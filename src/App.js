import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import './App.css';
import HeaderApp from './components/header.js';
import BodyApp from './components/body.js';
import Training from './components/training.js';
import { userService } from './services/userService';
import { actionTypes } from './redux/actionTypes';
import _ from 'lodash';
import { connect } from 'react-redux';

export const url = 'http://localhost:3001';

const mapStateToProps = (state) => {
    return {
        userState: state.userState,
        userName: state.userName,
        cards: state.cards,
        currentFolder: state.currentFolder
    }
}

const mapDispatchToProps = dispatch => {
    return {
        
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <HeaderApp />

                    <Switch>
                        <Route path="/" exact>
                            <BodyApp/>
                        </Route>
                        <Route path="/training/:id">
                            <Training />
                        </Route>
                        <Route>
                            <p>404!</p>
                        </Route>
                    </Switch>

        

                </div>
            </Router>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(App);
