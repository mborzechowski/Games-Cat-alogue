import { Suspense } from 'react';
import LibraryList from '@/components/LibraryList';

export default function LibraryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LibraryList />
    </Suspense>
  );
}
