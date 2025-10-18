'use client';

import { useParams, useRouter } from 'next/navigation';
import ApplicationReview from '@/components/ApplicationReview';

export default function ApplicationReviewPage() {
  const params = useParams();
  const router = useRouter();
  
  const applicationId = parseInt(params.id as string);

  const handleBack = () => {
    router.push('/dashboard'); // or wherever your dashboard route is
  };

  return (
    <ApplicationReview 
      applicationId={applicationId}
      onBack={handleBack}
    />
  );
}