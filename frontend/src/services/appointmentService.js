const API_BASE_URL = 'http://localhost:5000/api/v1/appointments';

class AppointmentService {
  // Get all appointments for a user
  static async getUserAppointments(authId, status = 'all') {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${authId}?status=${status}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  // Create a new appointment
  static async createAppointment(appointmentData) {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  // Update appointment status
  static async updateAppointmentStatus(appointmentId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment status');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  // Update appointment details (pre-appointment form)
  static async updateAppointmentDetails(appointmentId, details) {
    try {
      const response = await fetch(`${API_BASE_URL}/${appointmentId}/details`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment details');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating appointment details:', error);
      throw error;
    }
  }

  // Delete appointment
  static async deleteAppointment(appointmentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${appointmentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete appointment');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  // Get appointment by ID
  static async getAppointmentById(appointmentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  // Get appointments by doctor email
  static async getDoctorAppointments(doctorEmail, status = 'all') {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/${doctorEmail}?status=${status}`);
      if (!response.ok) {
        throw new Error('Failed to fetch doctor appointments');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw error;
    }
  }
}

export default AppointmentService; 