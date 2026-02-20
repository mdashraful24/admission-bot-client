const WhyChooseUs = () => {
    return (
        <div className="px-4 pb-16 md:pb-20 lg:pb-28">
            <div className="container mx-auto">
                <h3 className="text-3xl lg:text-5xl font-semibold text-center mb-4">
                    Why Choose Us
                </h3>
                <p className="text-lg md:text-xl text-center mb-8 md:mb-12">
                    Everything you need for seamless admissions management
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '🤖',
                            title: 'AI-Powered Chat',
                            description: 'Get instant answers to admission queries with our intelligent chatbot'
                        },
                        {
                            icon: '📊',
                            title: 'Real-Time Analytics',
                            description: 'Track applications and analytics in real-time with detailed insights'
                        },
                        {
                            icon: '⚡',
                            title: 'Lightning Fast',
                            description: 'Optimized performance for smooth user experience'
                        },
                        {
                            icon: '🔒',
                            title: 'Secure & Reliable',
                            description: 'Enterprise-grade security for your sensitive data'
                        },
                        {
                            icon: '🌐',
                            title: 'Multi-Language',
                            description: 'Support for multiple languages to reach more students'
                        },
                        {
                            icon: '📱',
                            title: 'Fully Responsive',
                            description: 'Fully responsive design for all devices and screen sizes'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="card p-6 hover:shadow-xl transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">
                                {feature.title}
                            </h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
