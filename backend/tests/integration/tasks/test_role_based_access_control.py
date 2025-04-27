import pytest
from unittest import TestCase


@pytest.mark.integration
class TestTaskRBAC(TestCase):
  @classmethod
  def setUpTestData(cls):
    pass
  
  # EMPLOYEE
  @pytest.mark.django_db
  def test_employee_can_not_create_task(self):
    # assert 403 FORBIDDEN on the route of task creation
    pass
  
  @pytest.mark.django_db
  def test_employee_get_self_tasks_only(self):
    # factory tasks for the other employee
    # factory tasks for the this employee
    # assert get only this employee tasks
    pass
  
  @pytest.mark.django_db
  def test_employee_update_task_success(self):
    # factory an user
    # factory a task owned by this user status IN_PROGRESS
    # request an update for the task changing to COMPLETED
    # assert 200 OK
    pass
  
  @pytest.mark.django_db
  def test_employee_update_fail_change_date_due(self):
    # factory an user
    # factory a task owned by this user status IN_PROGRESS
    # request an update for the task changing to COMPLETED
    # assert 200 OK
    pass
  
  @pytest.mark.django_db
  def test_employee_fail_get_list_of_employees(self):
    # factory employees A and B
    # request to get list of employees
    # assert 403 FORBIDDEN on the route of employees list
    pass


# EMPLOYER
  @pytest.mark.django_db
  def test_employer_get_list_all_employees(self):
    # factory employees A and B
    # factory tasks for employee A
    # factory tasks for employee B
    # assert get all employees
    pass
