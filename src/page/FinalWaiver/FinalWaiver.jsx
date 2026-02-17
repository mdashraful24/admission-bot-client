import React, { useState, useEffect } from 'react';
import {
    GraduationCap, Award, Users, Target, Shield, Heart, Users2,
    Baby, Sparkles, BookOpen, Medal, ChevronDown, ChevronUp,
    Calendar, Clock, DollarSign, CheckCircle, XCircle,
    User, Flag, Trophy, Camera, Music, Palette, ArrowRight
} from 'lucide-react';

const FinalWaiver = () => {
    const [formData, setFormData] = useState({
        program: '',
        educationBoard: '',
        sscResult: '',
        sscGolden: 'no',
        hscResult: '',
        hscGolden: 'no',
        gender: '',
        playerStatus: 'no',
        playerCategory: '',
        eduStatus: 'general',
        faculty: 'fse',
        dipGpa: ''
    });

    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showProgramDetails, setShowProgramDetails] = useState(false);
    const [result, setResult] = useState(null);
    const [openSelect, setOpenSelect] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Program data
    const programs = [
        {
            id: 'cse',
            name: 'Computer Science & Engineering',
            duration: '4 Years',
            credits: 160,
            fees: 450000,
            icon: <Target className="w-5 h-5" />
        },
        {
            id: 'bba',
            name: 'Bachelor of Business Administration',
            duration: '4 Years',
            credits: 140,
            fees: 400000,
            icon: <Users className="w-5 h-5" />
        },
        {
            id: 'english',
            name: 'English Literature',
            duration: '4 Years',
            credits: 130,
            fees: 350000,
            icon: <BookOpen className="w-5 h-5" />
        },
        {
            id: 'law',
            name: 'LLB (Hons)',
            duration: '4 Years',
            credits: 145,
            fees: 380000,
            icon: <Shield className="w-5 h-5" />
        }
    ];

    const educationBoards = [
        'Dhaka', 'Rajshahi', 'Comilla', 'Jessore',
        'Chittagong', 'Barisal', 'Sylhet', 'Dinajpur',
        'Mymensingh', 'Technical', 'Madrasah'
    ];

    const playerCategories = [
        { id: 1, name: 'DIU', waiver: 20, icon: <Trophy className="w-4 h-4" /> },
        { id: 2, name: 'Sub Division', waiver: 40, icon: <Medal className="w-4 h-4" /> },
        { id: 3, name: 'First Division', waiver: 60, icon: <Award className="w-4 h-4" /> },
        { id: 4, name: 'Premier League', waiver: 90, icon: <Star className="w-4 h-4" /> },
        { id: 5, name: 'National Player', waiver: 100, icon: <Flag className="w-4 h-4" /> }
    ];

    const faculties = [
        { id: 'fse', name: 'Faculty of Science & Engineering' },
        { id: 'fhs', name: 'Faculty of Health Sciences' },
        { id: 'fbe', name: 'Faculty of Business & Economics' },
        { id: 'fhss', name: 'Faculty of Humanities & Social Sciences' },
        { id: 'fls', name: 'Faculty of Law' }
    ];

    // Handle program selection
    const handleProgramSelect = (programId) => {
        const program = programs.find(p => p.id === programId);
        setSelectedProgram(program);
        setFormData(prev => ({ ...prev, program: programId }));
        setShowProgramDetails(true);
        setOpenSelect(null);
    };

    // Calculate waiver
    const calculateWaiver = () => {
        let p_waiver = 0;
        let c_waiver = 0;
        let d_waiver = 0;
        let sf_waiver = 0;
        let f_waiver = formData.gender?.toLowerCase() === 'female' ? 10 : 0;

        // Calculate Result Based Waiver
        const hsc = parseFloat(formData.hscResult) || 0;
        const ssc = parseFloat(formData.sscResult) || 0;
        const hsc_g = formData.hscGolden === 'yes' ? 1 : 0;
        const ssc_g = formData.sscGolden === 'yes' ? 1 : 0;
        const faculty = formData.faculty?.toLowerCase();

        if (faculty === 'fhss') {
            if (hsc >= 4.75 && hsc <= 4.89) sf_waiver = 10;
            else if (hsc >= 4.9 && hsc <= 4.99) sf_waiver = 15;
            else if (hsc === 5.0) sf_waiver = 20;
            else if (ssc === 5.0 && hsc === 5.0) sf_waiver = 25;
            else if (hsc_g === 1 && ssc_g === 1) sf_waiver = 50;
            else if (hsc_g === 1) sf_waiver = 30;
        } else {
            if (hsc_g === 1 && ssc_g === 1) sf_waiver = 50;
            else if (hsc_g === 1) sf_waiver = 30;
            else if (hsc === 5.0 && ssc === 5.0) sf_waiver = 25;
            else if (hsc === 5.0) sf_waiver = 20;
            else if (hsc >= 4.9 && hsc <= 4.99) sf_waiver = 15;
            else if (hsc >= 4.5 && hsc <= 4.89) sf_waiver = 10;
        }

        // Calculate Diploma Waiver
        if (formData.dipGpa) {
            const gpa = parseFloat(formData.dipGpa);
            if (gpa >= 3.0 && gpa <= 3.49) d_waiver = 10;
            else if (gpa >= 3.5 && gpa <= 3.74) d_waiver = 15;
            else if (gpa >= 3.75 && gpa <= 3.79) d_waiver = 25;
            else if (gpa >= 3.8 && gpa <= 3.89) d_waiver = 30;
            else if (gpa >= 3.9 && gpa <= 4.0) d_waiver = 50;
        }

        // Calculate Player Waiver
        if (formData.playerStatus === 'yes' && formData.playerCategory) {
            const playerCat = playerCategories.find(p => p.id === parseInt(formData.playerCategory));
            p_waiver = playerCat?.waiver || 0;
        }

        // Determine final waiver (maximum of all applicable)
        const waivers = [
            f_waiver,
            sf_waiver,
            p_waiver,
            d_waiver,
            c_waiver
        ].filter(w => w > 0);

        const finalWaiver = waivers.length > 0 ? Math.max(...waivers) : 0;

        setResult({
            final: finalWaiver,
            breakdown: {
                female: f_waiver,
                result: sf_waiver,
                player: p_waiver,
                diploma: d_waiver,
                current: c_waiver
            }
        });
    };

    // Custom Select Component
    const CustomSelect = ({
        label,
        value,
        options,
        onChange,
        icon: Icon,
        placeholder,
        disabled = false,
        optionRenderer
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedOption = options?.find(opt =>
            typeof opt === 'string' ? opt === value : opt.id === value || opt === value
        );

        return (
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
                <div
                    className={`relative cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-blue-400 transition-all">
                        <div className="flex items-center gap-3">
                            {Icon && <Icon className="w-5 h-5 text-gray-400" />}
                            <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                                {selectedOption
                                    ? (typeof selectedOption === 'string'
                                        ? selectedOption
                                        : selectedOption.name || selectedOption.label || selectedOption)
                                    : placeholder || `Select ${label}`}
                            </span>
                        </div>
                        {isOpen ?
                            <ChevronUp className="w-5 h-5 text-gray-400" /> :
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        }
                    </div>

                    {isOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsOpen(false)}
                            />
                            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                                {options?.map((option, index) => {
                                    const optionValue = typeof option === 'string' ? option : option.id;
                                    const optionLabel = typeof option === 'string' ? option : option.name;

                                    return (
                                        <div
                                            key={index}
                                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors"
                                            onClick={() => {
                                                onChange(optionValue);
                                                setIsOpen(false);
                                            }}
                                        >
                                            {optionRenderer ? optionRenderer(option) : (
                                                <>
                                                    {option.icon && option.icon}
                                                    <span>{optionLabel}</span>
                                                    {value === optionValue && (
                                                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto min-h-screen px-4 py-10 md:py-14 lg:py-20">
            {/* Header */}
            <div className="text-center mb-10 lg:mb-0">
                <div className="flex flex-col items-center gap-2 md:gap-4">
                    <div className='flex justify-center md:items-center lg:items-start gap-x-5'>
                        <div className="hidden md:block p-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl">
                            <GraduationCap className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
                            Calculate Your DIU Waiver
                        </h3>
                    </div>
                    <div>
                        <p className="md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                            Discover your tuition fees through applicable waivers and scholarships. Get instant details of your admission payments and total savings.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - Left Form, Right Result */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8">
                {/* Left Side - Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 lg:mt-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                        Student Information
                    </h2>

                    <div className="space-y-6">
                        {/* Program Selection */}
                        <CustomSelect
                            label="Select Program"
                            value={formData.program}
                            options={programs}
                            onChange={handleProgramSelect}
                            icon={GraduationCap}
                            placeholder="Choose your program"
                            optionRenderer={(program) => (
                                <div className="flex items-center gap-3 w-full">
                                    <div className="p-1.5 bg-blue-50 rounded-lg">
                                        {program.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{program.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {program.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" /> {program.credits} Credits
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        {/* Program Details - Shows after selection */}
                        {selectedProgram && showProgramDetails && (
                            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 animate-fadeIn">
                                <h3 className="font-semibold text-gray-800 mb-3">Program Details</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="text-xs text-gray-500">Duration</div>
                                        <div className="font-bold text-gray-800">{selectedProgram.duration}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                            <BookOpen className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="text-xs text-gray-500">Credits</div>
                                        <div className="font-bold text-gray-800">{selectedProgram.credits}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                            <DollarSign className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-xs text-gray-500">Total Fees</div>
                                        <div className="font-bold text-gray-800">৳{selectedProgram.fees.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Education Status */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Education Status</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['general', 'diploma'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, eduStatus: status }));
                                            setOpenSelect(null);
                                        }}
                                        className={`px-4 py-3 rounded-xl border-2 transition-all ${formData.eduStatus === status
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-blue-300 text-gray-600'
                                            }`}
                                    >
                                        {status === 'general' ? 'General' : 'Diploma'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Academic Results Section */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                <Award className="w-4 h-4 text-blue-600" />
                                Academic Results
                            </h3>

                            {formData.eduStatus === 'general' ? (
                                <>
                                    {/* SSC Result */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                SSC Result/Equivalent
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.sscResult}
                                                onChange={(e) => setFormData(prev => ({ ...prev, sscResult: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Enter GPA (e.g., 5.00)"
                                            />
                                        </div>

                                        {/* Golden GPA Option */}
                                        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                                            <span className="text-sm text-gray-600">Golden GPA?</span>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="sscGolden"
                                                    value="yes"
                                                    checked={formData.sscGolden === 'yes'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, sscGolden: e.target.value }))}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="sscGolden"
                                                    value="no"
                                                    checked={formData.sscGolden === 'no'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, sscGolden: e.target.value }))}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* HSC Result */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                HSC Result/Equivalent
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.hscResult}
                                                onChange={(e) => setFormData(prev => ({ ...prev, hscResult: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Enter GPA (e.g., 5.00)"
                                            />
                                        </div>

                                        {/* Golden GPA Option */}
                                        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
                                            <span className="text-sm text-gray-600">Golden GPA?</span>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="hscGolden"
                                                    value="yes"
                                                    checked={formData.hscGolden === 'yes'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, hscGolden: e.target.value }))}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="hscGolden"
                                                    value="no"
                                                    checked={formData.hscGolden === 'no'}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, hscGolden: e.target.value }))}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-sm">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Diploma GPA Input
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Diploma GPA
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.dipGpa}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dipGpa: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter Diploma GPA"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                Additional Information
                            </h3>

                            {/* Education Board */}
                            <CustomSelect
                                label="Education Board/University"
                                value={formData.educationBoard}
                                options={educationBoards}
                                onChange={(value) => {
                                    setFormData(prev => ({ ...prev, educationBoard: value }));
                                    setOpenSelect(null);
                                }}
                                icon={BookOpen}
                                placeholder="Select your board"
                            />

                            {/* Faculty Selection */}
                            <CustomSelect
                                label="Faculty"
                                value={formData.faculty}
                                options={faculties}
                                onChange={(value) => {
                                    setFormData(prev => ({ ...prev, faculty: value }));
                                    setOpenSelect(null);
                                }}
                                icon={GraduationCap}
                                placeholder="Select faculty"
                            />

                            {/* Gender */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['male', 'female', 'other'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, gender: g }));
                                                setOpenSelect(null);
                                            }}
                                            className={`px-4 py-3 rounded-xl border-2 transition-all capitalize ${formData.gender === g
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-blue-300 text-gray-600'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Others Field - Player Status */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-blue-600" />
                                Others
                            </h3>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Are you a player?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['yes', 'no'].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, playerStatus: status }));
                                                setOpenSelect(null);
                                            }}
                                            className={`px-4 py-3 rounded-xl border-2 transition-all capitalize ${formData.playerStatus === status
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-blue-300 text-gray-600'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Player Category - Shows only if player status is yes */}
                            {formData.playerStatus === 'yes' && (
                                <div className="animate-slideDown">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Player Category
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {playerCategories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, playerCategory: cat.id }));
                                                    setOpenSelect(null);
                                                }}
                                                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${formData.playerCategory == cat.id
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-lg ${formData.playerCategory == cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100'
                                                        }`}>
                                                        {cat.icon}
                                                    </div>
                                                    <span className="font-medium">{cat.name}</span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-lg text-sm font-semibold ${formData.playerCategory == cat.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {cat.waiver}%
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Calculate Button */}
                        <button
                            onClick={calculateWaiver}
                            disabled={!formData.program || !formData.gender || (!formData.sscResult && !formData.dipGpa)}
                            className="w-full bg-indigo-800 text-white p-2.5 rounded-lg font-semibold text-lg hover:bg-indigo-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                        >
                            Calculate Waiver
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Right Side - Result */}
                <div className="lg:sticky lg:top-8 h-fit">
                    {result ? (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 animate-fadeIn lg:mt-12">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-linear-to-b from-green-600 to-emerald-600 rounded-full"></div>
                                Your Waiver Results
                            </h2>

                            {/* Main Result Card */}
                            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 mb-6">
                                <div className="text-center">
                                    <p className="text-sm uppercase tracking-wide text-green-600 font-semibold mb-2">
                                        Final Waiver
                                    </p>
                                    <div className="text-6xl font-bold text-green-600 mb-2">
                                        {result.final}%
                                    </div>
                                    <p className="text-gray-600">You are eligible for this waiver</p>
                                </div>
                            </div>

                            {/* Waiver Breakdown */}
                            <div className="space-y-3">
                                <h3 className="font-medium text-gray-700 mb-3">Waiver Breakdown</h3>

                                {result.breakdown.female > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl border border-pink-100">
                                        <div className="flex items-center gap-3">
                                            <Heart className="w-5 h-5 text-pink-600" />
                                            <span className="text-gray-700">Female Quota</span>
                                        </div>
                                        <span className="font-bold text-pink-600">{result.breakdown.female}%</span>
                                    </div>
                                )}

                                {result.breakdown.result > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-700">Result Based</span>
                                        </div>
                                        <span className="font-bold text-blue-600">{result.breakdown.result}%</span>
                                    </div>
                                )}

                                {result.breakdown.player > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <Trophy className="w-5 h-5 text-orange-600" />
                                            <span className="text-gray-700">Player Waiver</span>
                                        </div>
                                        <span className="font-bold text-orange-600">{result.breakdown.player}%</span>
                                    </div>
                                )}

                                {result.breakdown.diploma > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="flex items-center gap-3">
                                            <GraduationCap className="w-5 h-5 text-purple-600" />
                                            <span className="text-gray-700">Diploma Waiver</span>
                                        </div>
                                        <span className="font-bold text-purple-600">{result.breakdown.diploma}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Program Info Summary */}
                            {selectedProgram && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                    <h3 className="font-medium text-gray-700 mb-3">Program Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Program:</span>
                                            <span className="font-medium text-gray-800">{selectedProgram.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Duration:</span>
                                            <span className="font-medium text-gray-800">{selectedProgram.duration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Total Credits:</span>
                                            <span className="font-medium text-gray-800">{selectedProgram.credits}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Total Fees:</span>
                                            <span className="font-medium text-gray-800">৳{selectedProgram.fees.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-gray-500">After Waiver:</span>
                                            <span className="font-bold text-green-600">
                                                ৳{(selectedProgram.fees * (1 - result.final / 100)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setResult(null);
                                    setFormData({
                                        program: '',
                                        educationBoard: '',
                                        sscResult: '',
                                        sscGolden: 'no',
                                        hscResult: '',
                                        hscGolden: 'no',
                                        gender: '',
                                        playerStatus: 'no',
                                        playerCategory: '',
                                        eduStatus: 'general',
                                        faculty: 'fse',
                                        dipGpa: ''
                                    });
                                    setSelectedProgram(null);
                                    setShowProgramDetails(false);
                                }}
                                className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                            >
                                New Calculation
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 h-full flex items-center justify-center lg:mt-12">
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Calculate?</h3>
                                <p className="text-gray-500 max-w-sm">
                                    Fill in your information on the left to see your eligible waivers
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

// Star icon component for player categories
const Star = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default FinalWaiver;
