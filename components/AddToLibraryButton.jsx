import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const AddToLibraryButton = ({ onClick }) => (
  <FontAwesomeIcon
    icon={faSquarePlus}
    className='icon w-6 h-6 cursor-pointer hover:text-red-600'
    onClick={onClick}
  />
);

export default AddToLibraryButton;
