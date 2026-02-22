import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// API Base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Validation Schema with proper validation
const validationSchema = yup.object({
    sscResult: yup
        .number()
        .typeError('SSC result must be a number')
        .min(0, 'GPA cannot be less than 0')
        .max(5, 'GPA cannot exceed 5')
        .required('SSC result is required')
        .test('two-decimals', 'GPA must have up to 2 decimal places',
            value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),

    hscResult: yup
        .number()
        .typeError('HSC result must be a number')
        .min(0, 'GPA cannot be less than 0')
        .max(5, 'GPA cannot exceed 5')
        .required('HSC result is required')
        .test('two-decimals', 'GPA must have up to 2 decimal places',
            value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),

    group: yup
        .string()
        .oneOf(['science', 'commerce', 'arts'], 'Please select a valid group')
        .required('Please select your group'),

    scienceChoice: yup.string().when('group', {
        is: 'science',
        then: (schema) => schema
            .oneOf(['Math', 'Biology', 'Both'], 'Please select a valid stream')
            .required('Please select your science stream'),
        otherwise: (schema) => schema.notRequired()
    }),

    engResult: yup
        .number()
        .typeError('English result must be a number')
        .min(0, 'GPA cannot be less than 0')
        .max(5, 'GPA cannot exceed 5')
        .required('English result is required')
        .test('two-decimals', 'GPA must have up to 2 decimal places',
            value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),

    mathResult: yup.number().when(['group', 'scienceChoice'], {
        is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both'),
        then: (schema) => schema
            .typeError('Mathematics result must be a number')
            .min(0, 'GPA cannot be less than 0')
            .max(5, 'GPA cannot exceed 5')
            .required('Mathematics result is required')
            .test('two-decimals', 'GPA must have up to 2 decimal places',
                value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
        otherwise: (schema) => schema.notRequired()
    }),

    phyResult: yup.number().when(['group', 'scienceChoice'], {
        is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both'),
        then: (schema) => schema
            .typeError('Physics result must be a number')
            .min(0, 'GPA cannot be less than 0')
            .max(5, 'GPA cannot exceed 5')
            .required('Physics result is required')
            .test('two-decimals', 'GPA must have up to 2 decimal places',
                value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
        otherwise: (schema) => schema.notRequired()
    }),

    chemResult: yup.number().when(['group', 'scienceChoice'], {
        is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both'),
        then: (schema) => schema
            .typeError('Chemistry result must be a number')
            .min(0, 'GPA cannot be less than 0')
            .max(5, 'GPA cannot exceed 5')
            .required('Chemistry result is required')
            .test('two-decimals', 'GPA must have up to 2 decimal places',
                value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
        otherwise: (schema) => schema.notRequired()
    }),

    bioResult: yup.number().when(['group', 'scienceChoice'], {
        is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Biology' || scienceChoice === 'Both'),
        then: (schema) => schema
            .typeError('Biology result must be a number')
            .min(0, 'GPA cannot be less than 0')
            .max(5, 'GPA cannot exceed 5')
            .required('Biology result is required')
            .test('two-decimals', 'GPA must have up to 2 decimal places',
                value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
        otherwise: (schema) => schema.notRequired()
    }),

    // Golden GPA flags
    sscGolden: yup.string().when('sscResult', {
        is: (value) => parseFloat(value) === 5.0,
        then: (schema) => schema.required('Please select Yes or No'),
        otherwise: (schema) => schema.notRequired()
    }),

    hscGolden: yup.string().when('hscResult', {
        is: (value) => parseFloat(value) === 5.0,
        then: (schema) => schema.required('Please select Yes or No'),
        otherwise: (schema) => schema.notRequired()
    }),

    interests: yup.string()
});

const EligibilityCalculator = () => {
    const [result, setResult] = useState(null);
    const [showGuidelines, setShowGuidelines] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            group: '',
            scienceChoice: '',
            sscResult: '',
            hscResult: '',
            sscGolden: 'no',
            hscGolden: 'no',
            engResult: '',
            mathResult: '',
            phyResult: '',
            chemResult: '',
            bioResult: '',
            interests: ''
        }
    });

    const group = watch('group');
    const scienceChoice = watch('scienceChoice');
    const sscResult = watch('sscResult');
    const hscResult = watch('hscResult');

    // Watch all required fields
    const engResult = watch('engResult');
    const mathResult = watch('mathResult');
    const phyResult = watch('phyResult');
    const chemResult = watch('chemResult');
    const bioResult = watch('bioResult');

    // Check if GPA is 5.00 to show Golden option
    const showGoldenOption = (gpa) => {
        return parseFloat(gpa) === 5.0;
    };

    // Function to check if step 1 (Basic Results) is complete
    const isStep1Complete = () => {
        return sscResult && hscResult;
    };

    // Function to check if step 2 (Group & Subjects) is complete
    const isStep2Complete = () => {
        // Check if group is selected
        if (!group) return false;

        // Check if science stream is selected when group is science
        if (group === 'science' && !scienceChoice) return false;

        // Check if English result is provided
        if (!engResult) return false;

        // Check science subject results based on selection
        if (group === 'science') {
            if (scienceChoice === 'Math' || scienceChoice === 'Both') {
                if (!mathResult || !phyResult || !chemResult) return false;
            }
            if (scienceChoice === 'Biology' || scienceChoice === 'Both') {
                if (!bioResult) return false;
            }
        }

        return true;
    };

    // Update current step based on which sections are complete
    useEffect(() => {
        if (isStep2Complete()) {
            setCurrentStep(3);
        } else if (isStep1Complete()) {
            setCurrentStep(2);
        } else {
            setCurrentStep(1);
        }
    }, [sscResult, hscResult, group, scienceChoice, engResult, mathResult, phyResult, chemResult, bioResult]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (group !== 'science') {
            setValue('scienceChoice', '');
            setValue('mathResult', '');
            setValue('phyResult', '');
            setValue('chemResult', '');
            setValue('bioResult', '');
        }
    }, [group, setValue]);

    const recommendFromKeywords = (interests, departmentType) => {
        if (!interests) return "No interests provided.";

        const words = interests.toLowerCase()
            .match(/\b[a-zA-Z]+\b/g)
            ?.slice(0, 4) || [];

        if (words.length === 0) return "Please enter valid interests.";

        let eligibleDepts = [];
        if (departmentType === 'pharmacy') {
            eligibleDepts = ['Pharmacy'];
        } else {
            eligibleDepts = Object.entries(recommendationKeywords)
                .filter(([dept, keywords]) =>
                    words.some(word => keywords.some(keyword =>
                        keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())
                    ))
                )
                .map(([dept]) => dept);
        }

        return eligibleDepts.length > 0
            ? [...new Set(eligibleDepts)].sort().join('\n')
            : "No matching department found based on your interests.";
    };

    const checkEligibility = (data) => {
        const ssc = parseFloat(data.sscResult);
        const hsc = parseFloat(data.hscResult);
        const eng = parseFloat(data.engResult);
        const math = parseFloat(data.mathResult || 0);
        const phy = parseFloat(data.phyResult || 0);
        const chem = parseFloat(data.chemResult || 0);
        const bio = parseFloat(data.bioResult || 0);

        if (ssc <= 2.5 || hsc <= 2.5) {
            return {
                eligible: false,
                message: "Based on your SSC/HSC results, you don't meet the minimum eligibility criteria (GPA > 2.5 required).",
                deptType: null
            };
        }

        if (group === 'science') {
            if (scienceChoice === 'Math') {
                if (eng > 2.5 && math > 2.5 && phy > 2.5 && chem > 2.5) {
                    return {
                        eligible: true,
                        message: departmentKeywords.dept4.join('\n'),
                        deptType: 'math'
                    };
                } else {
                    return {
                        eligible: false,
                        message: "You don't meet the subject-wise requirements for Science (Mathematics) programs. Each subject requires GPA > 2.5.",
                        deptType: null
                    };
                }
            }

            else if (scienceChoice === 'Biology') {
                if (eng > 2.5 && bio > 2.5 && phy > 2.5 && chem > 2.5) {
                    return {
                        eligible: true,
                        message: departmentKeywords.dept3.join('\n'),
                        deptType: 'biology'
                    };
                } else {
                    return {
                        eligible: false,
                        message: "You don't meet the subject-wise requirements for Science (Biology) programs. Each subject requires GPA > 2.5.",
                        deptType: null
                    };
                }
            }

            else if (scienceChoice === 'Both') {
                if (eng > 2.5 && math > 2.5 && phy > 2.5 && chem > 2.5 && bio > 2.5) {
                    if (bio > 3.5 && phy > 3.0 && chem > 3.5 && math > 3.0) {
                        return {
                            eligible: true,
                            message: departmentKeywords.dept6.join('\n'),
                            deptType: 'pharmacy'
                        };
                    } else {
                        return {
                            eligible: true,
                            message: departmentKeywords.dept5.join('\n'),
                            deptType: 'both_low'
                        };
                    }
                } else {
                    return {
                        eligible: false,
                        message: "You don't meet the subject-wise requirements for Science (Both) programs. Each subject requires GPA > 2.5.",
                        deptType: null
                    };
                }
            }
        }

        else { // Commerce or Arts
            if (eng > 2.5) {
                return {
                    eligible: true,
                    message: departmentKeywords.dept2.join('\n'),
                    deptType: 'commerce_high'
                };
            } else {
                return {
                    eligible: true,
                    message: departmentKeywords.dept1.join('\n'),
                    deptType: 'commerce_low'
                };
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            // Try API first
            const response = await fetch(`${API_BASE_URL}/eligibility`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sscResult: parseFloat(data.sscResult),
                    hscResult: parseFloat(data.hscResult),
                    sscGolden: data.sscGolden || 'no',
                    hscGolden: data.hscGolden || 'no',
                    group: data.group,
                    scienceChoice: data.scienceChoice,
                    engResult: parseFloat(data.engResult),
                    mathResult: data.mathResult ? parseFloat(data.mathResult) : null,
                    phyResult: data.phyResult ? parseFloat(data.phyResult) : null,
                    chemResult: data.chemResult ? parseFloat(data.chemResult) : null,
                    bioResult: data.bioResult ? parseFloat(data.bioResult) : null,
                    interests: data.interests
                }),
            });

            if (response.ok) {
                const apiResult = await response.json();
                setResult({
                    eligibility: apiResult.eligibility,
                    recommendations: apiResult.recommendations
                });
            } else {
                // Fallback to local calculation
                const eligibilityResult = checkEligibility(data);
                if (eligibilityResult.eligible) {
                    const recommendations = recommendFromKeywords(
                        data.interests,
                        eligibilityResult.deptType
                    );
                    setResult({
                        eligibility: eligibilityResult.message,
                        recommendations: recommendations
                    });
                } else {
                    setResult({
                        eligibility: eligibilityResult.message,
                        recommendations: ""
                    });
                }
            }
        } catch {
            // Fallback to local calculation on error
            const eligibilityResult = checkEligibility(data);
            if (eligibilityResult.eligible) {
                const recommendations = recommendFromKeywords(
                    data.interests,
                    eligibilityResult.deptType
                );
                setResult({
                    eligibility: eligibilityResult.message,
                    recommendations: recommendations
                });
            } else {
                setResult({
                    eligibility: eligibilityResult.message,
                    recommendations: ""
                });
            }
        }

        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    const getInputClassName = (error) => `
        w-full px-4 py-2 border rounded-lg
        focus:outline-none focus:ring-1
        ${error
            ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
        }
    `;

    const getSelectClassName = (error) => `
        w-full px-4 py-2 border rounded-lg appearance-none bg-white
        focus:outline-none focus:ring-1
        ${error
            ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
        }
    `;

    // Custom Select Component with arrow icon
    const CustomSelect = ({ label, options, error, registration, placeholder }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <select
                    {...registration}
                    className={getSelectClassName(error)}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error.message}
                </p>
            )}
        </div>
    );

    const steps = [
        { number: 1, title: 'Basic Results', description: 'SSC & HSC GPA' },
        { number: 2, title: 'Group & Subjects', description: 'Academic background' },
        { number: 3, title: 'Interests', description: 'Career preferences' }
    ];

    return (
        <div className="container mx-auto min-h-screen px-4 py-10 md:py-14 lg:py-20">
            {/* Helmet */}
            <title>Eligibility Calculator | DIU Admission Bot</title>

            <div className="text-center mb-14">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-5">
                    Find Your Perfect Department
                </h3>
                <p className="md:text-lg lg:text-xl max-w-3xl mx-auto">
                    Discover which university programs match your academic results and career interests
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                {showGuidelines && (
                    <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-xl p-7 mb-14 relative">
                        <button
                            onClick={() => setShowGuidelines(false)}
                            className="absolute top-4 right-4 hover:text-red-600 hover:bg-red-50 p-1 rounded-full"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex items-start space-x-4">
                            <div className="bg-indigo-100 rounded-full p-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">Quick Guidelines</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Enter your SSC and HSC GPA (0-5 scale)
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Select your group and subjects
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Add your interests for personalized recommendations
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Get instant eligibility results
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-14">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex-1 relative">
                                {index < steps.length - 1 && (
                                    <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200">
                                        <div className="h-full bg-indigo-600"
                                            style={{ width: currentStep > step.number ? '100%' : '0%' }} />
                                    </div>
                                )}
                                <div className="relative flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                                            ${currentStep >= step.number
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-500'}`}
                                    >
                                        {currentStep > step.number ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : step.number}
                                    </div>
                                    <div className="text-center mt-2">
                                        <div className="text-sm font-medium">{step.title}</div>
                                        <div className="text-xs text-gray-500">{step.description}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-linear-to-r from-blue-100 to-white p-2 border-b border-gray-200">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Student Information Form
                        </h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 bg-linear-to-br from-slate-50 via-white to-indigo-50">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h3 className="text-lg font-medium flex items-center">
                                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                                    Basic Academic Results
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 no-animation-grid">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            SSC Result (GPA) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('sscResult')}
                                            className={getInputClassName(errors.sscResult)}
                                            placeholder="GPA out of 5.00"
                                        />
                                        {errors.sscResult && (
                                            <p className="text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.sscResult.message}
                                            </p>
                                        )}
                                        {/* Golden GPA Option - SSC */}
                                        {showGoldenOption(sscResult) && (
                                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-xs md:text-sm font-medium text-yellow-700">Golden GPA?</span>
                                                    <div className="flex items-center gap-3 ml-auto">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                value="yes"
                                                                {...register('sscGolden')}
                                                                className="w-4 h-4 text-yellow-600"
                                                            />
                                                            <span className="text-xs md:text-sm">Yes</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                value="no"
                                                                {...register('sscGolden')}
                                                                className="w-4 h-4 text-yellow-600"
                                                            />
                                                            <span className="text-xs md:text-sm">No</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors.sscGolden && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.sscGolden.message}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            HSC Result (GPA) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('hscResult')}
                                            className={getInputClassName(errors.hscResult)}
                                            placeholder="GPA out of 5.00"
                                        />
                                        {errors.hscResult && (
                                            <p className="text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.hscResult.message}
                                            </p>
                                        )}
                                        {/* Golden GPA Option - HSC */}
                                        {showGoldenOption(hscResult) && (
                                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-yellow-700">Golden GPA?</span>
                                                    <div className="flex items-center gap-3 ml-auto">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                value="yes"
                                                                {...register('hscGolden')}
                                                                className="w-4 h-4 text-yellow-600"
                                                            />
                                                            <span className="text-sm">Yes</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                value="no"
                                                                {...register('hscGolden')}
                                                                className="w-4 h-4 text-yellow-600"
                                                            />
                                                            <span className="text-sm">No</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                {errors.hscGolden && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.hscGolden.message}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className={`text-lg font-medium flex items-center ${isStep2Complete() ? 'text-green-600' : 'text-gray-900'
                                    }`}>
                                    <span className={`rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 ${isStep2Complete()
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-indigo-100 text-indigo-600'
                                        }`}>
                                        2
                                    </span>
                                    Group & Subject Results
                                    {isStep2Complete() && (
                                        <svg className="w-5 h-5 ml-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 no-animation-grid">
                                    <CustomSelect
                                        label="Your Group"
                                        options={[
                                            { value: 'science', label: 'Science' },
                                            { value: 'commerce', label: 'Commerce' },
                                            { value: 'arts', label: 'Arts/Humanities' }
                                        ]}
                                        error={errors.group}
                                        registration={register('group')}
                                        placeholder="Select your group"
                                    />

                                    {group === 'science' && (
                                        <CustomSelect
                                            label="Science Stream"
                                            options={[
                                                { value: 'Math', label: 'Mathematics' },
                                                { value: 'Biology', label: 'Biology' },
                                                { value: 'Both', label: 'Both Mathematics & Biology' }
                                            ]}
                                            error={errors.scienceChoice}
                                            registration={register('scienceChoice')}
                                            placeholder="Select your stream"
                                        />
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            English Result <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('engResult')}
                                            className={getInputClassName(errors.engResult)}
                                            placeholder="Enter English GPA"
                                        />
                                        {errors.engResult && (
                                            <p className="text-sm text-red-600 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.engResult.message}
                                            </p>
                                        )}
                                    </div>

                                    {group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both') && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium">
                                                    Mathematics Result
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register('mathResult')}
                                                    className={getInputClassName(errors.mathResult)}
                                                    placeholder="Enter Math GPA"
                                                />
                                                {errors.mathResult && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.mathResult.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium">
                                                    Physics Result
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register('phyResult')}
                                                    className={getInputClassName(errors.phyResult)}
                                                    placeholder="Enter Physics GPA"
                                                />
                                                {errors.phyResult && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.phyResult.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium">
                                                    Chemistry Result
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register('chemResult')}
                                                    className={getInputClassName(errors.chemResult)}
                                                    placeholder="Enter Chemistry GPA"
                                                />
                                                {errors.chemResult && (
                                                    <p className="text-sm text-red-600 flex items-center">
                                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        {errors.chemResult.message}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {group === 'science' && (scienceChoice === 'Biology' || scienceChoice === 'Both') && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">
                                                Biology Result
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('bioResult')}
                                                className={getInputClassName(errors.bioResult)}
                                                placeholder="Enter Biology GPA"
                                            />
                                            {errors.bioResult && (
                                                <p className="text-sm text-red-600 flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.bioResult.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-medium flex items-center">
                                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">3</span>
                                    Career Interests
                                </h3>
                                <div className="pl-8">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            What are you interested in?
                                        </label>
                                        <input
                                            type="text"
                                            {...register('interests')}
                                            className={getInputClassName(errors.interests)}
                                            placeholder="e.g., computer, programming, software, engineering, business, etc."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-800 text-white p-3 rounded-lg font-semibold hover:bg-indigo-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Check My Eligibility & Get Recommendations'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {result && (
                    <div id="results-section" className="space-y-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className={`px-6 py-4 ${result.eligibility.includes('❌') ? 'bg-linear-to-r from-red-500 to-pink-600' : 'bg-linear-to-r from-green-500 to-emerald-600'}`}>
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Eligibility Result
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    {result.eligibility.includes('❌') ? (
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-red-100 rounded-full p-2 shrink-0">
                                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-700">{result.eligibility}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-green-600 font-medium mb-4 flex items-center">
                                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                You are eligible for the following programs:
                                            </p>
                                            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                                                {result.eligibility}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {result.recommendations && !result.eligibility.includes('❌') && (
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-4">
                                    <h2 className="text-xl font-bold text-white flex items-center">
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Personalized Department Recommendations
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                                        </svg>
                                        Based on your interests: <span className="font-medium text-gray-800 ml-1">"{watch('interests')}"</span>
                                    </p>
                                    {result.recommendations.includes('No matching') ? (
                                        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                                            <p className="text-yellow-700">{result.recommendations}</p>
                                            <p className="text-sm text-yellow-600 mt-2">
                                                Try adding more specific interests like "computer programming", "business management", or "healthcare"
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                                                {result.recommendations}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EligibilityCalculator;
