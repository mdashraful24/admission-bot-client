import { Link } from "react-router";

const CallToAction = () => {
    return (
        <div className="relative px-4 py-20 gradient-primary text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                {/* <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}></div> */}
            </div>
            <div className="container mx-auto text-center relative z-10">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                    Ready to Transform Your Admissions Process?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                    Start your today and experience the future of admissions management with Admission Bot.
                </p>
                <Link to="/chat" className="btn btn-light btn-lg rounded-lg font-semibold">
                    Get Started Today
                </Link>
            </div>
        </div>
    );
};

export default CallToAction;
