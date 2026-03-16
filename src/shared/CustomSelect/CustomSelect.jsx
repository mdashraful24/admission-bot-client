import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const CustomSelect = ({
    label,
    value,
    options,
    onChange,
    onBlur,
    icon: Icon,
    placeholder,
    disabled = false,
    optionRenderer,
    className = '',
    required = false,
    error = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState('bottom');
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    // Find the selected option
    const selectedOption = options?.find(opt => {
        if (typeof opt === 'string') {
            return opt === value;
        }
        return opt.id === value || opt === value;
    });

    // Reorder options to put selected item at the top
    const getOrderedOptions = () => {
        if (!options || !value) return options;

        // Create a copy of options array
        const optionsCopy = [...options];

        // Find the index of selected option
        const selectedIndex = optionsCopy.findIndex(opt => {
            if (typeof opt === 'string') {
                return opt === value;
            }
            return opt.id === value || opt === value;
        });

        // If selected option found, remove it and put at the beginning
        if (selectedIndex !== -1) {
            const [selectedItem] = optionsCopy.splice(selectedIndex, 1);
            return [selectedItem, ...optionsCopy];
        }

        return optionsCopy;
    };

    const orderedOptions = getOrderedOptions();

    // Check if dropdown should open upward or downward
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 240; // max-h-60 = 240px

            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
        if (onBlur) onBlur();
    };

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
        >
            {label && (
                <label className="block text-sm font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div
                className={`relative cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className={`w-full px-4 py-2 bg-white border rounded-lg flex items-center justify-between transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${error ? 'border-red-500' : 'border-gray-200'
                    }`}>
                    <div className="flex items-center gap-3 truncate">
                        {Icon && <Icon className={`w-5 h-5 shrink-0 ${selectedOption ? 'text-blue-600' : 'text-gray-500'}`} />}
                        <span className={`truncate ${selectedOption ? '' : 'text-gray-500'}`}>
                            {selectedOption
                                ? (typeof selectedOption === 'string'
                                    ? selectedOption
                                    : selectedOption.name || selectedOption.label || selectedOption)
                                : placeholder || `Select ${label}`}
                        </span>
                    </div>
                    {isOpen ?
                        <ChevronUp className={`w-5 h-5 shrink-0 ${selectedOption ? 'text-blue-600' : 'text-gray-500'}`} /> :
                        <ChevronDown className={`w-5 h-5 shrink-0 ${selectedOption ? 'text-blue-600' : 'text-gray-500'}`} />
                    }
                </div>

                {/* Dropdown menu */}
                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className={`absolute w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto z-50 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                            }`}
                        style={{
                            maxHeight: '240px'
                        }}
                    >
                        {orderedOptions?.map((option, index) => {
                            const optionValue = typeof option === 'string' ? option : option.id;
                            const optionLabel = typeof option === 'string' ? option : option.name;
                            const isSelected = value === optionValue;

                            return (
                                <div
                                    key={index}
                                    className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-3 transition-colors focus:outline-none ${isSelected
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-blue-50 text-gray-700'
                                        }`}
                                    onClick={() => handleSelect(optionValue)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            handleSelect(optionValue);
                                            e.preventDefault();
                                        }
                                    }}
                                    tabIndex={0}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    {optionRenderer ? optionRenderer(option, isSelected) : (
                                        <>
                                            <span className={`truncate ${isSelected ? 'font-medium' : ''}`}>{optionLabel}</span>
                                            {isSelected && (
                                                <CheckCircle className="w-5 h-5 text-white ml-auto shrink-0" />
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600 mt-1">
                    This field is required
                </p>
            )}
        </div>
    );
};

export default CustomSelect;