from dotenv import load_dotenv
from database import Perscription, PillClient
import os
from dispenser import Dispenser
import cv2
from tensorflow.lite.python.interpreter import Interpreter
import numpy as np
import sys
import random
import importlib.util
import matplotlib
import matplotlib.pyplot as plt


PILL_MAPPING = {
    'tylenol': 1,
    'lisinopril': 2,
    'lipitor': 3,
    'metformin': 4
}

def detect_pill():
  #Take picture of pill
  camera = cv2.VideoCapture(0)
  return_value, image = camera.read()
  image_path = 'D:/OpenCV/Images'
  cv2.imwrite(os.path.join(path,'pill.png'),image)

  #Load label map of pill names
  label_map_path = 'D:/home/labelmap.txt'
  with open(label_map_path, 'r') as f:
      labels = [line.strip() for line in f.readlines()]
  
  # Load the Tensorflow Lite model into memory
  modelpath = 'D:/home/detect.tflite'
  interpreter = Interpreter(model_path=modelpath)
  interpreter.allocate_tensors()

  #Get model details
  input_details = interpreter.get_input_details()
  output_details = interpreter.get_output_details()
  height = input_details[0]['shape'][1]
  width = input_details[0]['shape'][2]

  float_input = (input_details[0]['dtype'] == np.float32)

  input_mean = 127.5
  input_std = 127.5

  # Load image and resize to expected shape [1xHxWx3]
  image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
  imH, imW, _ = image.shape 
  image_resized = cv2.resize(image_rgb, (width, height))
  input_data = np.expand_dims(image_resized, axis=0)

  # Perform the actual detection by running the model with the image as input
  interpreter.set_tensor(input_details[0]['index'],input_data)
  interpreter.invoke()

  # Retrieve detection results
  boxes = interpreter.get_tensor(output_details[1]['index'])[0] # Bounding box coordinates of detected objects
  classes = interpreter.get_tensor(output_details[3]['index'])[0] # Class index of detected objects
  scores = interpreter.get_tensor(output_details[0]['index'])[0] # Confidence of detected objects


  # Loop over all detections and draw detection box if confidence is above minimum threshold
  for i in range(len(scores)):
    if ((scores[i] > min_conf) and (scores[i] <= 1.0)):

      # Get bounding box coordinates and draw box
      # Interpreter can return coordinates that are outside of image dimensions, need to force them to be within image using max() and min()
      ymin = int(max(1,(boxes[i][0] * imH)))
      xmin = int(max(1,(boxes[i][1] * imW)))
      ymax = int(min(imH,(boxes[i][2] * imH)))
      xmax = int(min(imW,(boxes[i][3] * imW)))
              
      cv2.rectangle(image, (xmin,ymin), (xmax,ymax), (10, 255, 0), 2)

      #Identify object name
      object_name = labels[int(classes[i])]

    return object_name

def verify_pill(pill: Perscription):
  object_name = detect_pill()

  if pill == object_name:
    return 1
  else:
    return 0

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
    dispenser = Dispenser(os.environ.get('DISPENSER_PORT'))

    # Enter loop to distribute the pills
    for pill in pills:
        # Select the pill
        dispenser.select_pill(PILL_MAPPING[pill.name])

        # Ensure the correct pill is selected
        if verify_pill(pill) == 1:
          # Dispense the pill
          dispenser.dispense()
        else:
          print("Incorrect pill identified!")
          print("Pill will not be dispensed!")
          continue

        

if __name__ == '__main__':
    main()