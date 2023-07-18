import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import News from './components/News/News';
import Profile from './components/Profile/Profile';
import Settings from './components/Profile/Settings/Settings';
import Registration from './components/Registration/Registration';
import Wallet from './components/Wallet/Wallet';
import 'react-toastify/dist/ReactToastify.css';
import "./components/css/forall.css";
export default function App() {
    return (
        <>
            <Navbar>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<News />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Registration />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/recomendations" element={<h1>In development</h1>} />
                        <Route path="/profile/settings" element={<Settings />} />
                        <Route path="/wallet" element={<Wallet />} />
                    </Routes>
                </div>
                <footer>
                <hr />
                    <p>&copy; 2023 - CryptoShoto.</p>
                    <br />
                </footer>
            </ Navbar>
        </>
    );
}       
       