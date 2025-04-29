import pytest
from unittest import TestCase
from tests.factories import TaskFactory
from tasks.models import Task
from django.utils import timezone
import datetime

from tests.utils import (
    api_create_task,
    api_get_task,
    api_list_tasks,
    api_update_task,
    api_client,
)


@pytest.mark.integration
class TestTaskRBAC:
    
    # EMPLOYEE
    @pytest.mark.django_db
    def test_employee_can_not_create_task(self, employee_1_token):
        # assert 403 FORBIDDEN on the route of task creation
        assert_data = {
            "title": "Task by Employee",
            "description": "This should fail",
            "assignee": 1  # any id
        }
        response = api_create_task(employee_1_token.value, assert_data)
        assert response.status_code == 403
  
    @pytest.mark.django_db
    def test_employee_get_self_tasks_only(self, employer_and_employees, employee_1_token):
        # factory tasks for the other employee
        employee_2 = employer_and_employees["employee_2"]
        other_employee_task = TaskFactory(
            assignee=employee_2,
            status=Task.STATUS_PENDING
        )
        
        # factory tasks for this employee
        employee_1 = employer_and_employees["employee_1"]
        own_task = TaskFactory(
            assignee=employee_1,
            status=Task.STATUS_PENDING
        )
        
        # assert get only this employee tasks
        response = api_list_tasks(employee_1_token.value)
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["id"] == own_task.id
        assert response.data[0]["assignee"] == employee_1.id
  
    @pytest.mark.django_db
    def test_employee_update_task_success(self, employer_and_employees, employee_1_token):
        employee_1 = employer_and_employees["employee_1"]
        own_task = TaskFactory(
            assignee=employee_1,
            status=Task.STATUS_IN_PROGRESS
        )
        
        # request an update for the task changing to COMPLETED
        update_data = {
            "status": Task.STATUS_COMPLETED
        }
        response = api_update_task(employee_1_token.value, own_task.id, update_data)
        
        # assert 200 OK
        assert response.status_code == 200
        assert response.data["status"] == Task.STATUS_COMPLETED
  
    @pytest.mark.django_db
    def test_employee_update_fail_change_date_due(self, employer_and_employees, employee_1_token):
        # factory an user and task
        employee_1 = employer_and_employees["employee_1"]
        own_task = TaskFactory(
            assignee=employee_1,
            status=Task.STATUS_IN_PROGRESS,
            date_due=timezone.now() + datetime.timedelta(days=5)
        )
        
        # attempt to update date_due
        update_data = {
            "date_due": timezone.now() + datetime.timedelta(days=10)
        }
        response = api_update_task(employee_1_token.value, own_task.id, update_data)
        
        assert response.status_code == 403
  
    @pytest.mark.django_db
    def test_employee_cannot_update_other_employee_task(self, employer_and_employees, employee_1_token):
        other_employee_task = TaskFactory(
            assignee=employer_and_employees["employee_2"],
            status=Task.STATUS_IN_PROGRESS
        )
        
        
        update_data = {
            "status": Task.STATUS_COMPLETED
        }
        response = api_update_task(employee_1_token.value, other_employee_task.id, update_data)
        task_in_db = Task.objects.get(id=other_employee_task.id)
        assert task_in_db is not None
        assert task_in_db.id == other_employee_task.id
        assert task_in_db.assignee == employer_and_employees["employee_2"]
        assert response.status_code == 404

    @pytest.mark.django_db
    def test_employee_cannot_get_other_employee_task(self, employer_and_employees, employee_1_token):
        # Create a task assigned to employee 2
        other_employee_task = TaskFactory(
            assignee=employer_and_employees["employee_2"],
            status=Task.STATUS_PENDING
        )
        
        response = api_get_task(employee_1_token.value, other_employee_task.id)
        task_in_db = Task.objects.get(id=other_employee_task.id)
        assert task_in_db is not None
        assert task_in_db.id == other_employee_task.id
        assert task_in_db.assignee == employer_and_employees["employee_2"]
        assert response.status_code == 404

    @pytest.mark.django_db
    def test_employee_filter_own_tasks_by_status(self, employer_and_employees, employee_1_token):
        employee_1 = employer_and_employees["employee_1"]
        TaskFactory(
            assignee=employee_1,
            status=Task.STATUS_PENDING
        )
        TaskFactory(
            assignee=employee_1,
            status=Task.STATUS_PENDING
        )
        TaskFactory(
            assignee=employee_1,
            status=Task.STATUS_COMPLETED
        )
        
        # Create a task for employee 2 with PENDING status (should not be returned)
        TaskFactory(
            assignee=employer_and_employees["employee_2"],
            status=Task.STATUS_PENDING
        )
        
        # Get filtered tasks
        response = api_list_tasks(
            employee_1_token.value,
            {"status": Task.STATUS_PENDING}
        )
        
        # Assert correct filtering
        assert response.status_code == 200
        assert len(response.data) == 2
        for task in response.data:
            assert task["status"] == Task.STATUS_PENDING
            assert task["assignee"] == employee_1.id

    # EMPLOYER
    @pytest.mark.django_db
    def test_employer_get_list_all_employees_tasks_summary(
        self, employer_and_employees, employer_token
    ):
        employee_1 = employer_and_employees["employee_1"]
        employee_2 = employer_and_employees["employee_2"]

        TaskFactory(assignee=employee_1, status=Task.STATUS_PENDING)
        TaskFactory(assignee=employee_1, status=Task.STATUS_PENDING)
        TaskFactory(assignee=employee_1, status=Task.STATUS_COMPLETED)

        TaskFactory(assignee=employee_2, status=Task.STATUS_PENDING)
        TaskFactory(assignee=employee_2, status=Task.STATUS_COMPLETED)
        TaskFactory(assignee=employee_2, status=Task.STATUS_COMPLETED)

        response = api_client(employer_token.value).get("/api/user/employee-summary/")
        assert response.status_code == 200
        data = response.data

        # Find employee_1 and employee_2 summary
        summary_1 = next(
            (item for item in data if item["employee_email"] == employee_1.email), None
        )
        summary_2 = next(
            (item for item in data if item["employee_email"] == employee_2.email), None
        )
        assert summary_1 is not None
        assert summary_2 is not None
        assert summary_1["no_task_total"] == 3
        assert summary_1["no_task_completed"] == 1
        assert summary_2["no_task_total"] == 3
        assert summary_2["no_task_completed"] == 2
