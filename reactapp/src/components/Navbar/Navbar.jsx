import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { checkLogged } from '../../Functions/Functions';
import "./Navbar.css";

export class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isLoading: false
        };
    }

    async componentDidMount() {
        try {
            this.setState({ isLoading: true });
            const isLoggedIn = await checkLogged();
            this.setState({ isLoggedIn, isLoading: false });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { isLoggedIn, isLoading } = this.state;

        return (
            <div className="NavBarMain">
                <div className="NavBarMenu">
                    <NavLink to="/" className="NavBarButton">Home</NavLink>

                    <NavLink to="/coins" className="NavBarButton">Coins</NavLink>
                    {!isLoading && (
                        <>
                            {isLoggedIn ? (
                                <>
                                    <NavLink to="/profile" className="NavBarButton">Profile</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" className="NavBarButton">Login</NavLink>
                                    <NavLink to="/signup" className="NavBarButton">Registration</NavLink>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>           
        );
    }
}