'use client';
import { PuffLoader } from 'react-spinners';
const override = {
  display: 'block',
  margin: '0 auto',
};

const Spinner = ({ loading }) => {
  if (!loading) return null;
  return (
    <PuffLoader
      color='#ff0000'
      loading={loading}
      cssOverride={override}
      size={100}
      speedMultiplier={1}
    />
  );
};

export default Spinner;
