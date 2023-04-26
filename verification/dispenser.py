import serial


class Dispenser:
    def __init__(self, port):
        self.serial = serial.Serial(port)

    def select_pill(self, number: int) -> None:
        select_cmd = f'select: {number}\n'
        self.serial.write(select_cmd)
        self.wait_for_ack()

    def dispense(self) -> None:
        self.serial.write('dispense\n')
        self.wait_for_ack()

    def wait_for_ack(self) -> None:
        line = self.serial.readline().strip()
        if line != 'ack':
            raise Exception('Unexpected result from dispenser')
        return

    def close(self):
        self.serial.close()
