import mongoose from 'mongoose'
import bcrypt from 'bcrypt' 
import mongooseUniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: {type: String, default: 'https://png.pngtree.com/element_our/20190531/ourlarge/pngtree-cartoon-square-green-vine-image_1316677.jpg'}
}, { id: false })



userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, json) {

    delete json.password
    return json
  }
})


userSchema
  .virtual('passwordConfirmation') 
  .set(function (value) {
    this._passwordConfirmation = value
  })

// ? Custom Pre Validation
// Checking the password matches the passwordConfirmation virtual field
userSchema
  .pre('validate', function (next) { 
    if (this.isModified('password') && this.password !== this._passwordConfirmation) {
      
      this.invalidate('passwordConfirmation', 'does not match password field')
    }

    
    next()
  })


// ? Custom Pre Save
// Before we save the new validated data to the database, we want to has the password
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