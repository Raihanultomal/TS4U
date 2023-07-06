'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
  const router = useRouter();
  const props = {
    name,
  };
  return (
    <div>
      <h1>Hi {name}</h1>
    </div>
  );
}
