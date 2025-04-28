import pytest

from tests.factories import TaskFactory
from tasks.models import Task
from django.utils import timezone
import datetime

from tests.utils import api_create_task, api_get_task, api_list_tasks, api_update_task


@pytest.mark.integration
class TestTaskCrud:


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
    def test_task_create_success(self, setup_for_get_task_list, *args, **kwargs):
        assert_data = {
            "title": "Fantastic Task",
            "description": "Fantastic Task",
            "assignee": setup_for_get_task_list["employee_2"].id,
        }
        response_create = api_create_task(
            setup_for_get_task_list["employer_token"],
            assert_data,
        )
        task_id = response_create.data["id"]
        task = Task.objects.get(id=task_id)
        assert task.title == assert_data["title"]
        assert task.description == assert_data["description"]
        assert task.assignee_id == assert_data["assignee"]

    @pytest.mark.django_db
    def test_task_create_fail_missing_title(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        assert_data = {
            "description": "Fantastic Task",
            "assignee": setup_for_get_task_list["employee_2"].id,
        }
        response = api_create_task(
            setup_for_get_task_list["employer_token"],
            assert_data,
        )
        assert response.status_code == 400
        assert "title" in response.data
        assert response.data["title"]

    @pytest.mark.django_db
    def test_task_create_fail_missing_assignee(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        assert_data = {
            "title": "Fantastic Task",
        }
        response = api_create_task(
            setup_for_get_task_list["employer_token"],
            assert_data,
        )
        assert response.status_code == 400
        assert "assignee" in response.data
        assert response.data["assignee"]

    @pytest.mark.django_db
    def test_task_create_fail_assignee_not_exist(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        assert_data = {"title": "Fantastic Task", "assignee": 10}
        response = api_create_task(
            setup_for_get_task_list["employer_token"],
            assert_data,
        )
        assert response.status_code == 400
        assert "assignee" in response.data
        assert (
            "Invalid pk" in response.data["assignee"][0]
            and "object does not exist" in response.data["assignee"][0]
        )

    @pytest.mark.django_db
    def test_get_task_by_id(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        assertion_id = setup_for_get_task_list["tasks_employee_2"][1].id
        response = api_get_task(
            setup_for_get_task_list["employer_token"],
            assertion_id,
        )
        assert response.status_code == 200
        assert response.data["id"] == assertion_id
        assert response.data["assignee"] == setup_for_get_task_list["employee_2"].id
        assert response.data["status"] == setup_for_get_task_list["tasks_employee_2"][1].status

    @pytest.mark.django_db
    def test_update_task_success(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        assertion_task = setup_for_get_task_list["tasks_employee_2"][1]
        response = api_update_task(
            setup_for_get_task_list["employer_token"],
            assertion_task.id,
            data={
                "title": "Updated Task",
                "description": "Updated Task",
                "assignee": setup_for_get_task_list["employee_1"].id,
                "status": Task.STATUS_COMPLETED,
            },
        )
        assert response.status_code == 200
        assert response.data["id"] == assertion_task.id
        assert response.data["assignee"] != setup_for_get_task_list["employee_2"].id
        assert response.data["status"] != setup_for_get_task_list["tasks_employee_2"][1].status
        assert response.data["description"] == "Updated Task"

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
        api_response = api_list_tasks(
            setup_for_get_task_list["employer_token"],
            {"assignee": setup_for_get_task_list["employee_1"].id},
        )
        assert len(api_response.data) == len(
            setup_for_get_task_list["tasks_employee_1"]
        )
        found_task = False
        for task in setup_for_get_task_list["tasks_employee_1"]:
            for response_task in api_response.data:
                if task.id == response_task["id"]:
                    found_task = True
                    break
            if found_task:
                break
        assert found_task, "None of the tasks from setup found in API response"

    @pytest.mark.django_db
    def test_get_task_list_filtered_by_status(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        status = Task.STATUS_CHOICES[0][0]
        api_response = api_list_tasks(
            setup_for_get_task_list["employer_token"], {"status": status}
        )
        assert len(api_response.data) == 2
        found_task = False
        for task in setup_for_get_task_list["tasks_employee_1"]:
            for response_task in api_response.data:
                if task.id == response_task["id"]:
                    found_task = True
                    break
            if found_task:
                break
        # Verify all returned tasks have the correct status
        for response_task in api_response.data:
            assert (
                response_task["status"] == status
            ), f"Task {response_task['id']} has wrong status: {response_task['status']}"
        assert found_task, "None of the tasks from setup found in API response"

    @pytest.mark.django_db
    def test_get_task_list_filtered_by_assignee_with_status(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        status = Task.STATUS_CHOICES[1][0]
        api_response = api_list_tasks(
            setup_for_get_task_list["employer_token"],
            {
                "status": status,
                "assignee": setup_for_get_task_list["employee_1"].id,
            },
        )
        assert len(api_response.data) == 1
        assert api_response.data[0]["status"] == status
        assert (
            api_response.data[0]["assignee"] == setup_for_get_task_list["employee_1"].id
        )

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_date_creation(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        api_response = api_list_tasks(
            setup_for_get_task_list["employer_token"],
            {
                "ordering": "-date_creation",
                "assignee": setup_for_get_task_list["employee_1"].id,
            },
        )
        assert len(api_response.data) == len(
            setup_for_get_task_list["tasks_employee_1"]
        )
        # now in reverse order
        assert (
            setup_for_get_task_list["tasks_employee_1"][2].id
            == api_response.data[0]["id"]
        )
        assert (
            setup_for_get_task_list["tasks_employee_1"][0].id
            == api_response.data[2]["id"]
        )

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_date_due(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        api_response = api_list_tasks(
            setup_for_get_task_list["employer_token"],
            {
                "ordering": "-date_due",
                "assignee": setup_for_get_task_list["employee_1"].id,
            },
        )
        assert len(api_response.data) == len(
            setup_for_get_task_list["tasks_employee_1"]
        )
        # in the correct order due to the `timezone.now() + ` in the Factories
        assert (
            setup_for_get_task_list["tasks_employee_1"][0].id
            == api_response.data[0]["id"]
        )
        assert (
            setup_for_get_task_list["tasks_employee_1"][2].id
            == api_response.data[2]["id"]
        )

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_status_ascendant(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        api_response = api_list_tasks(
            setup_for_get_task_list["employer_token"],
            {
                "ordering": "status",
            },
        )
        assert api_response.data[0]["status"] == Task.STATUS_IN_PROGRESS
        assert api_response.data[1]["status"] == Task.STATUS_IN_PROGRESS
        assert api_response.data[2]["status"] == Task.STATUS_COMPLETED
        assert api_response.data[3]["status"] == Task.STATUS_COMPLETED
        assert api_response.data[4]["status"] == Task.STATUS_PENDING
        assert api_response.data[5]["status"] == Task.STATUS_PENDING

    @pytest.mark.django_db
    def test_get_task_list_sorted_by_status_descendant(
        self, setup_for_get_task_list, *args, **kwargs
    ):
        api_response = api_list_tasks(
            setup_for_get_task_list["employer_token"],
            {
                "ordering": "-status",
            },
        )

        assert api_response.data[0]["status"] == Task.STATUS_PENDING
        assert api_response.data[1]["status"] == Task.STATUS_PENDING
        assert api_response.data[2]["status"] == Task.STATUS_COMPLETED
        assert api_response.data[3]["status"] == Task.STATUS_COMPLETED
        assert api_response.data[4]["status"] == Task.STATUS_IN_PROGRESS
        assert api_response.data[5]["status"] == Task.STATUS_IN_PROGRESS
