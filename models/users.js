import mongoose from 'mongoose'
import bcrypt from 'bcrypt' 
import mongooseUniqueValidator from 'mongoose-unique-validator'


// Creating the User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: 'https://cdn-icons.flaticon.com/png/512/1892/premium/1892747.png?token=exp=1653386773~hmac=e3ec0d75990d990942172d99babe5ff9'},
  favorites: [],
  myEdits: [],
  bio: { type: String, maxlength: 300, default: 'Hi! My favorite plants are: ' },
  canEdit: { type: Boolean, required: true, default: false },
  hasApplied: { type: Boolean, required: true, default: false }
}, { id: false })

// Adding in created plants as a virtual field
userSchema.virtual('createdPlants', {
  ref: 'Plant',
  localField: '_id',
  foreignField: 'owner'
})

// Adding in created comments as a virtual field
userSchema.virtual('createdComments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'owner'
})

// Removing the password from the json object when sending back to the user
userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, json) {
    delete json.password
    return json
  }
})

// Setting passwordConfirmation as a virtual field to be used once for validation but not saved
userSchema
  .virtual('passwordConfirmation') 
  .set(function (value) {
    this._passwordConfirmation = value
  })


// Checking the password matches the passwordConfirmation virtual field
userSchema
  .pre('validate', function (next) { 
    if (this.isModified('password') && this.password !== this._passwordConfirmation) { 
      this.invalidate('passwordConfirmation', 'does not match password field')
    }
    next()
  })

  // Making sure the email address provided is a real email address
  userSchema
  .pre('validate', function (next) { 
    if (this.isModified('email') && (this.email.indexOf('@') === -1 || this.email.indexOf('.') === -1)) { 
      this.invalidate('email', 'does not contain an email')
    }
    next()
  })


// Before we save the new validated data to the database, we want to hash the password
userSchema
  .pre('save', function (next) { 
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(12))
    }
    next()
  })

userSchema.methods.validatePassword = function (plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password)
}

userSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('User', userSchema)