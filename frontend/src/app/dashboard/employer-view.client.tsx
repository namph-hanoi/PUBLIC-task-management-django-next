'use client';
import React, { useEffect } from 'react';
import { useGlobalStore } from '@/features/states/global';
import PageContainer from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { useStoreEmployees } from '@/features/states/employees';

export default function EmployerView() {
  const { user } = useGlobalStore();
  const employees = useStoreEmployees((state) => state.employees);
  const fetchEmployees = useStoreEmployees((state) => state.fetchEmployees);

  useEffect(() => {
    fetchEmployees().then(() => {
      console.log('Employees:', useStoreEmployees.getState().employees);
    });
  }, [fetchEmployees]);

  return (
    <>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Welcome, {user?.username || 'Employer'}
          </h2>
        </div>
        <div className='overflow-x-auto'>
          <h3 className='text-lg font-semibold mb-2'>Employees</h3>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Total Tasks</TableHead>
                  <TableHead className="text-center">Completed Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className='text-center'>
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp, idx) => (
                    <TableRow key={emp.employee_email || idx}>
                      <TableCell>{emp.employee_email}</TableCell>
                      <TableCell className="text-center">{emp.no_task_total}</TableCell>
                      <TableCell className="text-center">{emp.no_task_completed}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}