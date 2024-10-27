import mongoose, { Schema } from 'mongoose';

const dosageSchema = new Schema({
  beforeAfter: {
    type: String,
    required: true,
    enum: ['Before', 'After'],
    trim: true,
  },
  meal: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
    trim: true,
  }
});

const chatPrescriptionSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  quantity: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  dosage: [dosageSchema]  // Array of dosage objects
}, { timestamps: true });

export const ChatPrescription = mongoose.model('ChatPrescription', chatPrescriptionSchema);