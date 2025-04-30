import Header from '@/components/layout/header';
import TaskPageClient from './page.client';
import PageContainer from '@/components/layout/page-container';


const TaskPage = () => {
  return (
    <PageContainer>
      <TaskPageClient />
    </PageContainer>
  );
};

export default TaskPage;