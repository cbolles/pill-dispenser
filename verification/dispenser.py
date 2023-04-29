import serial
import time


class Dispenser:
    def __init__(self, port):
        self.serial = serial.Serial(port, 9600)

        # After serial communication starts with the Arduino, the Arduino
        # will reset. This wait is to give time for the Arduino to reset before
        # issuing any commands
        time.sleep(5)

    def select_pill(self, number: int) -> None:
        print('Selecting: {}'.format(number))
        select_cmd = f'{number}\n'.encode('utf-8')
        self.serial.write(select_cmd)
        self.wait_for_ack()

    def dispense(self) -> None:
        print('Dispensing')
        self.serial.write(b'5\n')
        self.wait_for_ack()

    def wait_for_ack(self) -> None:
        line = self.serial.readline().strip()
        if line != b'ack':
            raise Exception('Unexpected result from dispenser')
        return

    def close(self):
        self.serial.close()
