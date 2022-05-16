import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'


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
})

plantSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('Plant', plantSchema)