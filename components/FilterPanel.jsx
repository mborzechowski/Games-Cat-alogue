import { useState } from 'react';

export default function FilterPanel({ isOpen, onClose, onFilterChange }) {
  const [finishedFilter, setFinishedFilter] = useState('');

  const handleFinishedChange = (event) => {
    const value = event.target.value;
    setFinishedFilter(value);
    onFilterChange(value);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className='p-4'>
        <div className='flex justify-between items-center  border-b-2 border-red-600 py-2'>
          <h2 className='text-lg '>Filters</h2>
          <button className='text-red-600 font-bold' onClick={onClose}>
            Close
          </button>
        </div>
        <div className='mt-4'>
          <label className='block mb-4'>
            <span className='text-sm font-semibold'>Finished</span>
            <select
              value={finishedFilter}
              onChange={handleFinishedChange}
              className='w-full px-2 py-1 mt-2 bg-transparent  focus:outline-none'
            >
              <option value='' className='bg-transparent text-black'>
                All
              </option>
              <option value='true' className='bg-transparent text-black'>
                Finished
              </option>
              <option value='false' className='bg-transparent text-black'>
                Not Finished
              </option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
