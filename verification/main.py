from dotenv import load_dotenv
from database import Perscription, PillClient
import os
from dispenser import Dispenser


PILL_MAPPING = {
    'Advil': 1,
    'Tylenol': 2,
    'Claritin': 3,
    'Zyrtec': 4
}


def verify_pill(pill: Perscription):
    pass


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

    # Make the serial client
    dispenser = Dispenser()

    # Enter loop to distribute the pills
    for pill in pills:
        # Select the pill
        dispenser.select_pill(PILL_MAPPING[pill.name])

        # Ensure the correct pill is selected
        verify_pill(pill)

        # Dispense the pill
        dispenser.dispense()



if __name__ == '__main__':
    main()
