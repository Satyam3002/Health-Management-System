const Appointment = require('../models/Appointment');

// Get all appointments for a user
const getUserAppointments = async (req, res) => {
  try {
    const { auth_id } = req.params;
    const { status } = req.query;

    let query = { auth_id };
    
   
    if (status && status !== 'all') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .sort({ appointment_date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const {
      auth_id,
      doctor_name,
      doctor_email,
      hospital_name,
      hospital_location,
      department,
      appointment_date,
      time_slot,
      symptoms,
      medications,
      allergies,
      medicalHistory,
      medicineHistory
    } = req.body;

    // Validate required fields
    if (!auth_id || !doctor_name || !doctor_email || !hospital_name || 
        !hospital_location || !department || !appointment_date || !time_slot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const appointment = new Appointment({
      auth_id,
      doctor_name,
      doctor_email,
      hospital_name,
      hospital_location,
      department,
      appointment_date: new Date(appointment_date),
      time_slot,
      symptoms: symptoms || '',
      medications: medications || '',
      allergies: allergies || '',
      medicalHistory: medicalHistory || '',
      medicineHistory: medicineHistory || ''
    });

    const savedAppointment = await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: savedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be scheduled, completed, or cancelled'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message
    });
  }
};


const updateAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      symptoms,
      medications,
      allergies,
      medicalHistory,
      medicineHistory,
      notes
    } = req.body;

    const updateData = {};
    if (symptoms !== undefined) updateData.symptoms = symptoms;
    if (medications !== undefined) updateData.medications = medications;
    if (allergies !== undefined) updateData.allergies = allergies;
    if (medicalHistory !== undefined) updateData.medicalHistory = medicalHistory;
    if (medicineHistory !== undefined) updateData.medicineHistory = medicineHistory;
    if (notes !== undefined) updateData.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment details updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment details',
      error: error.message
    });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    });
  }
};


const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
};


const getDoctorAppointments = async (req, res) => {
  try {
    const { doctor_email } = req.params;
    const { status } = req.query;

    let query = { doctor_email };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .sort({ appointment_date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor appointments',
      error: error.message
    });
  }
};

module.exports = {
  getUserAppointments,
  createAppointment,
  updateAppointmentStatus,
  updateAppointmentDetails,
  deleteAppointment,
  getAppointmentById,
  getDoctorAppointments
}; 