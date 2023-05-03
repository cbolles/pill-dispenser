//Motor Control through serial script
#include <AccelStepper.h>

// LED Definitions

const int redLed = 11;
const int greenLed = 10;

//Carousel
const int caroDirPin = 7;
const int caroStepPin = 6;
//Lever
//const int leverDirPin = 9;
//const int leverStepPin = 8;

const int stepsPerRevolution = 200;

//Serial connection
int recValue;

// Stepper motor setup
AccelStepper carostep(AccelStepper::DRIVER, caroStepPin, caroDirPin);
//AccelStepper leverstep(AccelStepper::DRIVER, leverStepPin, leverDirPin);

void setup() {
  Serial.begin(9600);

  carostep.setMaxSpeed(300); //changed from 60
  carostep.setAcceleration(60); //changed from 200

  //leverstep.setMaxSpeed(1000);  
  //leverstep.setAcceleration(500);

  pinMode(redLed, OUTPUT);
  pinMode(greenLed, OUTPUT);

  digitalWrite(redLed, HIGH);
  //digitalWrite(greenLed, LOW);
}

void blinkGreenLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(greenLed, HIGH);
    delay(500);
    digitalWrite(greenLed, LOW);
    delay(500);
  }
}

void loop() {
  if (Serial.available() > 0) 
  {
    recValue=Serial.read();
    digitalWrite(redLed, HIGH);
    {
      switch (recValue) {

        case '5':
          //leverstep.moveTo(-50); // Move 30 steps instead of stepsPerRevolution * 0.5
          //while (leverstep.distanceToGo() != 0) {
          //  leverstep.run();
          //}
          //delay(10);
          //leverstep.moveTo(0);
          //while (leverstep.distanceToGo() != 0) {
          //  leverstep.run();
          //}
          delay(4000);
          carostep.moveTo(0);
          blinkGreenLED(3); 
          digitalWrite(redLed, HIGH);
          Serial.println("ack");
          break;



      //PILL 4
        case '4':
          digitalWrite(redLed, LOW);
          carostep.moveTo(stepsPerRevolution * 0.25);
        while (carostep.distanceToGo() != 0) {
          carostep.run();
        }
        delay(1000);
        Serial.println("ack");
        break;

      //PILL 3
        case '3': 
          digitalWrite(redLed, LOW);
          carostep.moveTo(stepsPerRevolution * 0.50);
        while (carostep.distanceToGo() != 0) {
          carostep.run();
        }
        delay(1000);
        Serial.println("ack");
        break;

      //PILL 2
        case '2':
          digitalWrite(redLed, LOW);
          carostep.moveTo(stepsPerRevolution * -0.25); //changed from -0.25
        while (carostep.distanceToGo() != 0) {
          carostep.run();
        }
        delay(1000);
        Serial.println("ack");
        break;

      //PILL 1
      case '1':
        digitalWrite(redLed, LOW);
        delay(1000);
        Serial.println("ack");
        break;
      }

      while (carostep.distanceToGo() != 0) {
      carostep.run();
      }  
    }
  }
}
