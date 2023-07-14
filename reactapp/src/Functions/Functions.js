import axios from '../../node_modules/axios/index';

export const checkLogged = async () => {

    if (localStorage.getItem("refreshToken")) {
        axios.defaults.headers.common["xauthrefreshtoken"] = localStorage.getItem("refreshToken");
        const response1 = await axios.get("/validatetoken/CheckToken");
        delete axios.defaults.headers.common["xauthrefreshtoken"];

        if (response1.data === true) {

            axios.defaults.headers.common["xAuthRefreshToken"] = localStorage.getItem("refreshToken");
            axios.defaults.headers.common["xAuthAccessToken"] = localStorage.getItem("accessToken");
            const response2 = await axios.get("/validatetoken/CheckAndGiveAccessToken");
            delete axios.defaults.headers.common["xAuthRefreshToken"];
            delete axios.defaults.headers.common["xAuthAccessToken"];

            if (response2.data !== "") {
                localStorage.removeItem("accessToken");
                localStorage.setItem("accessToken", response2.data);

                return true;
            }           

            return true;
        }

        localStorage.clear();
        return false; 
    }

    return false;
}

export const LogOut = async () => {
    try {
        axios.defaults.headers.common["xAuthRefreshToken"] = localStorage.getItem("refreshToken");
        const response = await axios.delete("/user/DeleteRefreshToken");
        delete axios.defaults.headers.common["xAuthRefreshToken"];

        localStorage.clear();
    }
    catch (err) {
        console.log(err);
    }
}

export const AddToStorage = (response) => {
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
}
