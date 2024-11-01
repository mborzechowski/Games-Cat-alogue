import { FaCheckCircle } from 'react-icons/fa';

const GameDetailsNoteAndImage = ({
  note,
  setNote,
  handleFileChange,
  selectedFile,
  selectedLists,
  handleAddToList,
  isEditing,
}) => {
  if (!isEditing) return null;

  return (
    <>
      <div className='flex items-center'>
        <strong className='text-red-600'>Add Note:</strong>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className='w-60 px-2 mt-2 ml-4 h-8 bg-black text-white border-b-2 border-r-2 rounded-xl border-red-600 text-sm focus:outline-none hover:outline-none resize-none'
        />
      </div>

      <div className='mt-4 flex items-center'>
        <strong className='text-red-600 mr-2'>Add Image:</strong>
        <div className='relative'>
          <input
            type='file'
            onChange={handleFileChange}
            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
          />
          <button className='cursor-pointer flex items-center justify-center bg-gblack text-white w-24 text-sm border-b-2 border-r-2 rounded-xl border-red-600'>
            Choose file
          </button>
        </div>
        {selectedFile && (
          <span className='ml-2 text-sm text-red-600 font-semibold'>
            {selectedFile}
          </span>
        )}
      </div>

      <div className='flex mt-2'>
        <div className='flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-4'>
          {['Next in line', 'On loan', 'On hold', 'On sale'].map((list) => (
            <div
              key={list}
              className='cursor-pointer flex items-center justify-between bg-grey-600 text-white px-2 py-1 w-28 text-sm border-b-2 border-r-2 rounded-xl border-red-600'
              onClick={() => handleAddToList(list)}
            >
              <span>{list}</span>
              {selectedLists.includes(list) && (
                <FaCheckCircle className='text-red-600 ml-2' />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameDetailsNoteAndImage;
