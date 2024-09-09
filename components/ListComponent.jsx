'use client';
import { useState } from 'react';
const Lists = () => {
  const [activeTab, setActiveTab] = useState('Wishlist');

  const tabs = ['Wishlist', 'On loan', 'Playing', 'Next in line', 'On sale'];

  return (
    <div className='mt-44'>
      <div className='flex gap-4 '>
        {tabs.map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 -mb-px  text-xl border-b-2 ${
              activeTab === tabName
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-600'
            } hover:text-red-600`}
          >
            {tabName}
          </button>
        ))}
      </div>

      <div className='mt-4 p-4 '>This list is empty... for now</div>
    </div>
  );
};

export default Lists;
