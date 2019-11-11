from sense_hat import SenseHat
sense = SenseHat()
import json
import time

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

sense.clear()


cred = credentials.Certificate('private_key/private_key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://character-generator-4d751.firebaseio.com/'
})

i = 0
on = [130, 30, 100]
off = [0, 0, 0]

ref = db.reference().child('characters')
snapshot = ref.get()

def listener(event):
    # print(event.data)
    loopval = event.data

db.reference('/loopstatus').listen(listener)
sense.clear()

while True:
  loopstatus = db.reference('loopstatus')
  loopval = loopstatus.get()
  print(loopval)
  if loopval:
    print('if statement: ' + str(loopval))
    for id in snapshot:
        char = snapshot.get(id)
        pixel_array = []
        for pixel in char:      
          if pixel == True:
            pixel_array.append(on)
          else:
            pixel_array.append(off)
        sense.set_pixels(pixel_array)
        time.sleep(1)
  else:
    print('Else statement: ' + str(loopval))
    sense.clear()
    time.sleep(2)
  
