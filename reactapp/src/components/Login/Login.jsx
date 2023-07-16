import React, { Component } from 'react';
import axios from '../../../node_modules/axios/index';
import { AddToStorage } from '../../Functions/Functions';
import { checkLogged } from '../../Functions/Functions';
import { Navigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '', email: '', password: '', loading: true, isLoggedIn: false};
    }

    async componentDidMount() {
        const isLoggedIn = this.state.isLoggedIn;

        try {
            const isLoggedIn2 = await checkLogged();
           
            if (!isLoggedIn2) {
                this.setState({ isLoggedIn });                
                this.setState({ loading: false });
                return;
            }
            this.setState({ isLoggedIn:true });
            this.setState({ loading: false });
        }
        catch (err) {
            console.log(err);
        }
    }
        
    renderLogin() {
        const { email, password, isLoggedIn } = this.state;
                
        if (isLoggedIn) {
            return <Navigate to="/" />;
        }

        return (            
            <div>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                <h2>Login</h2>

                <form onSubmit={this.confirmLogin}>
                    <label>
                        Email:
                        <input type="email" name="email" value={email} onChange={this.handleChange} required />
                    </label>
                    <br /><br />
                    <label>
                        Password:
                        <input type="password" name="password" value={password} onChange={this.handleChange} required /> <br />
                    </label>
                    <br />

                    <button type="submit" className="AllButton">Login</button>
                </form>
            </div>
        );
    }

    render() {
        let content = this.state.loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} ><ThreeDots color="#00BFFF" height={80} width={80} /></div> : this.renderLogin();
        
        return (
            <div>
                { content }
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
            toast.error(err.response.data, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
}