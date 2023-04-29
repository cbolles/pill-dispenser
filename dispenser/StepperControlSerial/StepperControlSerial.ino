#include <AccelStepper.h>

// Pin definitions
const int button1 = 2;
const int button2 = 3;
const int button3 = 4;
const int button4 = 5;

//Carousel
const int caroDirPin = 7;
const int caroStepPin = 6;
//Lever
const int leverDirPin = 9;
const int leverStepPin = 9;

const int stepsPerRevolution = 200;

//Serial connection
int recValue;

// Stepper motor setup
AccelStepper carostep(AccelStepper::DRIVER, caroStepPin, caroDirPin);
//AccelStepper leverstep(AccelStepper::DRIVER, leverStepPin, leverDirPin);

void setup() {
  Serial.begin(9600);
  pinMode(button1, INPUT_PULLUP);
  pinMode(button2, INPUT_PULLUP);
  pinMode(button3, INPUT_PULLUP);
  pinMode(button4, INPUT_PULLUP);

  carostep.setMaxSpeed(500); //changed from 60
  carostep.setAcceleration(100); //changed from 200

/*
  leverstep.setMaxSpeed(600);
  leverstep.setAcceleration(300);
  */
}

void loop() {
  //checkButtonSendInfo();

  if (Serial.available() > 0) 
  {
    Serial.println("ack"); //ACKNOWLEDGE
    recValue=Serial.read();
    if (recValue == 05) //DISPENSE
    {
      if (recValue == 04) //PILL 4
      {
        Serial.begin(38400);
            carostep.moveTo(stepsPerRevolution * 0.25);
        while (carostep.distanceToGo() != 0) {
          carostep.run();
        }
        delay(2000);
        carostep.moveTo(0);
      }
      else if (recValue == 03) //PILL 3
      {
        Serial.begin(38400);
          carostep.moveTo(stepsPerRevolution * 0.50);
        while (carostep.distanceToGo() != 0) {
          carostep.run();
        }
      delay(2000);
      carostep.moveTo(0);
      } 
      else if (recValue == 02) //PILL 2
      { //PILL 2
      Serial.begin(38400);
        carostep.moveTo(stepsPerRevolution * -0.25);
      while (carostep.distanceToGo() != 0) {
        carostep.run();
      }
      delay(2000);
      carostep.moveTo(0);
      } 
      else if (recValue == 01) //PILL 1
      { //PILL 1
      // Stays in initial position
      }
      while (carostep.distanceToGo() != 0) {
      carostep.run();
      }
    }
  }
}

// Send button presses to external database-querying program
/*
void checkButtonSendInfo() {
  if (digitalRead(button1) == HIGH) {
    Serial.println(4);
  }
  else if (digitalRead(button2) == HIGH) {
    Serial.println(3);
  }
  else if(digitalRed(button3) == HIGH) {
    Serial.println(2);

  }
  else if(digitalRead(button4) == HIGH) {
    Serial.println(2);
  }
}
*/

