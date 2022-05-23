import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { commentSchema } from './comments.js'

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 35 },
  scientificName: { type: String, required: true, unique: true, maxLength: 50 },
  description: { type: String, required: true, maxLength: 500 },
  images: { type: String, required: true },
  watering: { type: String, enum: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly'], required: true },
  sunExposure: { type: String, enum: ['Full Sun', 'Partial Sun', 'Shade'], required: true },
  soilType: { type: String, enum: ['Loamy', 'Chalky', 'Peaty', 'Silty', 'Sandy', 'Clay'], required: true },
  flowerColor: { type: Array },
  mood: { type: String, enum: ['Mysterious', 'Cheerful', 'Emo', 'Bright', 'Classy'] },
  lifespan: { type: String, enum: ['Perennial', 'Biennial', 'Annual'] },
  isIndoor: { type: Boolean },
  height: { type: Number },
  width: { type: Number },
  nativeArea: { type: Array },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  lastEdit: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
  favorites: [],
  editors: []
}, {
  timestamps: true
})

plantSchema.virtual('ownerUsername', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
})

plantSchema.virtual('lastEditUsername', {
  ref: 'User',
  localField: 'lastEdit',
  foreignField: '_id',
})

plantSchema.set('toJSON', {
  virtuals: true
})


plantSchema.plugin(mongooseUniqueValidator)
export default mongoose.model('Plant', plantSchema)