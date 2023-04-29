from dataclasses import dataclass
from typing import List
import requests

@dataclass
class Perscription:
    _id: str
    name: str


class PillClient:
    """
    Client for communicating with the pill datastore backend
    """
    def __init__(self, url):
        self.url = url
        self.token = ''

    def authenticate(self, username, password) -> None:
        """
        Authenticate the user and store the JWT
        """
        # Construct GraphQL request
        mutation = '''
            mutation login($credentials: UserLogin!) {
                login(credentials: $credentials)
            }
        '''
        credentials = { 'username': username, 'password': password }
        json = {
            'query': mutation,
            'variables': {
                'credentials': credentials
            }
        }

        # Make request and pull out JWT
        response = requests.post(self.url, json=json)
        if response.status_code != 200:
            raise Exception('Failed to authenticate')
        self.token = response.json()['data']['login']

    def get_prescriptions(self) -> List[Perscription]:
        """
        Get the prescriptions for the authenticated user
        """
        # Construct GraphQL request
        query = '''
            query prescriptionsForUser {
                prescriptionsForUser {
                    _id,
                    name
                }
            }
        '''
        json = {
            'query': query
        }
        headers = {
            'Authorization': f'Bearer {self.token}'
        }

        # Make request
        response = requests.post(self.url, json=json, headers=headers)
        if response.status_code != 200:
            raise Exception('Failed to get pills')

        # Pull the data from the request
        pills = []
        for pill in response.json()['data']['prescriptionsForUser']:
            pills.append(Perscription(pill['_id'], pill['name']))
        return pills

