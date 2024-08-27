const SearchBar = ({ query, setQuery, onSearch, loading }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Search for a game...'
        className='text-white bg-transparent border-red-600 border-b-2 focus:border-red-600 focus:outline-none pl-4'
      />
      <button onClick={onSearch} disabled={loading} className='text-red-600'>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
};

export default SearchBar;
