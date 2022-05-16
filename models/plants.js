import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'



// SUBDOCUMENT
// Comment Schema
const commentSchema = new mongoose.Schema({
  subject: { type: String, required: true, maxlength: 50 },
  text: { type: String, required: true, maxlength: 350 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true // setting timestamps to be true adds "createdAt" and "updatedAt" timestamps to our document
})


const plantSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 150 },
  scientificName: { type: String, required: true, unique: true },
  images: { type: String, required: true },
  upkeep: {
    watering: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], required: true },
    sunExposure: { type: String, enum: ['Full sun', 'Partial sun', 'Shade'], required: true },
    soilType: { type: String, enum: ['Loamy', 'Chalky', 'Peaty', 'Silty', 'Sandy', 'Clay'], required: true },
  },
  characteristics: {
    flowerColor: { type: Array },
    mood: { type: String, enum: ['Mysterious', 'Cheerful', 'Emo', 'Bright', 'Classy'] },
    lifespan: { type: String, enum: ['Evergreen', 'Perennial', 'Biennial'] },
    isIndoor: { type: Boolean },
    matureSize: {
      height: { type: Number },
      width: { type: Number },
    },
    nativeArea: { type: Array },
  },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  lastEdit: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
}, {
  timestamps: true
})

plantSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('Plant', plantSchema)