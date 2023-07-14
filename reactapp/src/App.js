import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import Coins from './components/Coins/Coins';
import { Login } from './components/Login/Login';
import { Navbar } from './components/Navbar/Navbar';
import News from './components/News/News';
import Profile from './components/Profile/Profile';
import Settings from './components/Profile/Settings/Settings';
import Registration from './components/Registration/Registration';
//import AuthContext from './contexts/AuthContext';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<News />} />
                    <Route path="/coins" element={<Coins />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Registration />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/settings" element={<Settings />} />
                </Routes>
                <hr />
                <footer>
                    <p>&copy; 2023 - CryptoShoto.</p>
                    <br />
                </footer>
            </div>
        );
    }
}       
       