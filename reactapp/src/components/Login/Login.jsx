import React, { Component } from 'react';
import axios from '../../../node_modules/axios/index';
import { AddToStorage } from '../../Functions/Functions';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '', email: '', password: '', errorMessage: '' };
    }

    render() {
        const { email, password, errorMessage } = this.state;

        return (
            <div>
                <h2>Login</h2>

                {<p>{errorMessage}</p>}

                <form onSubmit={this.confirmLogin}>
                    <label>
                        Email:
                        <input type="email" name="email" value={email} onChange={this.handleChange} required />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" name="password" value={password} onChange={this.handleChange} required />
                    </label>
                    <br />

                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    confirmLogin = async (e) => {
        e.preventDefault();

        const { email, password, name } = this.state;

        try {
            const response = await axios.post('user/LogIn', { email, password, name });
            AddToStorage(response);
            window.location.href = '/';
        }
        catch (err) {
            console.log(err);
            this.setState({ errorMessage: 'Smth went wrong' });
        }
    }
}