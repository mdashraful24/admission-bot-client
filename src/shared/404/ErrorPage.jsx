import { Link } from 'react-router';
import { FaHome, FaRobot } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import Lottie from 'lottie-react';
import Error from "../../assets/404/404 blue";

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="lg:order-2 order-1">
                        <div className="relative">
                            <div className="w-64 h-64 md:w-100 md:h-100 mx-auto">
                                <Lottie
                                    animationData={Error}
                                    loop={true}
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 text-center lg:text-left">
                        <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <MdErrorOutline className="inline mr-1" />
                            Page Not Found
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            <span>Oops! </span>
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                                Lost Your Way?
                            </span>
                        </h1>

                        <p className="text-lg mb-6 leading-relaxed">
                            The page you're looking for doesn't exist or has been moved.
                            Don't worry though, our admission bot is still here to help you!
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                            <Link
                                to="/"
                                className="group bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
                            >
                                <FaHome className="mr-2" />
                                Back to Home
                            </Link>

                            <Link
                                to="/chat"
                                className="group bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 flex items-center"
                            >
                                <FaRobot className="mr-2" />
                                Chat with Bot
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
