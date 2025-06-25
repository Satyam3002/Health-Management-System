const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  auth_id: {
    type: String,
    required: true,
    index: true
  },
  doctor_name: {
    type: String,
    required: true
  },
  doctor_email: {
    type: String,
    required: true
  },
  hospital_name: {
    type: String,
    required: true
  },
  hospital_location: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  appointment_date: {
    type: Date,
    required: true
  },
  time_slot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  symptoms: {
    type: String,
    default: ''
  },
  medications: {
    type: String,
    default: ''
  },
  allergies: {
    type: String,
    default: ''
  },
  medicalHistory: {
    type: String,
    default: ''
  },
  medicineHistory: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
appointmentSchema.index({ auth_id: 1, appointment_date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ doctor_email: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
