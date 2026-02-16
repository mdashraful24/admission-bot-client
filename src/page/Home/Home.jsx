import { useEffect } from "react";
import Hero from "./Hero/Hero";
import Features from "./Features/Features";
import CallToAction from "./CallToAction/CallToAction";
import WhyChooseUs from "./WhyChooseUs/WhyChooseUs";

const Home = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen">
            <Hero />
            <Features />
            <WhyChooseUs />
            <CallToAction />
        </div>
    );
};

export default Home;
