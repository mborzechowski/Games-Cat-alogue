import { useState } from 'react';

const CustomSelect = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className='relative inline-block text-red-600'>
      <button
        className='px-1 py-2 w-28 bg-transparent text-xs text-left rounded-lg focus:outline-none'
        onClick={toggleDropdown}
      >
        {value || 'Select'}
      </button>
      {isOpen && (
        <div className='absolute left-0  w-28 py-2 bg-black border border-red-600 rounded-md shadow-lg z-10 overflow-hidde'>
          <ul className='max-h-60'>
            {options.map((option) => (
              <li
                key={option}
                className='px-4 py-2 text-xs  hover:bg-gray-950 cursor-pointer rounded-md'
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
