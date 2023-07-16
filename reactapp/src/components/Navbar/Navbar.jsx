import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { checkLogged } from '../../Functions/Functions';
import "./Navbar.css";
import axios from '../../../node_modules/axios/index';
import { NavbarContext } from "../../Contexts/NavbarContext"

const Navbar = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);

    useEffect(() => {
        const check = async () => {
            try {
                const isLogged = await checkLogged();
                if (isLogged) {
                    await populateNavBar();
                    setIsLoggedIn(isLogged);
                }
                setLoading(false);
            }
            catch (err) {
                console.log(err);
            }
        }

        check();
    }, []);

    const populateNavBar = async () => {
        try {
            axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
            const response = await axios.get('/user/GetUserByAccessToken');
            delete axios.defaults.headers.common["xAuthAccessToken"];
            setUser(response.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <NavbarContext.Provider value={{ user, isLoggedIn }}>
        <div className="NavBarMain">
            <div className="NavBarMenu">
                <NavLink to="/" className="NavBarButton">Home</NavLink>

                {!loading && (
                    <>
                        {isLoggedIn ? (
                            <>
                                <NavLink to="/wallet" className="NavBarButton">Wallet</NavLink>
                                <NavLink to="/profile" className="NavBarButton">
                                    Profile
                                    <img className="NavAvatar" src={`data:image/png;base64,${user.avatar}`} alt="" />
                                </NavLink>  
                                 
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
        { children }
        </NavbarContext.Provider>
    );
}

export default Navbar;