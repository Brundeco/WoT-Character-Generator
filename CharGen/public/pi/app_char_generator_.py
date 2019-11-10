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
on = [130, 30, 100]
off = [0, 0, 0]
pixel_array = []
char_key_array = []
# key = '-LtK-Bk156abpROmhxgI'
# key = '-LtAeqwVoMgawFmIKhAs'
key = '-LtAJD2oO4_Dmyya-aML'

ref = db.reference('characters')
# print(ref)
snapshot = ref.get()
# print(snapshot)

for key in snapshot:
    character_key = "{}".format(key)
    value = snapshot[key]
    char_key_array.append(character_key)
    
char_ref = db.reference('characters/{}' + str.format(char_key_array[3]))
print(char_ref)
char_snapshot = char_ref.get()
print(char_snapshot)


# while i < len(snapshot):
#     # print(snapshot[i])
#     if snapshot[i] == True:
#         pixel_array.append(on)
#     elif snapshot[i] == False:
#         pixel_array.append(off)
#     else:
#         pass
#     i += 1
    
# sense.set_pixels(pixel_array)
