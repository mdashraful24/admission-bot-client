import { useState, useEffect } from 'react';
import { GraduationCap, Award, Users, Heart, BookOpen, Medal, Clock, CheckCircle, Flag, Trophy, ArrowRight, Star, Globe, Building, User } from 'lucide-react';
import programsData from "../../data/programs.json"
import CustomSelect from '../../shared/CustomSelect/CustomSelect';

const FinalWaiver = () => {
    const [formData, setFormData] = useState({
        program: '',
        educationBoard: '',
        sscResult: '',
        sscGolden: 'no',
        hscResult: '',
        hscGolden: 'no',
        gender: '',
        playerStatus: '',
        playerCategory: '',
        eduStatus: 'general',
        faculty: '',
        dipGpa: ''
    });

    const [selectedProgram, setSelectedProgram] = useState(null);
    const [showProgramDetails, setShowProgramDetails] = useState(false);
    const [result, setResult] = useState(null);
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (programsData && programsData.programs) {
            setPrograms(programsData.programs);
        }
    }, []);

    // Education Board Types
    const educationBoardTypes = [
        { id: 'general', name: 'General Education Board', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'technical', name: 'Technical Board', icon: <Award className="w-4 h-4" /> },
        { id: 'madrasha', name: 'Madrasha Board', icon: <GraduationCap className="w-4 h-4" /> }
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
        { id: 'fe', name: 'Faculty of Engineering' },
        { id: 'fhs', name: 'Faculty of Health Sciences' },
        { id: 'fbe', name: 'Faculty of Business & Economics' },
        { id: 'fhss', name: 'Faculty of Humanities & Social Sciences' },
        { id: 'fls', name: 'Faculty of Law' }
    ];

    // Gender options
    const genderOptions = [
        { id: 'male', name: 'Male', icon: <Users className="w-4 h-4" /> },
        { id: 'female', name: 'Female', icon: <Heart className="w-4 h-4" /> },
        { id: 'other', name: 'Other', icon: <Users className="w-4 h-4" /> }
    ];

    // Player status options
    const playerStatusOptions = [
        { id: 'yes', name: 'Yes', icon: <Trophy className="w-4 h-4" /> },
        { id: 'no', name: 'No', icon: <Users className="w-4 h-4" /> }
    ];

    // Education status options
    const educationStatusOptions = [
        { id: 'general', name: 'General', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'diploma', name: 'Diploma', icon: <Award className="w-4 h-4" /> }
    ];

    // Function to validate GPA input
    const validateGPA = (value, maxGPA) => {
        if (value === '') return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0 && num <= maxGPA;
    };

    // Handle GPA input change with validation
    const handleGPAChange = (field, value, maxGPA) => {
        // Allow empty string, numbers, and decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            if (value === '' || validateGPA(value, maxGPA)) {
                setFormData(prev => ({ ...prev, [field]: value }));
            }
        }
    };

    // Function to check if form is valid
    const isFormValid = () => {
        // Check basic required fields
        if (!formData.program || !formData.gender || !formData.educationBoard || !formData.faculty) {
            return false;
        }

        // Check academic results based on education status
        if (formData.eduStatus === 'general') {
            // Check SSC and HSC results
            if (!formData.sscResult || !formData.hscResult) {
                return false;
            }

            // Check if results are valid numbers
            const ssc = parseFloat(formData.sscResult);
            const hsc = parseFloat(formData.hscResult);

            if (isNaN(ssc) || ssc < 0 || ssc > 5 || isNaN(hsc) || hsc < 0 || hsc > 5) {
                return false;
            }

            // Check Golden GPA options when GPA is 5.0
            if (ssc === 5.0 && !formData.sscGolden) {
                return false;
            }
            if (hsc === 5.0 && !formData.hscGolden) {
                return false;
            }
        } else {
            // Check Diploma GPA
            if (!formData.dipGpa) {
                return false;
            }
            const dipGpa = parseFloat(formData.dipGpa);
            if (isNaN(dipGpa) || dipGpa < 0 || dipGpa > 4) {
                return false;
            }
        }

        return true;
    };

    // Check if GPA is 5.00 to show Golden option
    const showGoldenOption = (gpa) => {
        return parseFloat(gpa) === 5.0;
    };

    // Handle program selection
    const handleProgramSelect = (programId) => {
        const program = programs.find(p => p.id === programId);
        setSelectedProgram(program);
        setFormData(prev => ({ ...prev, program: programId }));
        setShowProgramDetails(true);
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

        // Scroll to results
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    return (
        <div className="container max-w-7xl mx-auto min-h-screen px-4 py-10 md:py-14 lg:py-20">
            {/* Header */}
            <div className="text-center mb-10 lg:mb-0">
                <div className="flex flex-col items-center gap-2 md:gap-4">
                    <div className='flex justify-center md:items-center lg:items-start gap-x-5'>
                        <div className="hidden md:block p-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl">
                            <GraduationCap className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-semibold">
                            Calculate Your Waiver & Tuition Fees
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 no-animation-grid">
                {/* Left Side - Form */}
                <div className="bg-linear-to-br from-slate-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-gray-200 lg:mt-12">
                    <div className="bg-linear-to-r from-blue-100 to-white p-2 border-b border-gray-200 rounded-t-2xl">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Program & Details
                        </h3>
                    </div>

                    <div className='p-4.5 md:p-6'>
                        <div className="space-y-6">
                            {/* Program Selection */}
                            <CustomSelect
                                label="Select Program"
                                value={formData.program}
                                options={programs}
                                onChange={handleProgramSelect}
                                icon={GraduationCap}
                                placeholder="Choose your program"
                                required
                                optionRenderer={(program, isSelected) => (
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="flex-1">
                                            <div className={`${isSelected ? 'text-white font-medium' : ''}`}>
                                                {program.name}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle className="w-5 h-5 text-white ml-auto" />
                                        )}
                                    </div>
                                )}
                            />

                            {/* Program Details - Shows after selection */}
                            {selectedProgram && showProgramDetails && (
                                <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 animate-fadeIn">
                                    <h3 className="font-semibold mb-3">Program Details</h3>
                                    <div className="grid grid-cols-3 gap-4 no-animation-grid">
                                        <div className="text-center">
                                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="text-xs">Duration</div>
                                            <div className="font-bold">{selectedProgram.duration || 'N/A'}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div className="text-xs">Credits</div>
                                            <div className="font-bold">{selectedProgram.credits || 'N/A'}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                                                <p className="w-5 h-5 text-green-600 font-bold" >৳</p>
                                            </div>
                                            <div className="text-xs">Total Fees</div>
                                            <div className="font-bold">{selectedProgram.fees ? `৳${selectedProgram.fees}` : 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Education Status - Using CustomSelect */}
                            <CustomSelect
                                label="Education Status"
                                value={formData.eduStatus}
                                options={educationStatusOptions}
                                onChange={(value) => {
                                    setFormData(prev => ({ ...prev, eduStatus: value }));
                                }}
                                icon={BookOpen}
                                placeholder="Select education status"
                                required
                                optionRenderer={(option, isSelected) => (
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1 rounded ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                            {option.icon}
                                        </div>
                                        <span className={isSelected ? 'font-medium' : ''}>{option.name}</span>
                                        {isSelected && (
                                            <CheckCircle className="w-5 h-5 text-white ml-auto" />
                                        )}
                                    </div>
                                )}
                            />

                            {/* Academic Results Section */}
                            <div className="space-y-4">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Award className="w-4 h-4 text-blue-600" />
                                    Academic Results
                                </h3>

                                {formData.eduStatus === 'general' ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center justify-items-center gap-3 no-animation-grid">
                                            {/* SSC Result */}
                                            <div className='w-full'>
                                                <label className="block text-sm font-medium mb-2">
                                                    SSC Result/Equivalent <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.sscResult}
                                                    onChange={(e) => handleGPAChange('sscResult', e.target.value, 5)}
                                                    className="w-full px-4 py-2 border border-gray-200 hover:border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500"
                                                    placeholder="Enter GPA out of 5.00"
                                                />
                                            </div>

                                            {/* HSC Result */}
                                            <div className='hidden md:block w-full'>
                                                <label className="block text-sm font-medium mb-2">
                                                    HSC Result/Equivalent <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.hscResult}
                                                    onChange={(e) => handleGPAChange('hscResult', e.target.value, 5)}
                                                    className="w-full px-4 py-2 border border-gray-200 hover:border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500"
                                                    placeholder="Enter GPA out of 5.00"
                                                    required
                                                />
                                            </div>

                                            {/* Golden GPA Option - Only shows if GPA is 5.00 */}
                                            {showGoldenOption(formData.sscResult) && (
                                                <div className="w-full flex items-center gap-2 bg-gray-50 border border-gray-100 px-2 py-3 rounded-lg">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm font-medium">Golden GPA?</span>
                                                    <div className="flex items-center gap-3 ml-auto">
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
                                            )}

                                            {/* HSC Result - Mobile */}
                                            <div className='block md:hidden w-full'>
                                                <label className="block text-sm font-medium mb-2">
                                                    HSC Result/Equivalent <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.hscResult}
                                                    onChange={(e) => handleGPAChange('hscResult', e.target.value, 5)}
                                                    className="w-full px-4 py-2 border border-gray-200 hover:border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter GPA out of 5.00"
                                                    required
                                                />
                                            </div>

                                            {/* Golden GPA Option - Only shows if GPA is 5.00 */}
                                            {showGoldenOption(formData.hscResult) && (
                                                <div className="w-full flex items-center gap-2 bg-gray-50 border border-gray-100 px-2 py-3 rounded-lg">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm font-medium">Golden GPA?</span>
                                                    <div className="flex items-center gap-3 ml-auto">
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
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    // Diploma GPA Input
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Diploma GPA <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.dipGpa}
                                            onChange={(e) => handleGPAChange('dipGpa', e.target.value, 4)}
                                            className="w-full px-4 py-2 border border-gray-200 hover:border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter Diploma GPA out of 4.00"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Additional Information
                                </h3>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 no-animation-grid'>
                                    {/* Education Board/University - Using CustomSelect */}
                                    <CustomSelect
                                        label="Education Board/University"
                                        value={formData.educationBoard}
                                        options={educationBoardTypes}
                                        onChange={(value) => {
                                            setFormData(prev => ({ ...prev, educationBoard: value }));
                                        }}
                                        icon={Globe}
                                        placeholder="Select education board"
                                        required
                                        optionRenderer={(option, isSelected) => (
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1 rounded ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                                    {option.icon}
                                                </div>
                                                <span className={isSelected ? 'font-medium' : ''}>{option.name}</span>
                                                {isSelected && (
                                                    <CheckCircle className="w-5 h-5 text-white ml-auto" />
                                                )}
                                            </div>
                                        )}
                                    />

                                    {/* Faculty Selection - Using CustomSelect */}
                                    <CustomSelect
                                        label="Faculty"
                                        value={formData.faculty}
                                        options={faculties}
                                        onChange={(value) => {
                                            setFormData(prev => ({ ...prev, faculty: value }));
                                        }}
                                        icon={Building}
                                        placeholder="Select faculty"
                                        required
                                    />

                                    {/* Gender Selection - Using CustomSelect */}
                                    <CustomSelect
                                        label="Gender"
                                        value={formData.gender}
                                        options={genderOptions}
                                        onChange={(value) => {
                                            setFormData(prev => ({ ...prev, gender: value }));
                                        }}
                                        icon={User}
                                        placeholder="Select gender"
                                        required
                                        optionRenderer={(option, isSelected) => (
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1 rounded ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                                    {option.icon}
                                                </div>
                                                <span className={isSelected ? 'font-medium' : ''}>{option.name}</span>
                                                {isSelected && (
                                                    <CheckCircle className="w-5 h-5 text-white ml-auto" />
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Others Field - Player Status */}
                            <div className="space-y-4">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-blue-600" />
                                    Others
                                </h3>

                                {/* Are you a player? - Using CustomSelect */}
                                <CustomSelect
                                    label="Are you a player? (Optional)"
                                    value={formData.playerStatus}
                                    options={playerStatusOptions}
                                    onChange={(value) => {
                                        setFormData(prev => ({ ...prev, playerStatus: value, playerCategory: '' }));
                                    }}
                                    icon={Trophy}
                                    placeholder="Select option"
                                    optionRenderer={(option, isSelected) => (
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1 rounded ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                                {option.icon}
                                            </div>
                                            <span className={isSelected ? 'font-medium' : ''}>{option.name}</span>
                                            {isSelected && (
                                                <CheckCircle className="w-5 h-5 text-white ml-auto" />
                                            )}
                                        </div>
                                    )}
                                />

                                {/* Player Category - Shows only if player status is yes */}
                                {formData.playerStatus === 'yes' && (
                                    <div className="animate-slideDown">
                                        <label className="block text-sm font-medium mb-2">
                                            Player Category
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-3 no-animation-grid text-xs md:text-sm">
                                            {playerCategories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, playerCategory: cat.id }));
                                                    }}
                                                    className={`flex items-center justify-between text-xs p-1.5 rounded-lg border transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${formData.playerCategory == cat.id
                                                        ? 'border-blue-600 bg-blue-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`hidden md:block p-1.5 rounded-lg ${formData.playerCategory == cat.id
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100'
                                                            }`}>
                                                            {cat.icon}
                                                        </div>
                                                        <span className="font-medium">{cat.name}</span>
                                                    </div>
                                                    <span className={`p-1 rounded-lg font-semibold ${formData.playerCategory == cat.id
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
                                disabled={!isFormValid()}
                                className="w-full bg-blue-800 text-white p-2.5 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer mt-12"
                            >
                                Calculate Waiver
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Show message when form is incomplete */}
                        {!isFormValid() && (
                            <p className="text-sm text-amber-600 text-center mt-2">
                                Please fill in all required fields to check eligibility
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Side - Result */}
                <div id="results-section" className="lg:sticky lg:top-8 h-fit">
                    {result ? (
                        <div className="bg-linear-to-tr from-slate-50 via-white to-indigo-50 rounded-2xl shadow-lg p-6 border border-gray-200 animate-fadeIn lg:mt-12">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
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
                                <h3 className="font-medium mb-3">Waiver Breakdown</h3>

                                {result.breakdown.female > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl border border-pink-100">
                                        <div className="flex items-center gap-3">
                                            <Heart className="w-5 h-5 text-pink-600" />
                                            <span>Female Quota</span>
                                        </div>
                                        <span className="font-bold text-pink-600">{result.breakdown.female}%</span>
                                    </div>
                                )}

                                {result.breakdown.result > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5 text-blue-600" />
                                            <span>Result Based</span>
                                        </div>
                                        <span className="font-bold text-blue-600">{result.breakdown.result}%</span>
                                    </div>
                                )}

                                {result.breakdown.player > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <Trophy className="w-5 h-5 text-orange-600" />
                                            <span>Player Waiver</span>
                                        </div>
                                        <span className="font-bold text-orange-600">{result.breakdown.player}%</span>
                                    </div>
                                )}

                                {result.breakdown.diploma > 0 && (
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="flex items-center gap-3">
                                            <GraduationCap className="w-5 h-5 text-purple-600" />
                                            <span>Diploma Waiver</span>
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
                                            <span className="font-medium text-gray-800">{selectedProgram.duration || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Total Credits:</span>
                                            <span className="font-medium text-gray-800">{selectedProgram.credits || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Total Fees:</span>
                                            <span className="font-medium text-gray-800">{selectedProgram.fees ? `৳${selectedProgram.fees}` : 'N/A'}</span>
                                        </div>
                                        {selectedProgram.fees && (
                                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                                <span className="text-gray-500">After Waiver:</span>
                                                <span className="font-bold text-green-600">
                                                    ৳{(parseFloat(selectedProgram.fees) * (1 - result.final / 100)).toLocaleString()}
                                                </span>
                                            </div>
                                        )}
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
                                        playerStatus: '',
                                        playerCategory: '',
                                        eduStatus: 'general',
                                        faculty: '',
                                        dipGpa: ''
                                    });
                                    setSelectedProgram(null);
                                    setShowProgramDetails(false);
                                }}
                                className="w-full mt-6 bg-blue-200 py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            >
                                New Calculation
                            </button>
                        </div>
                    ) : (
                        <div className="bg-linear-to-tr from-slate-50 via-white to-indigo-50 rounded-2xl shadow-lg p-6 border border-gray-200 h-full flex items-center justify-center lg:mt-12">
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Ready to Calculate?</h3>
                                <p className="max-w-sm text-gray-600">
                                    Fill in your information on the left to see your eligible waivers
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinalWaiver;
