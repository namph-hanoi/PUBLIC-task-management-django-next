'use client';
import React from 'react';
import { useGlobalStore } from '@/features/states/global';
import PageContainer from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';



export default function EmployerView() {
  const { user } = useGlobalStore();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Employer Dashboard
          </h2>
        </div>

        <Card className='@container/card'>
          <CardHeader>
            <CardTitle className='text-xl'>
              Welcome, {user?.first_name || 'Employer'}
            </CardTitle>
            <p className='text-muted-foreground mt-2'>
              This is your employer dashboard view
            </p>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}