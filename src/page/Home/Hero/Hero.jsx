import { Link } from "react-router";

const Hero = () => {
    return (
        <div className="relative overflow-hidden px-4 pt-10 pb-16 md:py-16 lg:py-20">
            <div className="container mx-auto text-center animate-fadeInUp">
                <h3 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
                    <span className="text-gradient">Intelligent Admissions Simplified</span>
                    {/* <span className="text-slate-900"> </span> */}
                </h3>
                <p className="text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto">
                    Streamline your admission process with AI-powered assistance. Get instant answers, track applications, and make informed decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/chat" className="btn btn-primary btn-lg rounded-lg">
                        Start Chatting
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;
