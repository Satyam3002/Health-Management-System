import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import AppointmentService from "../services/appointmentService";

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
      setAppointmentType(null);
    } catch (err) {
      setBookingStatus(`Failed to book appointment: ${err.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg">
      {selectedHospital ? (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
            {selectedHospital.name}
          </h2>
          <p className="text-sm md:text-base text-gray-500 mb-6 text-center md:text-left">
            {selectedHospital.vicinity}
          </p>

          {/* Departments */}
          <div className="mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Select Department</h3>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {selectedHospital?.departments?.map((department) => (
                <button
                  key={department.name}
                  onClick={() => handleDepartmentSelect(department)}
                  className={`px-4 py-2 md:px-5 md:py-2 rounded-lg font-medium shadow-sm transition-all w-full md:w-auto text-center ${
                    selectedDepartment?.name === department.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-blue-100 text-gray-800"
                  }`}
                >
                  {department.name}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors */}
          {selectedDepartment && (
            <div className="mb-8 md:mb-10">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Select Doctor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {selectedDepartment.doctors?.map((doctor) => (
                  <div
                    key={doctor.name}
                    className={`p-4 md:p-5 border rounded-lg cursor-pointer shadow-md transition-all ${
                      selectedDoctor?.name === doctor.name
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:shadow-lg"
                    }`}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                    <p
                      className={`text-sm font-medium ${
                        doctor.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {doctor.available ? "Available" : "Not Available"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          {selectedDoctor && (
            <div className="mb-8 md:mb-10">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Select Date</h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {[...selectedDoctor.availability.offline, ...selectedDoctor.availability.online]
                  .map(slot => slot.date)
                  .filter((date, index, self) => self.indexOf(date) === index)
                  .map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`px-4 py-2 rounded-lg shadow-sm transition-all ${
                        selectedDate === date ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-blue-100"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Time Slots */}
          {selectedDate && selectedDoctor && (
            <div className="mb-8 md:mb-10">
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">Select Time Slot</h3>
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Offline Appointments</h4>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {selectedDoctor.availability.offline
                    .filter(slot => slot.date === selectedDate)
                    .map((slot, idx) => (
                      <button
                        key={`offline-${idx}`}
                        onClick={() => handleTimeSlotSelect(slot.time, "offline")}
                        className={`px-3 py-2 rounded-lg shadow-sm transition-all ${
                          selectedTimeSlot === slot.time && appointmentType === "offline"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-blue-100"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Online Appointments</h4>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {selectedDoctor.availability.online
                    .filter(slot => slot.date === selectedDate)
                    .map((slot, idx) => (
                      <button
                        key={`online-${idx}`}
                        onClick={() => handleTimeSlotSelect(slot.time, "online")}
                        className={`px-3 py-2 rounded-lg shadow-sm transition-all ${
                          selectedTimeSlot === slot.time && appointmentType === "online"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 hover:bg-green-100"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Booking Status */}
          {bookingStatus && (
            <div className={`mb-6 p-4 rounded-lg ${
              bookingStatus.includes("successfully") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {bookingStatus}
            </div>
          )}

          {/* Book Appointment Button */}
          {selectedDoctor && selectedDate && selectedTimeSlot && appointmentType && (
            <div className="flex justify-center">
              <button
                onClick={handleBookAppointment}
                disabled={isLoading || !isAuthenticated}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isLoading || !isAuthenticated
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
                }`}
              >
                {isLoading ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          )}

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
              <p className="text-center">
                Please <a href="/" className="underline font-medium">log in</a> to book an appointment.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>Select a hospital to view details and book appointments.</p>
        </div>
      )}
    </div>
  );
};

export default HospitalDetails;