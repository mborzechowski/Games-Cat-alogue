const GameExpansionsAndDlc = ({ expansions, dlc }) => {
  return (
    <div className='mt-10 mb-10 flex justify-start gap-12'>
      {expansions && expansions.length > 0 && (
        <div className='flex flex-col items-center ml-10'>
          <h4 className='font-semibold mb-2'>Expansions:</h4>
          <div className='flex'>
            {expansions.map((expansionItem) => (
              <div key={expansionItem.id} className='relative group mx-2'>
                <img
                  src={expansionItem.cover_image}
                  alt={expansionItem.name}
                  className='w-16 h-16 object-cover rounded-md'
                />
                <div className='absolute top-20 left-1/2 transform -translate-x-1/2 text-red-600 bg-black w-28 text-center text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  {expansionItem.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dlc && dlc.length > 0 && (
        <div className='flex flex-col items-center'>
          <h4 className='font-semibold mb-2'>DLC:</h4>
          <div className='flex'>
            {dlc.map((dlcItem) => (
              <div key={dlcItem.id} className='relative group mx-2'>
                <img
                  src={dlcItem.cover_image}
                  alt={dlcItem.name}
                  className='w-16 h-16 object-cover rounded-md'
                />
                <div className='absolute top-20 left-1/2 transform -translate-x-1/2 text-red-600 bg-black w-28 text-center text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  {dlcItem.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameExpansionsAndDlc;
