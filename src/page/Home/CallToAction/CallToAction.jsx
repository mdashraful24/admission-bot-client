import { Link } from "react-router";

const CallToAction = () => {
    return (
        <div className="bg-blue-600 text-white px-4 py-12 md:py-16 lg:py-20 overflow-hidden">
            <div className="container mx-auto text-center relative z-10">
                <h3 className="text-3xl lg:text-5xl font-semibold mb-5">
                    Ready to Transform Your Admissions Process?
                </h3>
                <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                    Start your today and experience the future of admissions management with DIU Admission Bot.
                </p>
                <Link to="/chat" className="btn btn-light btn-lg rounded-lg font-semibold">
                    Get Started Today
                </Link>
            </div>
        </div>
    );
};

export default CallToAction;
