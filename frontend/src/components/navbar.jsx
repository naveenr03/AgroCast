import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const logout = () => {
        window.localStorage.removeItem("userID");
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("location");
        setCookies("access_token", "", { path: "/" });
        navigate("/login");
    };
    

    return (
        <div className="navbar bg-black text-white flex justify-center items-center h-20">
            <Link to="/home" className="mx-4 text-lg">Home</Link>
            {!cookies.access_token ? (
                <Link to="/" className="mx-4 text-lg">Login/Register</Link>
            ) : (
                <button onClick={logout} className="mx-4 text-lg">Logout</button>
            )}
        </div>
    );
};
