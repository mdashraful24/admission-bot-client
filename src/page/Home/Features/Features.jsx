import { Link } from "react-router";

const Features = () => {
    const features = [
        // {
        //     id: 'department_recommendation',
        //     title: 'Department Recommendation',
        //     description: 'Find the perfect department based on your interests, academic background, and career goals.',
        //     icon: (
        //         <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        //         </svg>
        //     ),
        //     path: '/department-recommendation',
        //     color: 'blue'
        // },
        {
            id: 'eligibility_calculator',
            title: 'Eligibility Calculator',
            description: 'Check your eligibility for various programs and universities based on your academic profile.',
            icon: (
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            path: '/eligibility-calculator',
            color: 'green'
        },
        {
            id: 'final_waiver_calculator',
            title: 'Final Waiver Calculator',
            description: 'Calculate your final waiver amount and understand your fee structure after scholarships.',
            icon: (
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            path: '/waiver-calculator',
            color: 'purple'
        },
        {
            id: 'tuition_fee_calculator',
            title: 'Tuition Fee Calculator',
            description: 'Estimate your tuition fees and plan your education budget effectively.',
            icon: (
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            path: '/tuition-fee-calculator',
            color: 'orange'
        }
    ];

    const getBgColor = (color) => {
        const colors = {
            // blue: 'bg-blue-50 hover:bg-blue-100',
            green: 'bg-green-50 hover:bg-green-100',
            purple: 'bg-purple-50 hover:bg-purple-100',
            orange: 'bg-orange-50 hover:bg-orange-100'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="px-4 pb-20">
            <div className="container mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                    Powerful Features
                </h2>
                <p className="text-center mb-12 text-lg">
                    Discover tools designed to simplify your educational journey
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => (
                        <Link
                            key={feature.id}
                            to={feature.path}
                            className="group cursor-pointer block"
                        >
                            <div className={`
                                card ${getBgColor(feature.color)}
                                rounded-xl p-6 shadow-md hover:shadow-xl
                                transition-all duration-300 ease-in-out
                                hover:-translate-y-1
                                border border-gray-100 h-full
                            `}>
                                <div className="flex flex-col items-center h-full text-center">
                                    <div className="mb-4 transition-transform duration-300 ease-in-out">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold leading-relaxed mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed grow">
                                        {feature.description}
                                    </p>
                                    <div className="mt-4 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                        <span className="inline-flex items-center text-sm font-semibold">
                                            Learn more
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
