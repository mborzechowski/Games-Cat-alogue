import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const AddToLibraryButton = ({ onClick }) => (
  <FontAwesomeIcon
    icon={faSquarePlus}
    className='icon w-3 sm:w-5 h-auto cursor-pointer hover:text-red-600'
    onClick={onClick}
  />
);

export default AddToLibraryButton;
