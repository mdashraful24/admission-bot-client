import { Link, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const menuButtonRef = useRef(null);

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

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        // Check if click is outside the dropdown and outside the menu button
        if (dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            menuButtonRef.current &&
            !menuButtonRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        // Add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);

    return (
        <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
                        <div className="hidden md:block">
                            <span className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-lg">
                                AB
                            </span>
                        </div>
                        <span className="text-lg md:text-2xl font-bold truncate drop-shadow md:drop-shadow-none">
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
                                        className={`px-3 py-1.5 rounded-lg font-semibold text-[0.95rem] transition-all duration-300 ${isActiveRoute('/eligibility-calculator')
                                            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'bg-linear-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg'
                                            }`}
                                    >
                                        Eligibility Calculate
                                    </Link>
                                    <Link
                                        to="/waiver-calculator"
                                        className={`px-3 py-1.5 rounded-lg font-semibold text-[0.95rem] transition-all duration-300 ${isActiveRoute('/waiver-calculator')
                                            ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                            : 'bg-linear-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg'
                                            }`}
                                    >
                                        Waiver Calculate
                                    </Link>
                                </>
                            )}
                        </div>

                        <Link to="/chat" className="px-3 py-1 md:py-1.5 font-semibold text-[0.95rem] border border-gray-200 rounded-lg hover:bg-linear-to-r from-blue-50 to-blue-100">
                            Chat
                        </Link>

                        {/* Menu Button */}
                        {!isHomePage && (
                            <div className="relative lg:hidden">
                                <button
                                    ref={menuButtonRef}
                                    onClick={toggleMenu}
                                    className="py-2 rounded-lg hover:bg-slate-100 transition-colors"
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? (
                                        <X className="w-6 h-6" />
                                    ) : (
                                        <Menu className="w-6 h-6" />
                                    )}
                                </button>

                                {/* Dropdown Menu - Right aligned */}
                                {isMenuOpen && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slideDown overflow-hidden"
                                    >
                                        <div className="flex flex-col">
                                            <Link
                                                to="/eligibility-calculator"
                                                className={`px-4 py-3 font-semibold text-[0.95rem] transition-all duration-300 ${isActiveRoute('/eligibility-calculator')
                                                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                                    : 'hover:bg-slate-50'
                                                    }`}
                                                onClick={closeMenu}
                                            >
                                                Eligibility Calculate
                                            </Link>
                                            <Link
                                                to="/waiver-calculator"
                                                className={`px-4 py-3 font-semibold text-[0.95rem] transition-all duration-300 ${isActiveRoute('/waiver-calculator')
                                                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                                                    : 'hover:bg-slate-50'
                                                    }`}
                                                onClick={closeMenu}
                                            >
                                                Waiver Calculate
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
