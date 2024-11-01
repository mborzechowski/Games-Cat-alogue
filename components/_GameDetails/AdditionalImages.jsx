const AdditionalImages = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return null;
  }
  return (
    <div className='my-4'>
      <strong>Gallery:</strong>
      <div className='flex flex-wrap gap-2 mt-2'>
        {images &&
          images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={`Additional ${index + 1}`}
              className='w-20 h-20 object-cover rounded cursor-pointer'
              onClick={() => onImageClick(img.url)}
            />
          ))}
      </div>
    </div>
  );
};

export default AdditionalImages;
