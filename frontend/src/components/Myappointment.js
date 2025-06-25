import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import AppointmentService from "../services/appointmentService";
import Card from "./UI/Card";
import Modal from "./UI/Modal";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, User, Hospital, Activity, Calendar as CalendarIcon } from "lucide-react";
import {useNavigate} from 'react-router-dom'

const MyAppointment = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [formData, setFormData] = useState({
    symptoms: "",
    medications: "",
    allergies: "",
    medicalHistory: "",
    medicineHistory: "",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAppointments();
    } else {
      setLoading(false);
      setError("Please log in to view appointments.");
    }
  }, [selectedFilter, isAuthenticated, user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getUserAppointments(user.id, selectedFilter);
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoCall = (appointment)=>{
    const uniqueCode = Math.random().toString(36).substr(2, 9);
    console.log(appointment)
    navigate(`/room/${uniqueCode}`, { state: { appointment } });
  }

  const handlePreAppointment = (doctor) => {
    setCurrentDoctor(doctor);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    try {
      // Update appointment details in MongoDB
      await AppointmentService.updateAppointmentDetails(currentDoctor._id, formData);
      
      // Send email to doctor (keeping the existing email functionality)
      const emailData = {
        service_id: "service_bv3i6qp",
        template_id: "template_1f6thm8",
        user_id: "1Fyyfib7XghQqEtKM",
        template_params: {
          to_email: currentDoctor.doctor_email,
          patient_symptoms: formData.symptoms,
          patient_medications: formData.medications,
          patient_allergies: formData.allergies,
          patient_medical_history: formData.medicalHistory,
          patient_medicine_history: formData.medicineHistory,
        },
      };

      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert("Pre-appointment details sent to the doctor successfully!");
        setShowForm(false);
        setFormData({
          symptoms: "",
          medications: "",
          allergies: "",
          medicalHistory: "",
          medicineHistory: "",
        });
        // Refresh appointments to show updated data
        fetchAppointments();
      } else {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        alert("Failed to send email. Please check your inputs and try again.");
      }
    } catch (error) {
      console.error("Error updating appointment details:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await AppointmentService.updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update appointment status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="h-12 w-12 bg-blue-600 rounded-full animate-bounce delay-100"></div>
          <div className="h-12 w-12 bg-blue-800 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-yellow-600 bg-yellow-100 px-6 py-4 rounded-lg shadow-md mb-4">
            <Activity className="inline-block mr-2 h-6 w-6" />
            Please log in to view your appointments.
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-lg text-red-600 bg-red-100 px-6 py-4 rounded-lg shadow-md">
          <Activity className="inline-block mr-2 h-6 w-6" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            My Appointments
          </h1>
          <div className="flex space-x-4">
            {['all', 'scheduled', 'completed', 'cancelled'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl">No appointments found.</p>
            <p className="text-gray-500 mt-2">Book your first appointment to get started!</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xl text-gray-800">
                        {appointment.hospital_name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === "scheduled"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        <p>{appointment.doctor_name}</p>
                      </div>
                      <div className="flex items-center">
                        <Hospital className="h-5 w-5 mr-2 text-blue-600" />
                        <p>{appointment.department}</p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        <p>{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        <p>{appointment.time_slot}</p>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                        <p>{appointment.hospital_location}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVideoCall(appointment)}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-green-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule a Video Call
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePreAppointment(appointment)}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <Activity className="h-5 w-5 mr-2" />
                      Pre-Appointment Check
                    </motion.button>

                    {/* Status update buttons */}
                    {appointment.status === 'scheduled' && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                          className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                          className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {showForm && (
        <Modal
          setShowForm={setShowForm}
          formData={formData}
          handleFormChange={handleFormChange}
          handleSubmitForm={handleSubmitForm}
        />
      )}
    </div>
  );
};

export default MyAppointment;