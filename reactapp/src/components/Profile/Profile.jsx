import React, { Component } from 'react';
import axios from '../../../node_modules/axios/index';
import { checkLogged, LogOut } from '../../Functions/Functions';
import { Navigate } from 'react-router';
import { NavLink } from 'react-router-dom';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { user: [], loading: true, isLoggedIn: false };
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

    handleLogout = () => {
        try {
            LogOut();
            window.location.href = '/';
        } catch (err) {
            console.log(err);
        }
    }

    renderProfile(user) {
        const isLoggedIn = this.state.isLoggedIn;

        if (!isLoggedIn) {
            return <Navigate to="/login" />;
        }

        return (
            <>
                <h3>Your profile:</h3>
                <p>Name: {user.userName}</p>
                <p>Email: {user.email}</p>

                <button onClick={this.handleLogout}>Logout</button>
                <br></br>
                <NavLink to="/profile/settings">
                    <button>Settings</button>
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