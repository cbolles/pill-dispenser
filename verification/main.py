from dotenv import load_dotenv
from database import PillClient
import os


def main():
    # Load information from environment file
    load_dotenv()

    # Create pill client
    pill_client = PillClient(os.environ.get('PILL_URL'))

    # Authenticate the client
    username = os.environ.get('PILL_USERNAME')
    password = os.environ.get('PILL_PASSWORD')
    pill_client.authenticate(username, password)

    # Get the pills that the user takes
    pills = pill_client.get_prescriptions()

    # Do something with the pills
    print(pills)

    # Enter loop to distribute the pills


if __name__ == '__main__':
    main()
