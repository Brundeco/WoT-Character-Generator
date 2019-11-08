from sense_hat import SenseHat
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
sense = SenseHat()

cred = credentials.Certificate('private_key/private_key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://character-generator-4d751.firebaseio.com/'
})

ref = db.reference('characters')
snapshot = ref.get()

print(snapshot)