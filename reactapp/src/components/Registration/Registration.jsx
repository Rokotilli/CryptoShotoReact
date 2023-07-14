import React, { Component } from 'react';
import axios from '../../../node_modules/axios/index';
import { AddToStorage } from '../../Functions/Functions';

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '', email: '', password: '', confirmPassword: '', errorMessage: '' };
    }

    render() {
        const { name, email, password, confirmPassword, errorMessage } = this.state;

        return (
            <div>
                <h2>Registration</h2>
                {<p>{errorMessage}</p>}
                <form onSubmit={this.confirmRegistration}>
                    <label>
                        Name:
                        <input type="text" name="name" value={name} onChange={this.handleChange} required />
                    </label>
                    <br />
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
                    <label>
                        Confirm password:
                        <input type="password" name="confirmPassword" value={confirmPassword} onChange={this.handleChange} required />
                    </label>
                    <br />

                    <button type="submit">Registration</button>
                </form>
            </div>

        );
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    confirmRegistration = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            this.setState({ errorMessage: 'Password and confirm password do not match' });
            return;
        }

        try {
            await axios.post('user/signup', { name, email, password });
            const response2 = await axios.post('user/LogIn', { email, password, name });
            AddToStorage(response2);
            window.location.href = '/';
        }
        catch (err) {
            console.log(err);
            this.setState({ errorMessage: 'Smth went wrong' });
        }
    }
}