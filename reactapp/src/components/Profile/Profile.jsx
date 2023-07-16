import React, { useContext, useEffect, useState } from 'react';
import { LogOut } from '../../Functions/Functions';
import { NavLink } from 'react-router-dom';
import { checkLogged } from '../../Functions/Functions';
import { NavbarContext } from "../../Contexts/NavbarContext";
import axios from '../../../node_modules/axios/index';
import { ToastContainer, toast } from 'react-toastify';
import "./Profile.css";
import { ThreeDots } from 'react-loader-spinner';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useContext(NavbarContext);
    const [isHovered, setIsHovered] = useState(false);

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

    const handleLogout = () => {
        try {
            LogOut();
            window.location.href = '/';
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    }

    const renderProfile = () => {
        return (
            <>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                <div className="allcomponents">
                    <div className="firstcomponent">
                        <div className="avatar-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                            <img src={`data:image/png;base64,${user.avatar}`} className="avatar" alt="" />
                            {isHovered && (<label className="edit-button">
                                New
                                <input type="file" name="clientAvatar" accept="image/*" onChange={handleImageUpload} required capture="false" />
                            </label>)}
                        </div>
                        <h3>{user.userName}</h3><br />
                    </div>
                    <h3>{user.email}</h3><br />
                    <div className="LogoutSettingButtons">
                        <NavLink>
                            <button className="AllButton" onClick={handleLogout}>Logout</button>
                        </NavLink>
                        <NavLink to="/profile/settings">
                            <button className="AllButton">Settings</button>
                        </NavLink>
                    </div>
                </div>
               
            </>
        );
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const maxSize = 2 * 1024 * 1024;

        if (file && !isImageFile(file)) {
            toast.error('Allowed extensions: image/jpeg, image/png, image/svg+xml, image/webp.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            e.target.value = null;
            return;
        }

        if (file && file.size > maxSize) {
            toast.error('The max size of photo: 2mb.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            e.target.value = null;
            return;
        }

        const reader = new FileReader();

        reader.onloadend = async () => {
            const imageData = reader.result;
            const blob = new Blob([new Uint8Array(imageData)], { type: file.type });

            const base64Avatar = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(blob);
            });

            try {
                axios.defaults.headers.common['xAuthAccessToken'] = localStorage.getItem('accessToken');
                await axios.post('user/ChangeAvatar', { avatar: base64Avatar });
                delete axios.defaults.headers.common['xAuthAccessToken'];
                window.location.href = '/profile';
            }
            catch (err) {
                console.log(err);
                toast.error(err, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };

        if (file) {
            reader.readAsArrayBuffer(file);
        }
    };

    const isImageFile = (file) => {
        const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

        return acceptedImageTypes.includes(file.type);
    };

    const render = () => {
        let contents = loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} ><ThreeDots color="#00BFFF" height={80} width={80} /></div>
         : renderProfile();
        return (
            <div>
                {contents}
            </div>
        );
    }

    return (
        render()
    );
}

export default Profile;