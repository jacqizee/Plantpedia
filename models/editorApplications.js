import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

// Comment Schema
export const editorApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true, maxlength: 50 },
  lastName: { type: String, required: true, maxlength: 50 },
  text: { type: String, required: true, maxlength: 1000 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  username: { type: String, ref: 'User', required: true },
  
}, {
  timestamps: true
})

editorApplicationSchema.plugin(mongooseUniqueValidator)
export const EditorApplication = mongoose.model('EditorApplication', editorApplicationSchema)