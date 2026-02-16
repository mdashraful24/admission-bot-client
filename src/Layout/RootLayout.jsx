import '../App.css'
import { Outlet } from "react-router";
import Navbar from "../shared/Navbar.jsx/Navbar";
import Footer from "../shared/Footer/Footer";

const RootLayout = () => {
    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
            {/* Helmet */}
            <title>Home | Admission Bot</title>

            <Navbar /> 
            <Outlet />
            <Footer />
        </div>
    );
};

export default RootLayout;