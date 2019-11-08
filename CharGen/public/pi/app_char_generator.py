from sense_hat import SenseHat
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
sense = SenseHat()

cred = credentials.Certificate('private_key/private_key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://character-generator-4d751.firebaseio.com/'
})

i = 0
on = [255, 0, 0]
off = [0, 0, 0]
pixel_array = []
key_array = []
key = '-LtA93jCQn-2Kmf4gP-S'

ref = db.reference('characters/{}'.format(key))
snapshot = ref.get()

for key in snapshot:
        # value = snapshot[key]
        character_key = "{}".format(key)
        key_array.append(character_key)
        
# char_ref = db.reference('characters/{}'.format(key))
# print(char_ref)

while i < len(snapshot):
    # print(snapshot[i])
    if snapshot[i] == True:
        pixel_array.append(on)
    elif snapshot[i] == False:
        pixel_array.append(off)
    else:
        pass
    i += 1
    
sense.set_pixels(pixel_array)

# ref = db.reference('characters/{}'.format(i))

