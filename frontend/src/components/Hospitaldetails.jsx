import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import AppointmentService from "../services/appointmentService";
import { motion } from "framer-motion";
import { Calendar, Clock, User, MapPin, CheckCircle, AlertCircle, Building2, Stethoscope } from "lucide-react";

const HospitalDetails = ({ selectedHospital }) => {
  const { user, isAuthenticated } = useContext(AppContext);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setAppointmentType(null);
    setBookingStatus("");
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(null);
    setSelectedTimeSlot(null);
    setAppointmentType(null);
    setBookingStatus("");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    setAppointmentType(null);
    setBookingStatus("");
  };

  const handleTimeSlotSelect = (slot, type) => {
    setAppointmentType(type);
    setSelectedTimeSlot(slot);
    setBookingStatus("");
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot || !appointmentType) {
      setBookingStatus("Please select a doctor, date, appointment type, and time slot.");
      return;
    }

    if (!isAuthenticated || !user) {
      setBookingStatus("Please log in to book an appointment.");
      return;
    }

    setIsLoading(true);
    setBookingStatus("");

    try {
      const appointmentData = {
        auth_id: user.id,
        hospital_name: selectedHospital.name,
        hospital_location: selectedHospital.vicinity,
        department: selectedDepartment.name,
        doctor_name: selectedDoctor.name,
        doctor_email: selectedDoctor.gmail,
        appointment_date: selectedDate,
        time_slot: selectedTimeSlot,
        status: "scheduled"
      };

      await AppointmentService.createAppointment(appointmentData);

      setBookingStatus("Appointment booked successfully!");
      setSelectedTimeSlot(null);
      setSelectedTimeSlot(null);
      setAppointmentType(null);
    } catch (err) {
      setBookingStatus(`Failed to book appointment: ${err.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Progress tracking
  const progressSteps = [
    { name: "Department", completed: !!selectedDepartment },
    { name: "Doctor", completed: !!selectedDoctor },
    { name: "Date", completed: !!selectedDate },
    { name: "Time", completed: !!selectedTimeSlot },
    { name: "Book", completed: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {selectedHospital ? (
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {selectedHospital.name}
                </h2>
                <p className="text-blue-100 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {selectedHospital.vicinity}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Booking Progress</h3>
              <span className="text-sm text-gray-500">
                {progressSteps.filter(step => step.completed).length} of {progressSteps.length} steps
              </span>
            </div>
            <div className="flex items-center gap-2">
              {progressSteps.map((step, index) => (
                <div key={step.name} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      step.completed ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Departments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Select Department
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedHospital?.departments?.map((department) => (
                  <motion.button
                    key={department.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDepartmentSelect(department)}
                    className={`p-4 rounded-xl font-medium shadow-sm transition-all text-left border-2 ${
                      selectedDepartment?.name === department.name
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700"
                    }`}
                  >
                    <div className="font-semibold">{department.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {department.doctors?.length || 0} doctors available
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Doctors */}
            {selectedDepartment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Select Doctor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDepartment.doctors?.map((doctor) => (
                    <motion.div
                      key={doctor.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-5 border-2 rounded-xl cursor-pointer shadow-sm transition-all ${
                        selectedDoctor?.name === doctor.name
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{doctor.name}</h4>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          doctor.available 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {doctor.available ? "Available" : "Not Available"}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{doctor.gmail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Dates */}
            {selectedDoctor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Select Date
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[...selectedDoctor.availability.offline, ...selectedDoctor.availability.online]
                    .map(slot => slot.date)
                    .filter((date, index, self) => self.indexOf(date) === index)
                    .map((date) => (
                      <motion.button
                        key={date}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDateSelect(date)}
                        className={`px-6 py-3 rounded-xl font-medium shadow-sm transition-all ${
                          selectedDate === date 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "bg-gray-100 hover:bg-blue-100 text-gray-700"
                        }`}
                      >
                        {date}
                      </motion.button>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Time Slots */}
            {selectedDate && selectedDoctor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Select Time Slot
                </h3>
                
                <div className="space-y-6">
                  {/* Offline Appointments */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Offline Appointments
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedDoctor.availability.offline
                        .filter(slot => slot.date === selectedDate)
                        .map((slot, idx) => (
                          <motion.button
                            key={`offline-${idx}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTimeSlotSelect(slot.time, "offline")}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedTimeSlot === slot.time && appointmentType === "offline"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 hover:bg-blue-100 text-gray-700"
                            }`}
                          >
                            {slot.time}
                          </motion.button>
                        ))}
                    </div>
                  </div>

                  {/* Online Appointments */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      Online Appointments
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedDoctor.availability.online
                        .filter(slot => slot.date === selectedDate)
                        .map((slot, idx) => (
                          <motion.button
                            key={`online-${idx}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTimeSlotSelect(slot.time, "online")}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedTimeSlot === slot.time && appointmentType === "online"
                                ? "bg-green-600 text-white shadow-md"
                                : "bg-gray-100 hover:bg-green-100 text-gray-700"
                            }`}
                          >
                            {slot.time}
                          </motion.button>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Booking Status */}
            {bookingStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  bookingStatus.includes("successfully") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {bookingStatus.includes("successfully") ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                {bookingStatus}
              </motion.div>
            )}

            {/* Book Appointment Button */}
            {selectedDoctor && selectedDate && selectedTimeSlot && appointmentType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookAppointment}
                  disabled={isLoading || !isAuthenticated}
                  className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
                    isLoading || !isAuthenticated
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }`}
                >
                  {isLoading ? "Booking..." : "Book Appointment"}
                </motion.button>
              </motion.div>
            )}

            {/* Authentication Notice */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700"
              >
                <p className="text-center">
                  Please <a href="/" className="underline font-medium">log in</a> to book an appointment.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 p-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-12 h-12 text-gray-400" />
          </div>
          <p>Select a hospital to view details and book appointments.</p>
        </div>
      )}
    </motion.div>
  );
};

export default HospitalDetails;