import React, { Component } from 'react';
import axios from '../../../../node_modules/axios/index';
import { checkLogged } from '../../../Functions/Functions';
import { Navigate } from 'react-router';
import { NavLink } from 'react-router-dom';

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = { name: "", oldPassword: "", newPassword: "", confirmPassword: "", errrorMessage: "", succeed: "", loading: true, isLoggedIn: false };
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            const isLoggedIn = await checkLogged();
            if (isLoggedIn) {
                this.populateProfile();
                this.setState({ isLoggedIn });
                return;
            }
            this.setState({ loading: false });
        } catch (err) {
            console.log(err);
        }
    }

    handleChangeName = async (e) => {
        e.preventDefault();
        const name = this.state.name;

        axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
       
        const response = await axios.post(`/user/ChangeName?name=${name}`);
        delete axios.defaults.headers.common["xAuthAccessToken"];

        window.location.href = '/profile/settings';
    }

    handleChangePassword = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = this.state;

        if (newPassword === confirmPassword) {
            try {
                axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
                const response = await axios.post("/user/ChangePassword", { oldPassword, newPassword });
                delete axios.defaults.headers.common["xAuthAccessToken"];
            }
            catch (err) {
                this.setState({ errorMessage: 'Wrong old password' });
                return;
            }

            this.setState({ succeed: 'Password has been changed' });
            return;
        }

        this.setState({ errorMessage: 'Passwords are not equal' });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    renderProfile(user) {
        const { oldPassword, newPassword, confirmPassword, name, isLoggedIn, errorMessage, succeed } = this.state;

        if (!isLoggedIn) {
            return <Navigate to="/login" />;
        }

        return (
            <>
                <h3>Hello {user.userName}</h3>

                <form onSubmit={ this.handleChangeName }>
                    <label>
                        Change name:
                        <input type="text" name="name" value={name} onChange={this.handleChange} required />
                    </label>
                    <button type="submit">Change</button>
                </form>

                <form onSubmit={this.handleChangePassword}>
                    <label>
                        Change password:
                        <input type="password" placeholder="Old password..." name="oldPassword" value={oldPassword} onChange={this.handleChange} required />
                        <input type="password" placeholder="New password..." name="newPassword" value={newPassword} onChange={this.handleChange} required />
                        <input type="password" placeholder="Confirm password..." name="confirmPassword" value={confirmPassword} onChange={this.handleChange} required />
                    </label>
                    <button type="submit">Change</button>
                </form>
                {<p>{errorMessage}</p>}
                {<p>{succeed}</p>}
                <NavLink to="/profile">
                    <button>Go Back</button>
                </NavLink>
            </>
        );
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderProfile(this.state.user);

        return (
            <div>
                {contents}
            </div>
        );
    }

    async populateProfile() {
        try {
            axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
            const response = await axios.get('/user/GetUserByAccessToken');
            delete axios.defaults.headers.common["xAuthAccessToken"];
            this.setState({ user: response.data, loading: false });
        }
        catch (err) {
            console.log(err);
        }
    }
}