import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Helper function to check if a route is active
    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    // Check if current route is home
    const isHomePage = location.pathname === "/";

    return (
        <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm px-4">
            <div className="container mx-auto">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-lg">
                            AB
                        </div>
                        <span className="text-xl md:text-2xl font-bold truncate drop-shadow md:drop-shadow-none">
                            DIU Admission Bot
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-4">
                            {!isHomePage && (
                                <>
                                    <Link
                                        to="/eligibility-calculator"
                                        className={`px-4 py-2 rounded-lg font-semibold text-[0.95rem] transition-all duration-300 ${isActiveRoute('/eligibility-calculator')
                                            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'bg-linear-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg'
                                            }`}
                                    >
                                        Eligibility Calculate
                                    </Link>
                                    <Link
                                        to="/waiver-calculator"
                                        className={`px-4 py-2 rounded-lg font-semibold text-[0.95rem] transition-all duration-300 ${isActiveRoute('/waiver-calculator')
                                            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'bg-linear-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg'
                                            }`}
                                    >
                                        Waiver Calculate
                                    </Link>
                                </>
                            )}
                        </div>

                        <Link to="/chat" className="px-3 py-2 font-semibold text-[0.95rem] border border-gray-200 rounded-xl drop-shadow hover:bg-linear-to-r from-blue-50 to-blue-100">Chat</Link>

                        {/* Menu Button */}
                        {!isHomePage && (
                            <button
                                onClick={toggleMenu}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile/Tablet Dropdown Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute left-0 right-0 top-16 bg-white border-b border-slate-100 shadow-lg py-4 px-4 z-50 animate-slideDown">
                        <div className="flex flex-col gap-2">
                            {!isHomePage && (
                                <>
                                    <Link
                                        to="/eligibility-calculator"
                                        className={`w-full py-3 px-4 rounded-lg font-semibold text-[0.95rem] text-center transition-all duration-300 ${isActiveRoute('/eligibility-calculator')
                                            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'bg-linear-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg'
                                            }`}
                                        onClick={closeMenu}
                                    >
                                        Eligibility Calculate
                                    </Link>
                                    <Link
                                        to="/waiver-calculator"
                                        className={`w-full py-3 px-4 rounded-lg font-semibold text-[0.95rem] text-center transition-all duration-300 ${isActiveRoute('/waiver-calculator')
                                            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'bg-linear-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg'
                                            }`}
                                        onClick={closeMenu}
                                    >
                                        Waiver Calculate
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
