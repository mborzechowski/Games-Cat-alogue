import Spinner from '@/components/Spinner';

const SearchBar = ({ query, setQuery, onSearch, loading }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className='flex flex-col gap-4 items-center md:ml-36'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Search for a game...'
        className='text-white bg-transparent border-red-600 border-b-2 focus:border-red-600 focus:outline-none pl-4 w-2/3'
      />
      <button onClick={onSearch} disabled={loading} className='text-red-600'>
        {loading ? (
          <Spinner loading={loading} className='mt-2' />
        ) : (
          <p className='lg:mt-10 mt-4 mb-14'>Search</p>
        )}
      </button>
    </div>
  );
};

export default SearchBar;
