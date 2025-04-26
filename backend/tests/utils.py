import json
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

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
