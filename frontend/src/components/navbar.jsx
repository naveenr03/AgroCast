import { Link, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"



export  const Navbar = () => {

    const [cookies, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate();

    const logout = () => {
        setCookies("access_token", "")
        window.localStorage.removeItem("userID")
        navigate("/")
    }

    return (
        <div className="navbar">
            <Link to="/home">Home</Link>
            {!cookies.access_token ?
             <Link to="/">Login/Register</Link> : <button onClick={logout}>Logout</button>}
        </div>
    )
}