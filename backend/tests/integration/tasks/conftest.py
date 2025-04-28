import pytest
from tests.factories import UserFactory
from tests.utils import get_user_auth_headers

@pytest.fixture
def employer_and_employees(db):
    password = 'password_any'
    employer = UserFactory(is_employer=True, password=password)
    employee_1 = UserFactory(is_employer=False, password=password)
    employee_2 = UserFactory(is_employer=False, password=password)
    return {
        'employer': employer, 
        'employee_1': employee_1,
        'employee_2': employee_2
    }

@pytest.fixture
def employer_token(employer_and_employees):
    employer = employer_and_employees['employer']
    password = 'password_any'
    return get_user_auth_headers(employer.email, password)

@pytest.fixture
def employee_1_token(employer_and_employees):
    employee_1 = employer_and_employees['employee_1']
    password = 'password_any'
    return get_user_auth_headers(employee_1.email, password)

@pytest.fixture
def employee_2_token(employer_and_employees):
    employee_2 = employer_and_employees['employee_2']
    password = 'password_any'
    return get_user_auth_headers(employee_2.email, password)


