import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import "./MyPosts.css"
import ReactPaginate from 'react-paginate';
import { NavbarContext } from "../../../Contexts/NavbarContext";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [text, setText] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const { user } = useContext(NavbarContext);

    useEffect(() => {
        const check = async () => {
            try {
                const totalCount = await getCountOfPosts();
                const pageSize = 5;
                setTotalPages(Math.ceil(totalCount / pageSize));
                axios.defaults.headers.common['xAuthAccessToken'] = localStorage.getItem('accessToken');
                const response = await axios.get(`/post/GetUserPosts?PageNumber=1&PageSize=${pageSize}`);
                delete axios.defaults.headers.common['xAuthAccessToken'];
                setPosts(response.data);
                setLoading(false);
            }

            catch (err) {
                console.log(err);
            }
        };

        check();
    }, []);

    const handlePageChange = async (selectedPage) => {
        setLoadingPosts(true);
        axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
        const response = await axios.get(`/post/GetUserPosts?PageNumber=${selectedPage.selected + 1}&PageSize=5`);
        delete axios.defaults.headers.common["xAuthAccessToken"];
        setPosts(response.data);
        setLoadingPosts(false);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const isImageFile = (file) => {
        const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
        return acceptedImageTypes.includes(file.type);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const maxSize = 1 * 1024 * 1024;
        const maxResolution = 1920;

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

        if (file) {
            const img = new Image();
            img.onload = () => {
                const width = img.width;
                const height = img.height;
                if (width > maxResolution || height > maxResolution) {
                    toast.error(`The maximum image resolution must be ${maxResolution}x${maxResolution} pixels.`, {
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
                else {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const imageData = reader.result;
                        const blob = new Blob([new Uint8Array(imageData)], { type: file.type });
                        const base64Avatar = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result.split(',')[1]);
                            reader.readAsDataURL(blob);

                        });
                        setImage(base64Avatar);
                        toast.success('File uploaded successfully!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    };
                    reader.readAsArrayBuffer(file);
                }
            };
            img.src = URL.createObjectURL(file);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            setLoadingPosts(true);
            axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
            await axios.post(`/post/CreatePost`, { title, text, image });
            delete axios.defaults.headers.common["xAuthAccessToken"];
            toast.success('Post has been sended!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setImage('');
            setTitle('');
            setText('');
        }
        catch (err) {
            console.log();
        };
        setLoadingPosts(false);
    }

    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return dateTime.toLocaleString('ru-RU', options);
    };

    const renderFormPost = () => {
        return (
            <>
                <div className="Forma">
                    <div className={`overlay ${loadingPosts ? 'visible' : ''}`}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <ThreeDots color="#00BFFF" height={80} zwidth={80} />
                        </div>
                    </div>
                    <form onSubmit={handleCreatePost} className="create-post-form">
                        <div className="form-group">
                            <label htmlFor="title">Title:</label>
                            <input type="text" id="title" value={title} onChange={handleTitleChange} maxLength={30} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="text">Text:</label>
                            <textarea
                                id="text"
                                value={text}
                                onChange={handleTextChange}
                                required
                                className="text-area"
                                maxLength={800}
                            />
                        </div>
                        {image !== "" ? <div>
                            <img src={`data:image/png;base64,${image}`} className="postPhoto" alt="" />
                        </div> : <></>}
                        <div className="file-upload">
                            <label htmlFor="clientAvatar" className="custom-file-upload">Click to select image
                                <input type="file" id="clientAvatar" name="clientAvatar" placeholder="" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <button type="submit" className="submit-button">Create Post</button>
                    </form>
                </div>               
            </>
        );
    };


    const renderWall = () => {
        if (posts.length === 0) {
            return (
                <div>
                    <h3>Your Wall is Empty:</h3>
                </div>
            );
        }

        return (
            <>
                <div className={`overlay ${loading ? 'visible' : ''}`}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <ThreeDots color="#00BFFF" height={80} width={80} />
                    </div>
                </div>

                <h2>Your Wall</h2>
                <br/>
                {posts.map((post) => (
                    <>
                        <div className="Posts">
                            <div className="Up">
                                <img src={`data:image/png;base64,${user.avatar}`} className="UpAvatar" alt="" /> 
                                <p className="UpName">{user.userName}</p>
                                <p className="UpDate">{formatDateTime(post.date)}</p>
                            </div>
                            <div className="Down">
                                <div className="Post">
                                    <div>
                                        <h3>{post.title}</h3>

                                        <div className="PostText">
                                            {post.text}
                                        </div>

                                        <div >
                                            <img src={`data:image/png;base64,${post.photo}`} alt="" className="PostPhoto"/>
                                        </div>
                                    </div>
                                </div>    
                            </div>

                        </div>    
                    
                   
                    
                    </>
                ))}
                <ReactPaginate
                    className="pagination"
                    pageCount={totalPages}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    activeClassName={"active"}
                    nextLinkClassName={"disable"}
                    previousClassName={"disable"}
                />
            </>
        );
    };

    const getCountOfPosts = async () => {
        try {
            axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
            const response = await axios.get(`/post/GetCountOfUserPosts`);
            delete axios.defaults.headers.common['xAuthAccessToken'];
            return response.data;
        }
        catch (err) {
            console.log(err);
        }
    }

    let contents = loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
    ) : (
        renderFormPost()
    );

    let wall = loading ? <></> : renderWall();
    return (
        <div>
            <h2>Posts</h2>
            {contents}
            {wall}
        </div>
    );
};

export default MyPosts;