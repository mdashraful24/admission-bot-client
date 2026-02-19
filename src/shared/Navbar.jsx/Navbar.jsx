import { Link } from "react-router";

const Navbar = () => {
    return (
        <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm px-4">
            <div className="container mx-auto">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-lg">
                            AB
                        </div>
                        <span className="text-xl md:text-2xl font-bold">DIU Admission Bot</span>
                    </Link>
                    <div>
                        <Link to="/chat" className="btn btn-primary">Get Started</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;