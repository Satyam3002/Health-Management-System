const express = require('express');
const router = express.Router();
const {
  getUserAppointments,
  createAppointment,
  updateAppointmentStatus,
  updateAppointmentDetails,
  deleteAppointment,
  getAppointmentById,
  getDoctorAppointments
} = require('../controller/appointmentController');


router.get('/user/:auth_id', getUserAppointments);


router.get('/doctor/:doctor_email', getDoctorAppointments);

router.get('/:id', getAppointmentById);

router.post('/', createAppointment);


router.patch('/:id/status', updateAppointmentStatus);


router.patch('/:id/details', updateAppointmentDetails);


router.delete('/:id', deleteAppointment);

module.exports = router; 