import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { GraduationCap, BookOpen, Award, Compass, Loader2 } from 'lucide-react';
import facultiesData from "../../data/faculties.json"
import CustomSelect from '../../shared/CustomSelect/CustomSelect';

// Define options at the top
const groupOptions = [
    { id: 'science', name: 'Science', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'commerce', name: 'Commerce', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'arts', name: 'Arts/Humanities', icon: <Award className="w-4 h-4" /> }
];

const scienceStreamOptions = [
    { id: 'Math', name: 'Mathematics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Biology', name: 'Biology', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'Both', name: 'Both Mathematics & Biology', icon: <Award className="w-4 h-4" /> }
];

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
        .oneOf(groupOptions.map(opt => opt.id), 'Please select a valid group')
        .required('Please select your group'),

    scienceChoice: yup.string().when('group', {
        is: 'science',
        then: (schema) => schema
            .oneOf(scienceStreamOptions.map(opt => opt.id), 'Please select a valid stream')
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
        otherwise: (schema) => schema.transform(() => undefined).notRequired()
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
        otherwise: (schema) => schema.transform(() => undefined).notRequired()
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
        otherwise: (schema) => schema.transform(() => undefined).notRequired()
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
        otherwise: (schema) => schema.transform(() => undefined).notRequired()
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
    })
});

// Helper function to map group to faculty categories
const getGroupCategory = (group) => {
    switch (group) {
        case 'science':
            return ['science', 'engineering', 'health'];
        case 'commerce':
            return ['commerce', 'business'];
        case 'arts':
            return ['arts', 'humanities', 'social sciences'];
        default:
            return [];
    }
};

const EligibilityCalculator = () => {
    const [result, setResult] = useState(null);
    const [showGuidelines, setShowGuidelines] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
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
            bioResult: ''
        }
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        control,
        formState: { errors, isSubmitting, isValid }
    } = methods;

    const group = watch('group');
    const scienceChoice = watch('scienceChoice');
    const sscResult = watch('sscResult');
    const hscResult = watch('hscResult');
    const engResult = watch('engResult');
    const mathResult = watch('mathResult');
    const phyResult = watch('phyResult');
    const chemResult = watch('chemResult');
    const bioResult = watch('bioResult');

    // Flatten programs from faculties data
    useEffect(() => {
        try {
            const allPrograms = [];
            facultiesData.faculties.forEach(faculty => {
                // Determine category based on faculty name
                let category = [];
                if (faculty.faculty.toLowerCase().includes('business') ||
                    faculty.faculty.toLowerCase().includes('entrepreneurship')) {
                    category = ['commerce', 'business'];
                } else if (faculty.faculty.toLowerCase().includes('science') ||
                    faculty.faculty.toLowerCase().includes('information technology')) {
                    category = ['science'];
                } else if (faculty.faculty.toLowerCase().includes('engineering')) {
                    category = ['science', 'engineering'];
                } else if (faculty.faculty.toLowerCase().includes('health') ||
                    faculty.faculty.toLowerCase().includes('life sciences')) {
                    category = ['science', 'health'];
                } else if (faculty.faculty.toLowerCase().includes('humanities') ||
                    faculty.faculty.toLowerCase().includes('social sciences')) {
                    category = ['arts', 'humanities', 'social sciences'];
                }

                faculty.departments.forEach(department => {
                    department.programs.forEach(program => {
                        allPrograms.push({
                            ...program,
                            facultyId: faculty.id,
                            faculty: faculty.faculty,
                            departmentId: department.id,
                            department: department.department,
                            category: category,
                            // Add subject requirements based on program name
                            requires: determineSubjectRequirements(program.name, faculty.faculty, department.department)
                        });
                    });
                });
            });
            setPrograms(allPrograms);
            setLoading(false);
        } catch (error) {
            console.error("Error loading programs:", error);
            setLoading(false);
        }
    }, []);

    // Helper function to determine subject requirements
    const determineSubjectRequirements = (programName, faculty, department) => {
        const requirements = [];

        // All programs require English
        requirements.push('english');

        // Science programs require specific subjects
        if (faculty.toLowerCase().includes('science') ||
            faculty.toLowerCase().includes('engineering') ||
            faculty.toLowerCase().includes('health')) {

            if (programName.toLowerCase().includes('computer science') ||
                programName.toLowerCase().includes('software') ||
                programName.toLowerCase().includes('cse')) {
                requirements.push('math', 'physics');
            }

            if (programName.toLowerCase().includes('electrical') ||
                programName.toLowerCase().includes('electronics') ||
                programName.toLowerCase().includes('eee')) {
                requirements.push('math', 'physics');
            }

            if (programName.toLowerCase().includes('civil')) {
                requirements.push('math', 'physics');
            }

            if (programName.toLowerCase().includes('textile')) {
                requirements.push('chemistry');
            }

            if (programName.toLowerCase().includes('pharmacy') ||
                programName.toLowerCase().includes('nutrition') ||
                programName.toLowerCase().includes('biotechnology')) {
                requirements.push('biology', 'chemistry');
            }

            if (programName.toLowerCase().includes('environmental')) {
                requirements.push('biology', 'chemistry');
            }

            if (programName.toLowerCase().includes('robotics') ||
                programName.toLowerCase().includes('mechatronics')) {
                requirements.push('math', 'physics');
            }

            if (programName.toLowerCase().includes('architecture')) {
                requirements.push('math');
            }
        }

        // Business programs
        if (faculty.toLowerCase().includes('business') ||
            faculty.toLowerCase().includes('entrepreneurship')) {
            // Business programs typically don't have specific subject requirements
            // beyond English and minimum GPA
        }

        // Arts/Humanities programs
        if (faculty.toLowerCase().includes('humanities') ||
            faculty.toLowerCase().includes('social sciences')) {
            if (programName.toLowerCase().includes('law')) {
                // Law might have specific requirements
            }
        }

        return requirements;
    };

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
        if (!group) return false;
        if (group === 'science' && !scienceChoice) return false;
        if (!engResult) return false;

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
            setValue('mathResult', undefined);
            setValue('phyResult', undefined);
            setValue('chemResult', undefined);
            setValue('bioResult', undefined);
        }
    }, [group, setValue]);

    // Function to filter programs based on eligibility
    const filterEligiblePrograms = (data) => {
        const ssc = parseFloat(data.sscResult);
        const hsc = parseFloat(data.hscResult);
        const eng = parseFloat(data.engResult);
        const math = data.mathResult && !isNaN(parseFloat(data.mathResult)) ? parseFloat(data.mathResult) : 0;
        const phy = data.phyResult && !isNaN(parseFloat(data.phyResult)) ? parseFloat(data.phyResult) : 0;
        const chem = data.chemResult && !isNaN(parseFloat(data.chemResult)) ? parseFloat(data.chemResult) : 0;
        const bio = data.bioResult && !isNaN(parseFloat(data.bioResult)) ? parseFloat(data.bioResult) : 0;

        // Check minimum overall GPA requirement
        if (ssc < 2.5 || hsc < 2.5) {
            return [];
        }

        const groupCategories = getGroupCategory(data.group);

        // Filter programs based on group and subject requirements
        const eligiblePrograms = programs.filter(program => {
            // Check if program belongs to user's group category
            const hasMatchingCategory = program.category.some(cat =>
                groupCategories.includes(cat)
            );

            if (!hasMatchingCategory) {
                return false;
            }

            // Check English requirement (all programs require English >= 2.5)
            if (eng < 2.5) {
                return false;
            }

            // For science programs, check subject-specific requirements
            if (data.group === 'science' && program.requires.length > 0) {
                // Check if user has taken required subjects
                const hasRequiredSubjects = program.requires.every(subject => {
                    switch (subject) {
                        case 'english': return eng >= 2.5;
                        case 'math': return math >= 2.5;
                        case 'physics': return phy >= 2.5;
                        case 'chemistry': return chem >= 2.5;
                        case 'biology': return bio >= 2.5;
                        default: return true;
                    }
                });

                if (!hasRequiredSubjects) {
                    return false;
                }

                // Special cases for Pharmacy, Public Health, Nutrition
                if (program.name.includes("Pharmacy") ||
                    program.name.includes("Public Health") ||
                    program.name.includes("Nutrition")) {
                    if (data.scienceChoice === 'Both') {
                        // Higher requirements for both biology and chemistry
                        return bio >= 3.5 && chem >= 3.5;
                    } else {
                        return false; // These programs typically require both
                    }
                }

                // Special case for Genetic Engineering
                if (program.name.includes("Genetic Engineering")) {
                    return bio >= 3.0 && chem >= 3.0;
                }
            }

            return true;
        });

        return eligiblePrograms;
    };

    const onSubmit = async (data) => {
        try {
            setCalculating(true);
            setResult(null);

            // Simulate a small delay to show loading state
            await new Promise(resolve => setTimeout(resolve, 1500));

            const eligiblePrograms = filterEligiblePrograms(data);

            let message = "";
            if (eligiblePrograms.length === 0) {
                message = "❌ Based on your results, you don't meet the eligibility criteria for any programs.";
            } else {
                // Group programs by faculty for better display
                const groupedByFaculty = {};
                eligiblePrograms.forEach(program => {
                    if (!groupedByFaculty[program.faculty]) {
                        groupedByFaculty[program.faculty] = [];
                    }
                    groupedByFaculty[program.faculty].push(program);
                });

                message = "✅ You are eligible for the following programs:\n\n";
                Object.keys(groupedByFaculty).forEach(faculty => {
                    message += `${faculty}:\n`;
                    groupedByFaculty[faculty].forEach(program => {
                        message += `  • ${program.name} (${program.duration})\n`;
                    });
                    message += '\n';
                });
            }

            setResult({
                eligibility: message
            });

            // Scroll to results after a brief delay
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

        } catch (error) {
            console.error("Error calculating eligibility:", error);
            setResult({
                eligibility: "❌ An error occurred while calculating eligibility. Please try again."
            });
        } finally {
            setCalculating(false);
        }
    };

    // Handle reset - only clears when user clicks the button
    const handleReset = () => {
        reset({
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
            bioResult: ''
        });
        setResult(null);
    };

    const getInputClassName = (error) => `
        w-full px-4 py-2 border rounded-lg
        focus:outline-none focus:ring-1
        ${error
            ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
        }
    `;

    const steps = [
        { number: 1, title: 'Basic Results', description: 'SSC & HSC GPA' },
        { number: 2, title: 'Group & Subjects', description: 'Academic background' }
    ];

    if (loading) {
        return (
            <div className="container mx-auto min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading programs...</p>
                </div>
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <div className="container mx-auto min-h-screen px-4 py-10 md:py-14 lg:py-20">
                {/* Helmet */}
                <title>Eligibility Calculator | DIU Admission Bot</title>

                <div className="flex flex-col items-center gap-2 md:gap-4 mb-10">
                    <div className='flex justify-center md:items-center lg:items-start gap-x-5'>
                        <div className="hidden md:block p-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl">
                            <Compass className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-4xl font-semibold">
                            Find Your Perfect Department
                        </h3>
                    </div>
                    <p className="md:text-lg max-w-3xl mx-auto">
                        Discover which university programs match your academic results
                    </p>
                </div>

                {/* Main container with grid layout for side-by-side */}
                <div className="max-w-7xl mx-auto">
                    {showGuidelines && (
                        <div className="max-w-4xl mx-auto bg-linear-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-xl p-6 mb-14 relative">
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
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm no-animation-grid">
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
                                            Get instant eligibility results
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid layout - form on left, results on right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-animation-grid">
                        {/* Left Column - Form */}
                        <div className="space-y-8">
                            {/* Steps indicator */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="flex-1 relative">
                                            {index < steps.length - 1 && (
                                                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200">
                                                    <div
                                                        className="h-full bg-indigo-600 transition-all duration-300"
                                                        style={{ width: currentStep > step.number ? '100%' : '0%' }}
                                                    />
                                                </div>
                                            )}
                                            <div className="relative flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
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

                            {/* Form Card */}
                            <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
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
                                        {/* Step 1: Basic Academic Results */}
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
                                                        type="text"
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
                                                        <div className="mt-2 p-3 bg-gray-100 rounded-lg">
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
                                                        type="text"
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
                                                        <div className="mt-2 p-3 bg-gray-100 rounded-lg">
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

                                        {/* Step 2: Group & Subject Results */}
                                        <div className="space-y-3">
                                            <h3 className={`text-lg font-medium flex items-center`}>
                                                <span className={`rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 bg-indigo-100 text-indigo-600`}>
                                                    2
                                                </span>
                                                Group & Subject Results
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 no-animation-grid">
                                                {/* Group Selection using CustomSelect with predefined options */}
                                                <Controller
                                                    name="group"
                                                    control={control}
                                                    render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                                                        <CustomSelect
                                                            label="Your Group"
                                                            value={value || ''}
                                                            options={groupOptions}
                                                            onChange={onChange}
                                                            onBlur={onBlur}
                                                            placeholder="Select your group"
                                                            required={true}
                                                            error={!!error}
                                                        />
                                                    )}
                                                />

                                                {/* Science Stream Selection - only shown when group is science */}
                                                {group === 'science' && (
                                                    <Controller
                                                        name="scienceChoice"
                                                        control={control}
                                                        render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
                                                            <CustomSelect
                                                                label="Science Stream"
                                                                value={value || ''}
                                                                options={scienceStreamOptions}
                                                                onChange={onChange}
                                                                onBlur={onBlur}
                                                                placeholder="Select your stream"
                                                                required={true}
                                                                error={!!error}
                                                            />
                                                        )}
                                                    />
                                                )}

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium">
                                                        English Result <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
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
                                                                type="text"
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
                                                                type="text"
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
                                                                type="text"
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
                                                            type="text"
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
                                    </div>

                                    <div className="mt-12">
                                        <button
                                            type="submit"
                                            disabled={!isValid || isSubmitting || calculating}
                                            className="w-full bg-blue-800 text-white p-2.5 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all duration-300 transform cursor-pointer"
                                        >
                                            {isSubmitting || calculating ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                'Check My Eligibility'
                                            )}
                                        </button>

                                        {/* Optional: Show message when form is incomplete */}
                                        {!isValid && !isSubmitting && !calculating && (
                                            <p className="text-sm text-amber-600 mt-2 text-center">
                                                Please fill in all required fields to check eligibility
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column - Results */}
                        <div className="lg:sticky lg:top-20 lg:self-start" id="results-section">
                            {calculating ? (
                                // Loading State on Right Side
                                <div className="bg-linear-to-tr from-slate-50 via-white to-indigo-50 order border-gray-200 rounded-2xl shadow-lg p-6 h-full flex items-center justify-center lg:mt-12">
                                    <div className="text-center py-12">
                                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Calculating Eligibility</h3>
                                        <p className="text-gray-600">Please wait while we process your information...</p>
                                    </div>
                                </div>
                            ) : result ? (
                                <div>
                                    {/* Eligibility Result Card */}
                                    <div className="bg-white order border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                                        <div className={`px-6 py-2 ${result.eligibility.includes('❌') ? 'bg-linear-to-r from-red-500 to-pink-600' : 'bg-linear-to-r from-green-500 to-emerald-600'}`}>
                                            <h2 className="text-xl text-white flex items-center">
                                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Eligibility Result
                                            </h2>
                                        </div>
                                        <div className="p-6">
                                            {result.eligibility.includes('❌') ? (
                                                <div className="flex items-start space-x-3">
                                                    <div className="bg-red-100 rounded-full p-2 shrink-0">
                                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-gray-700 whitespace-pre-line">{result.eligibility}</p>
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
                                                        {result.eligibility.replace('✅ You are eligible for the following programs:\n\n', '')}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Manual Reset Button - Only appears when results are shown */}
                                            <div className="text-center">
                                                <button
                                                    onClick={handleReset}
                                                    className="w-full mt-6 bg-blue-200 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                                >
                                                    Start New Calculation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Placeholder when no results yet
                                <div className="bg-linear-to-tr from-slate-50 via-white to-indigo-50 rounded-2xl shadow-lg p-6 border border-gray-200 h-full flex items-center justify-center">
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <GraduationCap className="w-10 h-10 text-blue-600" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Ready to Calculate?</h3>
                                        <p className="text-gray-600">
                                            Fill in your information on the left to see your eligibility.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default EligibilityCalculator;






// import { useEffect, useState } from 'react';
// import { useForm, FormProvider, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { GraduationCap, BookOpen, Award, Compass } from 'lucide-react';
// import programsData from "../../data/programs.json";
// import CustomSelect from '../../shared/CustomSelect/CustomSelect';

// // Define options at the top
// const groupOptions = [
//     { id: 'science', name: 'Science', icon: <GraduationCap className="w-4 h-4" /> },
//     { id: 'commerce', name: 'Commerce', icon: <BookOpen className="w-4 h-4" /> },
//     { id: 'arts', name: 'Arts/Humanities', icon: <Award className="w-4 h-4" /> }
// ];

// const scienceStreamOptions = [
//     { id: 'Math', name: 'Mathematics', icon: <BookOpen className="w-4 h-4" /> },
//     { id: 'Biology', name: 'Biology', icon: <GraduationCap className="w-4 h-4" /> },
//     { id: 'Both', name: 'Both Mathematics & Biology', icon: <Award className="w-4 h-4" /> }
// ];

// // Validation Schema with proper validation
// const validationSchema = yup.object({
//     sscResult: yup
//         .number()
//         .typeError('SSC result must be a number')
//         .min(0, 'GPA cannot be less than 0')
//         .max(5, 'GPA cannot exceed 5')
//         .required('SSC result is required')
//         .test('two-decimals', 'GPA must have up to 2 decimal places',
//             value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),

//     hscResult: yup
//         .number()
//         .typeError('HSC result must be a number')
//         .min(0, 'GPA cannot be less than 0')
//         .max(5, 'GPA cannot exceed 5')
//         .required('HSC result is required')
//         .test('two-decimals', 'GPA must have up to 2 decimal places',
//             value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),

//     group: yup
//         .string()
//         .oneOf(groupOptions.map(opt => opt.id), 'Please select a valid group')
//         .required('Please select your group'),

//     scienceChoice: yup.string().when('group', {
//         is: 'science',
//         then: (schema) => schema
//             .oneOf(scienceStreamOptions.map(opt => opt.id), 'Please select a valid stream')
//             .required('Please select your science stream'),
//         otherwise: (schema) => schema.notRequired()
//     }),

//     engResult: yup
//         .number()
//         .typeError('English result must be a number')
//         .min(0, 'GPA cannot be less than 0')
//         .max(5, 'GPA cannot exceed 5')
//         .required('English result is required')
//         .test('two-decimals', 'GPA must have up to 2 decimal places',
//             value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),

//     mathResult: yup.number().when(['group', 'scienceChoice'], {
//         is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both'),
//         then: (schema) => schema
//             .typeError('Mathematics result must be a number')
//             .min(0, 'GPA cannot be less than 0')
//             .max(5, 'GPA cannot exceed 5')
//             .required('Mathematics result is required')
//             .test('two-decimals', 'GPA must have up to 2 decimal places',
//                 value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
//         otherwise: (schema) => schema.transform(() => undefined).notRequired()
//     }),

//     phyResult: yup.number().when(['group', 'scienceChoice'], {
//         is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both'),
//         then: (schema) => schema
//             .typeError('Physics result must be a number')
//             .min(0, 'GPA cannot be less than 0')
//             .max(5, 'GPA cannot exceed 5')
//             .required('Physics result is required')
//             .test('two-decimals', 'GPA must have up to 2 decimal places',
//                 value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
//         otherwise: (schema) => schema.transform(() => undefined).notRequired()
//     }),

//     chemResult: yup.number().when(['group', 'scienceChoice'], {
//         is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both'),
//         then: (schema) => schema
//             .typeError('Chemistry result must be a number')
//             .min(0, 'GPA cannot be less than 0')
//             .max(5, 'GPA cannot exceed 5')
//             .required('Chemistry result is required')
//             .test('two-decimals', 'GPA must have up to 2 decimal places',
//                 value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
//         otherwise: (schema) => schema.transform(() => undefined).notRequired()
//     }),

//     bioResult: yup.number().when(['group', 'scienceChoice'], {
//         is: (group, scienceChoice) => group === 'science' && (scienceChoice === 'Biology' || scienceChoice === 'Both'),
//         then: (schema) => schema
//             .typeError('Biology result must be a number')
//             .min(0, 'GPA cannot be less than 0')
//             .max(5, 'GPA cannot exceed 5')
//             .required('Biology result is required')
//             .test('two-decimals', 'GPA must have up to 2 decimal places',
//                 value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())),
//         otherwise: (schema) => schema.transform(() => undefined).notRequired()
//     }),

//     // Golden GPA flags
//     sscGolden: yup.string().when('sscResult', {
//         is: (value) => parseFloat(value) === 5.0,
//         then: (schema) => schema.required('Please select Yes or No'),
//         otherwise: (schema) => schema.notRequired()
//     }),

//     hscGolden: yup.string().when('hscResult', {
//         is: (value) => parseFloat(value) === 5.0,
//         then: (schema) => schema.required('Please select Yes or No'),
//         otherwise: (schema) => schema.notRequired()
//     })
// });

// const EligibilityCalculator = () => {
//     const [result, setResult] = useState(null);
//     const [showGuidelines, setShowGuidelines] = useState(true);
//     const [currentStep, setCurrentStep] = useState(1);
//     const [programs, setPrograms] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const methods = useForm({
//         resolver: yupResolver(validationSchema),
//         mode: 'onChange', // Add this to enable real-time validation
//         defaultValues: {
//             group: '',
//             scienceChoice: '',
//             sscResult: '',
//             hscResult: '',
//             sscGolden: 'no',
//             hscGolden: 'no',
//             engResult: '',
//             mathResult: '',
//             phyResult: '',
//             chemResult: '',
//             bioResult: ''
//         }
//     });

//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         reset,
//         control,
//         formState: { errors, isSubmitting, isValid } // Add isValid here
//     } = methods;

//     const group = watch('group');
//     const scienceChoice = watch('scienceChoice');
//     const sscResult = watch('sscResult');
//     const hscResult = watch('hscResult');

//     // Watch all required fields
//     const engResult = watch('engResult');
//     const mathResult = watch('mathResult');
//     const phyResult = watch('phyResult');
//     const chemResult = watch('chemResult');
//     const bioResult = watch('bioResult');

//     // Load programs from imported JSON
//     useEffect(() => {
//         try {
//             setPrograms(programsData.programs);
//             setLoading(false);
//         } catch (error) {
//             console.error("Error loading programs:", error);
//             setLoading(false);
//         }
//     }, []);

//     // Check if GPA is 5.00 to show Golden option
//     const showGoldenOption = (gpa) => {
//         return parseFloat(gpa) === 5.0;
//     };

//     // Function to check if step 1 (Basic Results) is complete
//     const isStep1Complete = () => {
//         return sscResult && hscResult;
//     };

//     // Function to check if step 2 (Group & Subjects) is complete
//     const isStep2Complete = () => {
//         // Check if group is selected
//         if (!group) return false;

//         // Check if science stream is selected when group is science
//         if (group === 'science' && !scienceChoice) return false;

//         // Check if English result is provided
//         if (!engResult) return false;

//         // Check science subject results based on selection
//         if (group === 'science') {
//             if (scienceChoice === 'Math' || scienceChoice === 'Both') {
//                 if (!mathResult || !phyResult || !chemResult) return false;
//             }
//             if (scienceChoice === 'Biology' || scienceChoice === 'Both') {
//                 if (!bioResult) return false;
//             }
//         }

//         return true;
//     };

//     // Update current step based on which sections are complete
//     useEffect(() => {
//         if (isStep2Complete()) {
//             setCurrentStep(3);
//         } else if (isStep1Complete()) {
//             setCurrentStep(2);
//         } else {
//             setCurrentStep(1);
//         }
//     }, [sscResult, hscResult, group, scienceChoice, engResult, mathResult, phyResult, chemResult, bioResult]);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     useEffect(() => {
//         if (group !== 'science') {
//             setValue('scienceChoice', '');
//             setValue('mathResult', undefined);
//             setValue('phyResult', undefined);
//             setValue('chemResult', undefined);
//             setValue('bioResult', undefined);
//         }
//     }, [group, setValue]);

//     // Function to filter programs based on eligibility
//     const filterEligiblePrograms = (data) => {
//         const ssc = parseFloat(data.sscResult);
//         const hsc = parseFloat(data.hscResult);
//         const eng = parseFloat(data.engResult);
//         const math = data.mathResult && !isNaN(parseFloat(data.mathResult)) ? parseFloat(data.mathResult) : 0;
//         const phy = data.phyResult && !isNaN(parseFloat(data.phyResult)) ? parseFloat(data.phyResult) : 0;
//         const chem = data.chemResult && !isNaN(parseFloat(data.chemResult)) ? parseFloat(data.chemResult) : 0;
//         const bio = data.bioResult && !isNaN(parseFloat(data.bioResult)) ? parseFloat(data.bioResult) : 0;

//         // Check minimum overall GPA requirement
//         if (ssc <= 2.5 || hsc <= 2.5) {
//             return [];
//         }

//         // Filter programs based on group and subject requirements
//         const eligiblePrograms = programs.filter(program => {
//             // Check if program belongs to user's group
//             if (!program.category.includes(group)) {
//                 return false;
//             }

//             // Check English requirement (all programs require English > 2.5)
//             if (eng <= 2.5) {
//                 return false;
//             }

//             // For science programs, check subject-specific requirements
//             if (group === 'science' && program.requires) {
//                 // Check if user has taken required subjects
//                 const hasRequiredSubjects = program.requires.every(subject => {
//                     switch (subject) {
//                         case 'math': return math > 2.5;
//                         case 'physics': return phy > 2.5;
//                         case 'chemistry': return chem > 2.5;
//                         case 'biology': return bio > 2.5;
//                         default: return true;
//                     }
//                 });

//                 if (!hasRequiredSubjects) {
//                     return false;
//                 }

//                 // Check for Pharmacy special case (Both subjects with higher requirements)
//                 if (program.name === "Bachelor of Public Health" ||
//                     program.name === "Bachelor of Nutrition and Food Engineering") {
//                     if (scienceChoice === 'Both') {
//                         return bio > 3.5 && chem > 3.5;
//                     }
//                 }
//             }

//             return true;
//         });

//         return eligiblePrograms;
//     };

//     const onSubmit = async (data) => {
//         try {
//             const eligiblePrograms = filterEligiblePrograms(data);

//             let message = "";
//             if (eligiblePrograms.length === 0) {
//                 message = "❌ Based on your results, you don't meet the eligibility criteria for any programs.";
//             } else {
//                 message = "✅ You are eligible for the following programs:\n\n" +
//                     eligiblePrograms.map(p => `• ${p.name}`).join('\n');
//             }

//             setResult({
//                 eligibility: message
//             });

//             // Scroll to results after a brief delay
//             setTimeout(() => {
//                 document.getElementById('results-section')?.scrollIntoView({
//                     behavior: 'smooth',
//                     block: 'start'
//                 });
//             }, 100);

//         } catch (error) {
//             console.error("Error calculating eligibility:", error);
//             setResult({
//                 eligibility: "❌ An error occurred while calculating eligibility. Please try again."
//             });
//         }
//     };

//     // Handle reset - only clears when user clicks the button
//     const handleReset = () => {
//         reset({
//             group: '',
//             scienceChoice: '',
//             sscResult: '',
//             hscResult: '',
//             sscGolden: 'no',
//             hscGolden: 'no',
//             engResult: '',
//             mathResult: '',
//             phyResult: '',
//             chemResult: '',
//             bioResult: ''
//         });
//         setResult(null);
//     };

//     const getInputClassName = (error) => `
//         w-full px-4 py-2 border rounded-lg
//         focus:outline-none focus:ring-1
//         ${error
//             ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
//             : 'border-gray-300 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white'
//         }
//     `;

//     const steps = [
//         { number: 1, title: 'Basic Results', description: 'SSC & HSC GPA' },
//         { number: 2, title: 'Group & Subjects', description: 'Academic background' }
//     ];

//     if (loading) {
//         return (
//             <div className="container mx-auto min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading programs...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <FormProvider {...methods}>
//             <div className="container mx-auto min-h-screen px-4 py-10 md:py-14 lg:py-20">
//                 {/* Helmet */}
//                 <title>Eligibility Calculator | DIU Admission Bot</title>

//                 <div className="text-center mb-10">
//                     <div className='flex justify-center md:items-center lg:items-start gap-x-5'>
//                         <div className="hidden md:block p-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl">
//                             <Compass className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
//                         </div>
//                         <h3 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
//                             Find Your Perfect Department
//                         </h3>
//                     </div>
//                     <p className="md:text-lg lg:text-xl max-w-4xl mx-auto">
//                         Discover which university programs match your academic results
//                     </p>
//                 </div>

//                 {/* Main container with grid layout for side-by-side */}
//                 <div className="max-w-7xl mx-auto">
//                     {showGuidelines && (
//                         <div className="max-w-4xl mx-auto bg-linear-to-r from-indigo-600 to-purple-700 text-white rounded-2xl shadow-xl p-6 mb-14 relative">
//                             <button
//                                 onClick={() => setShowGuidelines(false)}
//                                 className="absolute top-4 right-4 hover:text-red-600 hover:bg-red-50 p-1 rounded-full"
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                             <div className="flex items-start space-x-4">
//                                 <div className="bg-indigo-100 rounded-full p-2">
//                                     <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                     </svg>
//                                 </div>
//                                 <div className="flex-1">
//                                     <h3 className="text-lg font-semibold mb-2">Quick Guidelines</h3>
//                                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm no-animation-grid">
//                                         <li className="flex items-center">
//                                             <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                             </svg>
//                                             Enter your SSC and HSC GPA (0-5 scale)
//                                         </li>
//                                         <li className="flex items-center">
//                                             <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                             </svg>
//                                             Select your group and subjects
//                                         </li>
//                                         <li className="flex items-center">
//                                             <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                             </svg>
//                                             Get instant eligibility results
//                                         </li>
//                                     </ul>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Grid layout - form on left, results on right */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-animation-grid">
//                         {/* Left Column - Form */}
//                         <div className="space-y-8">
//                             {/* Steps indicator */}
//                             <div className="mb-8">
//                                 <div className="flex items-center justify-between">
//                                     {steps.map((step, index) => (
//                                         <div key={step.number} className="flex-1 relative">
//                                             {index < steps.length - 1 && (
//                                                 <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200">
//                                                     <div
//                                                         className="h-full bg-indigo-600 transition-all duration-300"
//                                                         style={{ width: currentStep > step.number ? '100%' : '0%' }}
//                                                     />
//                                                 </div>
//                                             )}
//                                             <div className="relative flex flex-col items-center">
//                                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
//                                                         ${currentStep >= step.number
//                                                         ? 'bg-indigo-600 text-white'
//                                                         : 'bg-gray-200 text-gray-500'}`}
//                                                 >
//                                                     {currentStep > step.number ? (
//                                                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                                         </svg>
//                                                     ) : step.number}
//                                                 </div>
//                                                 <div className="text-center mt-2">
//                                                     <div className="text-sm font-medium">{step.title}</div>
//                                                     <div className="text-xs text-gray-500">{step.description}</div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Form Card */}
//                             <div className="rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
//                                 <div className="bg-linear-to-r from-blue-100 to-white p-2 border-b border-gray-200">
//                                     <h3 className="text-lg md:text-xl lg:text-2xl font-semibold flex items-center justify-center">
//                                         <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                                         </svg>
//                                         Student Information Form
//                                     </h3>
//                                 </div>

//                                 {/* Form */}
//                                 <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 bg-linear-to-br from-slate-50 via-white to-indigo-50">
//                                     <div className="space-y-6">
//                                         {/* Step 1: Basic Academic Results */}
//                                         <div className="space-y-3">
//                                             <h3 className="text-lg font-medium flex items-center">
//                                                 <span className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
//                                                 Basic Academic Results
//                                             </h3>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 no-animation-grid">
//                                                 <div className="space-y-2">
//                                                     <label className="block text-sm font-medium">
//                                                         SSC Result (GPA) <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         {...register('sscResult')}
//                                                         className={getInputClassName(errors.sscResult)}
//                                                         placeholder="GPA out of 5.00"
//                                                     />
//                                                     {errors.sscResult && (
//                                                         <p className="text-sm text-red-600 flex items-center">
//                                                             <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                             </svg>
//                                                             {errors.sscResult.message}
//                                                         </p>
//                                                     )}
//                                                     {/* Golden GPA Option - SSC */}
//                                                     {showGoldenOption(sscResult) && (
//                                                         <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                                                             <div className="flex items-center gap-2">
//                                                                 <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                                                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                                                 </svg>
//                                                                 <span className="text-xs md:text-sm font-medium text-yellow-700">Golden GPA?</span>
//                                                                 <div className="flex items-center gap-3 ml-auto">
//                                                                     <label className="flex items-center gap-2 cursor-pointer">
//                                                                         <input
//                                                                             type="radio"
//                                                                             value="yes"
//                                                                             {...register('sscGolden')}
//                                                                             className="w-4 h-4 text-yellow-600"
//                                                                         />
//                                                                         <span className="text-xs md:text-sm">Yes</span>
//                                                                     </label>
//                                                                     <label className="flex items-center gap-2 cursor-pointer">
//                                                                         <input
//                                                                             type="radio"
//                                                                             value="no"
//                                                                             {...register('sscGolden')}
//                                                                             className="w-4 h-4 text-yellow-600"
//                                                                         />
//                                                                         <span className="text-xs md:text-sm">No</span>
//                                                                     </label>
//                                                                 </div>
//                                                             </div>
//                                                             {errors.sscGolden && (
//                                                                 <p className="text-sm text-red-600 mt-1">{errors.sscGolden.message}</p>
//                                                             )}
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 <div className="space-y-2">
//                                                     <label className="block text-sm font-medium">
//                                                         HSC Result (GPA) <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         {...register('hscResult')}
//                                                         className={getInputClassName(errors.hscResult)}
//                                                         placeholder="GPA out of 5.00"
//                                                     />
//                                                     {errors.hscResult && (
//                                                         <p className="text-sm text-red-600 flex items-center">
//                                                             <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                             </svg>
//                                                             {errors.hscResult.message}
//                                                         </p>
//                                                     )}
//                                                     {/* Golden GPA Option - HSC */}
//                                                     {showGoldenOption(hscResult) && (
//                                                         <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                                                             <div className="flex items-center gap-2">
//                                                                 <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                                                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                                                 </svg>
//                                                                 <span className="text-sm font-medium text-yellow-700">Golden GPA?</span>
//                                                                 <div className="flex items-center gap-3 ml-auto">
//                                                                     <label className="flex items-center gap-2 cursor-pointer">
//                                                                         <input
//                                                                             type="radio"
//                                                                             value="yes"
//                                                                             {...register('hscGolden')}
//                                                                             className="w-4 h-4 text-yellow-600"
//                                                                         />
//                                                                         <span className="text-sm">Yes</span>
//                                                                     </label>
//                                                                     <label className="flex items-center gap-2 cursor-pointer">
//                                                                         <input
//                                                                             type="radio"
//                                                                             value="no"
//                                                                             {...register('hscGolden')}
//                                                                             className="w-4 h-4 text-yellow-600"
//                                                                         />
//                                                                         <span className="text-sm">No</span>
//                                                                     </label>
//                                                                 </div>
//                                                             </div>
//                                                             {errors.hscGolden && (
//                                                                 <p className="text-sm text-red-600 mt-1">{errors.hscGolden.message}</p>
//                                                             )}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Step 2: Group & Subject Results */}
//                                         <div className="space-y-3">
//                                             <h3 className={`text-lg font-medium flex items-center`}>
//                                                 <span className={`rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2 bg-indigo-100 text-indigo-600`}>
//                                                     2
//                                                 </span>
//                                                 Group & Subject Results
//                                             </h3>
//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 no-animation-grid">
//                                                 {/* Group Selection using CustomSelect with predefined options */}
//                                                 <Controller
//                                                     name="group"
//                                                     control={control}
//                                                     render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
//                                                         <CustomSelect
//                                                             label="Your Group"
//                                                             value={value || ''}
//                                                             options={groupOptions}
//                                                             onChange={onChange}
//                                                             onBlur={onBlur}
//                                                             placeholder="Select your group"
//                                                             required={true}
//                                                             error={!!error}
//                                                         />
//                                                     )}
//                                                 />

//                                                 {/* Science Stream Selection - only shown when group is science */}
//                                                 {group === 'science' && (
//                                                     <Controller
//                                                         name="scienceChoice"
//                                                         control={control}
//                                                         render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
//                                                             <CustomSelect
//                                                                 label="Science Stream"
//                                                                 value={value || ''}
//                                                                 options={scienceStreamOptions}
//                                                                 onChange={onChange}
//                                                                 onBlur={onBlur}
//                                                                 placeholder="Select your stream"
//                                                                 required={true}
//                                                                 error={!!error}
//                                                             />
//                                                         )}
//                                                     />
//                                                 )}

//                                                 <div className="space-y-2">
//                                                     <label className="block text-sm font-medium">
//                                                         English Result <span className="text-red-500">*</span>
//                                                     </label>
//                                                     <input
//                                                         type="text"
//                                                         {...register('engResult')}
//                                                         className={getInputClassName(errors.engResult)}
//                                                         placeholder="Enter English GPA"
//                                                     />
//                                                     {errors.engResult && (
//                                                         <p className="text-sm text-red-600 flex items-center">
//                                                             <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                             </svg>
//                                                             {errors.engResult.message}
//                                                         </p>
//                                                     )}
//                                                 </div>

//                                                 {group === 'science' && (scienceChoice === 'Math' || scienceChoice === 'Both') && (
//                                                     <>
//                                                         <div className="space-y-2">
//                                                             <label className="block text-sm font-medium">
//                                                                 Mathematics Result
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 {...register('mathResult')}
//                                                                 className={getInputClassName(errors.mathResult)}
//                                                                 placeholder="Enter Math GPA"
//                                                             />
//                                                             {errors.mathResult && (
//                                                                 <p className="text-sm text-red-600 flex items-center">
//                                                                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                                     </svg>
//                                                                     {errors.mathResult.message}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                         <div className="space-y-2">
//                                                             <label className="block text-sm font-medium">
//                                                                 Physics Result
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 {...register('phyResult')}
//                                                                 className={getInputClassName(errors.phyResult)}
//                                                                 placeholder="Enter Physics GPA"
//                                                             />
//                                                             {errors.phyResult && (
//                                                                 <p className="text-sm text-red-600 flex items-center">
//                                                                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                                     </svg>
//                                                                     {errors.phyResult.message}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                         <div className="space-y-2">
//                                                             <label className="block text-sm font-medium">
//                                                                 Chemistry Result
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 {...register('chemResult')}
//                                                                 className={getInputClassName(errors.chemResult)}
//                                                                 placeholder="Enter Chemistry GPA"
//                                                             />
//                                                             {errors.chemResult && (
//                                                                 <p className="text-sm text-red-600 flex items-center">
//                                                                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                                     </svg>
//                                                                     {errors.chemResult.message}
//                                                                 </p>
//                                                             )}
//                                                         </div>
//                                                     </>
//                                                 )}

//                                                 {group === 'science' && (scienceChoice === 'Biology' || scienceChoice === 'Both') && (
//                                                     <div className="space-y-2">
//                                                         <label className="block text-sm font-medium">
//                                                             Biology Result
//                                                         </label>
//                                                         <input
//                                                             type="text"
//                                                             {...register('bioResult')}
//                                                             className={getInputClassName(errors.bioResult)}
//                                                             placeholder="Enter Biology GPA"
//                                                         />
//                                                         {errors.bioResult && (
//                                                             <p className="text-sm text-red-600 flex items-center">
//                                                                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                                                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                                                 </svg>
//                                                                 {errors.bioResult.message}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="mt-12">
//                                         <button
//                                             type="submit"
//                                             disabled={!isValid || isSubmitting} // Button is disabled until form is valid
//                                             className="w-full bg-blue-800 text-white p-2.5 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed shadow-lg transition-all duration-300 transform cursor-pointer"
//                                         >
//                                             {isSubmitting ? (
//                                                 <span className="flex items-center justify-center">
//                                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                     </svg>
//                                                     Processing...
//                                                 </span>
//                                             ) : (
//                                                 'Check My Eligibility'
//                                             )}
//                                         </button>

//                                         {/* Optional: Show message when form is incomplete */}
//                                         {!isValid && !isSubmitting && (
//                                             <p className="text-sm text-amber-600 mt-2 text-center">
//                                                 Please fill in all required fields to check eligibility
//                                             </p>
//                                         )}
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>

//                         {/* Right Column - Results */}
//                         <div className="lg:sticky lg:top-20 lg:self-start" id="results-section">
//                             {result ? (
//                                 <div>
//                                     {/* Eligibility Result Card */}
//                                     <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//                                         <div className={`px-6 py-2 ${result.eligibility.includes('❌') ? 'bg-linear-to-r from-red-500 to-pink-600' : 'bg-linear-to-r from-green-500 to-emerald-600'}`}>
//                                             <h2 className="text-xl text-white flex items-center">
//                                                 <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 Eligibility Result
//                                             </h2>
//                                         </div>
//                                         <div className="p-6">
//                                             {result.eligibility.includes('❌') ? (
//                                                 <div className="flex items-start space-x-3">
//                                                     <div className="bg-red-100 rounded-full p-2 shrink-0">
//                                                         <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                         </svg>
//                                                     </div>
//                                                     <p className="text-gray-700 whitespace-pre-line">{result.eligibility}</p>
//                                                 </div>
//                                             ) : (
//                                                 <div>
//                                                     <p className="text-green-600 font-medium mb-4 flex items-center">
//                                                         <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                                         </svg>
//                                                         You are eligible for the following programs:
//                                                     </p>
//                                                     <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
//                                                         {result.eligibility.replace('✅ You are eligible for the following programs:\n\n', '')}
//                                                     </pre>
//                                                 </div>
//                                             )}

//                                             {/* Manual Reset Button - Only appears when results are shown */}
//                                             <div className="text-center">
//                                                 <button
//                                                     onClick={handleReset}
//                                                     className="w-full mt-6 bg-blue-200 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
//                                                 >
//                                                     Start New Calculation
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 // Placeholder when no results yet
//                                 <div className="bg-linear-to-tr from-slate-50 via-white to-indigo-50 rounded-2xl shadow-lg p-6 border border-gray-200 h-full flex items-center justify-center">
//                                     <div className="text-center py-12">
//                                         <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <GraduationCap className="w-10 h-10 text-blue-600" />
//                                         </div>
//                                         <h3 className="text-xl font-bold mb-2">Ready to Calculate?</h3>
//                                         <p className="text-gray-600">
//                                             Fill in your information on the left to see your eligibility.
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </FormProvider>
//     );
// };

// export default EligibilityCalculator;
