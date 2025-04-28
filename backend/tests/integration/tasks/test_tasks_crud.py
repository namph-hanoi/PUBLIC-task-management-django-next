from devtools.debug import chill
import pytest
from unittest import TestCase

from tests.factories import TaskFactory, UserFactory
from tasks.models import Task
from django.utils import timezone
import datetime

from tests.utils import api_list_tasks


@pytest.mark.integration
class TestTaskCrud:
    @classmethod
    def setUpTestData(cls):
        pass

    @pytest.fixture
    def setup_for_get_task_list(self, employer_and_employees, employer_token):
        """Create a set of tasks with different statuses, assignees and dates for testing list operations"""
        employer = employer_and_employees["employer"]
        employee_1 = employer_and_employees["employee_1"]
        employee_2 = employer_and_employees["employee_2"]
        tasks_employee_1 = [
            TaskFactory(
                assignee=employee_1,
                status=Task.STATUS_PENDING,
                date_creation=timezone.now() - datetime.timedelta(days=5),
                date_due=timezone.now() + datetime.timedelta(days=6),
            ),
            TaskFactory(
                assignee=employee_1,
                status=Task.STATUS_IN_PROGRESS,
                date_creation=timezone.now() - datetime.timedelta(days=3),
                date_due=timezone.now() + datetime.timedelta(days=4),
            ),
            TaskFactory(
                assignee=employee_1,
                status=Task.STATUS_COMPLETED,
                date_creation=timezone.now() - datetime.timedelta(days=1),
                date_due=timezone.now() + datetime.timedelta(days=2),
            ),
        ]
        tasks_employee_2 = [
            TaskFactory(
                assignee=employee_2,
                status=Task.STATUS_PENDING,
                date_creation=timezone.now() - datetime.timedelta(days=4),
                date_due=timezone.now() + datetime.timedelta(days=5),
            ),
            TaskFactory(
                assignee=employee_2,
                status=Task.STATUS_IN_PROGRESS,
                date_creation=timezone.now() - datetime.timedelta(days=2),
                date_due=timezone.now() + datetime.timedelta(days=3),
            ),
            TaskFactory(
                assignee=employee_2,
                status=Task.STATUS_COMPLETED,
                date_creation=timezone.now(),
                date_due=timezone.now() + datetime.timedelta(days=1),
            ),
        ]
        # Create tasks with different statuses
        tasks_all = [
            *tasks_employee_1,
            *tasks_employee_2,
        ]
        return {
            "employer": employer,
            "employee_1": employee_1,
            "employee_2": employee_2,
            "employer_token": employer_token.value,
            "tasks_all": tasks_all,
            "tasks_employee_1": tasks_employee_1,
            "tasks_employee_2": tasks_employee_2,
        }

    @pytest.mark.django_db
    def test_task_create_success(self, *args, **kwargs):
        pass

    @pytest.mark.django_db
    def test_task_create_fail_missing_title(self, *args, **kwargs):
        pass

    @pytest.mark.django_db
    def test_task_create_fail_missing_assignee(self, *args, **kwargs):
        pass

    @pytest.mark.django_db
    def test_task_create_fail_assignee_not_exist(self, *args, **kwargs):
        pass

    @pytest.mark.django_db
    def test_get_task_by_id(self, *args, **kwargs):
        pass

    @pytest.mark.django_db
    def test_update_task_success(self, *args, **kwargs):
        # factory employees A and B
        # factory a task assigned to employee A
        # request an update for the task changing to employee B
        pass

    @pytest.mark.django_db
    def test_update_task_fail_missing_title(self, *args, **kwargs):
        pass

    @pytest.mark.django_db
    def test_update_task_fail_missing_assignee(self, *args, **kwargs):
        pass

    @pytest.mark.django_db
    def test_get_task_list_all(self, setup_for_get_task_list, *args, **kwargs):
        api_response = api_list_tasks(setup_for_get_task_list["employer_token"])
        assert len(api_response.data) == len(setup_for_get_task_list["tasks_all"])
        found_task = False
        for task in setup_for_get_task_list["tasks_all"]:
            for response_task in api_response.data:
                if task.id == response_task["id"]:
                    found_task = True
                    break
            if found_task:
                break
        assert found_task, "None of the tasks from setup found in API response"

    @pytest.mark.django_db
    def test_get_task_list_filtered_by_assignee(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        pass

    @pytest.mark.django_db
    def test_get_task_list_filtered_by_status(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        pass

    @pytest.mark.django_db
    def test_get_task_list_filtered_by_assignee_with_status(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        pass

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_date_creation(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        pass

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_date_due(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        pass

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_status_ascendant(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        pass

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_status_descendant(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        pass
