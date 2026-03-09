import { Suspense } from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeClient />
    </Suspense>
  );
}
