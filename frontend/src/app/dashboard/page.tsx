import React from 'react';
import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import DashboardClient from './page.client';

export default function Dashboard() {

  return (
    <PageContainer>
      <DashboardClient />
    </PageContainer>
  );
}
