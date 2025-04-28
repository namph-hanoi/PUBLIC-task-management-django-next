import json
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.test import APIClient


class BaseAPITestCase(APITestCase):
    """Base API test class with common assertions."""
    
    def assertSuccessResponse(self, response, status_code=status.HTTP_200_OK):
        """Assert the response is successful."""
        self.assertEqual(response.status_code, status_code)
        
    def assertErrorResponse(self, response, status_code=status.HTTP_400_BAD_REQUEST):
        """Assert the response is an error."""
        self.assertEqual(response.status_code, status_code)
        self.assertIn('error', response.data or {})
        
    def get_url(self, viewname, **kwargs):
        """Get the URL for a viewname."""
        return reverse(viewname, kwargs=kwargs)
    
    def get_response_data(self, response):
        """Get the response data, handling both JSON and Python content."""
        if hasattr(response, 'data'):
            return response.data
        return json.loads(response.content)


def get_user_auth_headers(email, password):
    client = APIClient()
    _response = client.post('/api/user/login/', {'email': email, 'password': password}, format='json')
    token = client.cookies.get('auth')
    return token

def api_create_task(token: str, data: dict):
    client = APIClient()
    client.cookies['auth'] = token
    return client.post('/api/task/', data, format='json')

def api_get_task(token: str, task_id: int):
    client = APIClient()
    client.cookies['auth'] = token
    return client.get(f'/api/task/{task_id}/', format='json')

def api_update_task(token: str, task_id: int, data: dict):
    client = APIClient()
    client.cookies['auth'] = token
    return client.patch(f'/api/task/{task_id}/', data, format='json')

def api_list_tasks(token: str, params: dict = None):
    client = APIClient()
    client.cookies['auth'] = token
    return client.get('/api/task/', params, format='json')

def api_task_item_action(token: str, task_id: int, data: dict = None, method: str = 'get'):
    client = APIClient()
    client.cookies['auth'] = token
    url = f'/api/task/{task_id}/task-item/'
    if method == 'get':
        return client.get(url, data, format='json')
    elif method == 'post':
        return client.post(url, data, format='json')
    elif method == 'put':
        return client.put(url, data, format='json')
    elif method == 'patch':
        return client.patch(url, data, format='json')
    elif method == 'delete':
        return client.delete(url, data, format='json')
    else:
        raise ValueError('Unsupported HTTP method')
