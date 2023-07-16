import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { checkLogged } from '../../../Functions/Functions';
import { NavLink } from 'react-router-dom';
import { NavbarContext } from '../../../Contexts/NavbarContext';
import { ToastContainer, toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import "../../css/forall.css";
import { ThreeDots } from 'react-loader-spinner';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useContext(NavbarContext);
    const { handleSubmit: handleSubmitName, register: username, formState: { errors: errorsName } } = useForm();
    const { handleSubmit: handleSubmitPassword, register: password, formState: { errors: errorsPassword }, watch } = useForm();

    useEffect(() => {
        const check = async () => {
            try {
                if (await checkLogged()) {
                    setLoading(false);
                    return;
                }
                window.location.href = '/login';
            }
            catch (err) {
                console.log(err);
            }
        }

        check();
    }, []);

    const handleChangeName = async (data) => {

        axios.defaults.headers.common['xAuthAccessToken'] = localStorage.getItem('accessToken');
        await axios.post(`/user/ChangeName?name=${data.name}`);
        delete axios.defaults.headers.common['xAuthAccessToken'];

        window.location.href = '/profile/settings';
    };

    const handleChangePassword = async (data) => {
        const { newPassword, oldPassword } = data;

        try {
            axios.defaults.headers.common['xAuthAccessToken'] = localStorage.getItem('accessToken');
            await axios.post('/user/ChangePassword', { oldPassword, newPassword });
            delete axios.defaults.headers.common['xAuthAccessToken'];
        }
        catch (err) {
            toast.error('Wrong old password.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        toast.success('Password has been changed!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return;
    };

    const passwordd = watch('newPassword');


    const renderProfile = (user) => {
        return (
            <>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                <h3>Hello {user.userName}</h3>

                <form onSubmit={handleSubmitName(handleChangeName)}>
                    <div className="InputForm">
                        <label htmlFor="name">Change username:</label><br />
                        <input type="text" id="name" {...username('name', { required: 'Enter your username', minLength: { value: 3, message: 'Username must be at least 3 characters long' }, maxLength: { value: 10, message: 'Username must not exceed 15 characters' } })} />
                        {errorsName.name && <span className="ErrorValidation">{errorsName.name.message}</span>}
                    </div>
                    <button className="AllButton" type="submit">Change</button>
                </form>
                <br />
                <form onSubmit={handleSubmitPassword(handleChangePassword)}>
                    <div className="InputForm">
                        <label htmlFor="password">Change password:</label><br/>
                        <input type="password" id="oldPassword" placeholder="Old password..." {...password('oldPassword', { required: 'Enter a old password' })} />
                        {errorsPassword.oldPassword && <span className="ErrorValidation" >{errorsPassword.oldPassword.message}</span>}
                    </div>

                    <div className="InputForm">
                        <input type="password" id="newPassword" placeholder="New password..." {...password('newPassword', { required: 'Enter a new password', minLength: { value: 8, message: 'Password must be at least 8 characters long' }, pattern: { value: /^(?=.*\d)(?=.*[A-Z]).+$/, message: 'Password must contain at least one uppercase letter and a number' } })} />
                        {errorsPassword.newPassword && <span className="ErrorValidation">{errorsPassword.newPassword.message}</span>}
                    </div>

                    <div className="InputForm">
                        <input type="password" id="confirmPassword" placeholder="Confirm password..." {...password('confirmPassword', { required: 'Confirm your password', validate: value => value === passwordd || 'Passwords do not match' })} />
                        {errorsPassword.confirmPassword && <span className="ErrorValidation">{errorsPassword.confirmPassword.message}</span>}
                    </div>

                    <button className="AllButton" type="submit">Change password</button>
                </form>
                <br />
                <NavLink to="/profile">
                    <button className="AllButton">Go Back</button>
                </NavLink>
            </>
        );
    };

    let contents = loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} ><ThreeDots color="#00BFFF" height={80} width={80} /></div> : renderProfile(user);

    return (
        <div>
            {contents}
        </div>
    );
};

export default Settings;