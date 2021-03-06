import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'

// Comment Schema
export const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 350 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  username: { type: String, ref: 'User', required: true },
}, {
  timestamps: true,
  id: false
})

// Adding commenter profile picture as virtual field
commentSchema.virtual('image', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
})

commentSchema.set('toJSON', {
  virtuals: true,
})

commentSchema.plugin(mongooseUniqueValidator)
export const Comment = mongoose.model('Comment', commentSchema)