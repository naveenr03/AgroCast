import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        window.localStorage.removeItem("userID");
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("location");
        setCookies("access_token", "", { path: "/" });
        navigate("/");
    };

    const NavLink = ({ to, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`text-white hover:text-green-200 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-green-700' : ''
                }`}
            >
                {children}
            </Link>
        );
    };

    return (
        <nav className="bg-green-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img className="h-12 w-12 rounded-sm" src="/images/final.png"   alt="AgroCast" />
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/home">Home</NavLink>
                                <NavLink to="/weather">Weather</NavLink>
                                <NavLink to="/crop-recommendation">Crops</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {!cookies.access_token ? (
                                <Link
                                    to="/"
                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login / Register
                                </Link>
                            ) : (
                                <button
                                    onClick={logout}
                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};