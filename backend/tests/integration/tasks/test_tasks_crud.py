import pytest
from unittest import TestCase


@pytest.mark.integration
class TestUserLoginAPI(TestCase):
  @classmethod
  def setUpTestData(cls):
    pass
  
  @pytest.mark.django_db
  def test_task_create_success(self):
    pass
  
  @pytest.mark.django_db
  def test_task_create_fail_missing_title(self):
    pass
  
  @pytest.mark.django_db
  def test_task_create_fail_missing_assignee(self):
    pass
  
  @pytest.mark.django_db
  def test_get_task_by_id(self):
    pass
  
  @pytest.mark.django_db
  def test_update_task_success(self):
    pass
  
    
  @pytest.mark.django_db
  def test_update_task_fail_missing_title(self):
    pass
  
  @pytest.mark.django_db
  def test_update_task_fail_missing_assignee(self):
    pass

  @pytest.mark.django_db
  def test_get_task_list_all(self):
    pass
  
  @pytest.mark.django_db
  def test_get_task_list_filtered_by_assignee(self):
    pass

  @pytest.mark.django_db
  def test_get_task_list_filtered_by_status(self):
    pass
  
  @pytest.mark.django_db
  def test_get_task_list_filtered_by_assignee_with_status(self):
    pass
  
  @pytest.mark.django_db
  def test_get_task_list_sorted_by_date_creation(self):
    pass
  
  @pytest.mark.django_db
  def test_get_task_list_sorted_by_date_due(self):
    pass
  
  @pytest.mark.django_db
  def test_get_task_list_sorted_by_status_ascendant(self):
    pass
  
  @pytest.mark.django_db
  def test_get_task_list_sorted_by_status_descendant(self):
    pass