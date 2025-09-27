import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Video, MapPin, User } from 'lucide-react';
import { getAppointments, saveAppointment, cancelAppointment } from '../data/sampleData';

const Appointments = ({ user, addNotification }) => {
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('upcoming');
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    type: 'in-person',
    date: '',
    time: '',
    reason: '',
    location: ''
  });

  useEffect(() => {
    const data = getAppointments(user.id);
    setAppointments(data);
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAppointment = {
      id: Date.now(),
      userId: user.id,
      ...formData,
      date: `${formData.date}T${formData.time}`,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    const updatedAppointments = saveAppointment(newAppointment);
    setAppointments(updatedAppointments);
    
    setFormData({
      doctorName: '',
      specialty: '',
      type: 'in-person',
      date: '',
      time: '',
      reason: '',
      location: ''
    });
    setShowForm(false);

    addNotification({
      type: 'success',
      title: 'Appointment Booked',
      message: `Appointment with Dr. ${newAppointment.doctorName} scheduled`
    });
  };

  const handleCancel = (appointmentId) => {
    const updated = cancelAppointment(appointmentId);
    setAppointments(updated);
    
    addNotification({
      type: 'info',
      title: 'Appointment Cancelled',
      message: 'Your appointment has been cancelled'
    });
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      if (viewMode === 'upcoming') {
        return aptDate > now && apt.status !== 'cancelled';
      } else {
        return aptDate <= now || apt.status === 'cancelled';
      }
    });
  };

  const AppointmentCard = ({ appointment }) => {
    const isUpcoming = new Date(appointment.date) > new Date();
    const isPast = new Date(appointment.date) < new Date();

    return (
      <div className={`appointment-card ${isPast ? 'past' : ''}`}>
        <div className="appointment-header">
          <div className="appointment-doctor-info">
            <h4 className="doctor-name">Dr. {appointment.doctorName}</h4>
            <p className="doctor-specialty">{appointment.specialty}</p>
          </div>
          <div className="appointment-type-badge">
            {appointment.type === 'video' ? (
              <><Video size={16} /> Video Call</>
            ) : (
              <><MapPin size={16} /> In-Person</>
            )}
          </div>
        </div>

        <div className="appointment-details">
          <div className="appointment-datetime">
            <div className="datetime-item">
              <Calendar size={16} />
              <span>{new Date(appointment.date).toLocaleDateString()}</span>
            </div>
            <div className="datetime-item">
              <Clock size={16} />
              <span>{new Date(appointment.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          
          {appointment.reason && (
            <p className="appointment-reason">{appointment.reason}</p>
          )}
          
          {appointment.location && appointment.type === 'in-person' && (
            <p className="appointment-location">
              <MapPin size={14} />
              {appointment.location}
            </p>
          )}
        </div>

        <div className="appointment-status">
          <span className={`status-badge status-${appointment.status}`}>
            {appointment.status}
          </span>
          {isUpcoming && appointment.status === 'scheduled' && (
            <button
              onClick={() => handleCancel(appointment.id)}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="appointments-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Appointments</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Book Appointment
          </button>
        </div>

        {/* View Toggle */}
        <div className="view-toggle mb-6">
          <button
            onClick={() => setViewMode('upcoming')}
            className={`toggle-btn ${viewMode === 'upcoming' ? 'active' : ''}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`toggle-btn ${viewMode === 'history' ? 'active' : ''}`}
          >
            History
          </button>
        </div>

        {/* Appointments List */}
        <div className="appointments-list">
          {getFilteredAppointments().map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
          
          {getFilteredAppointments().length === 0 && (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>No {viewMode} appointments</h3>
              <p>
                {viewMode === 'upcoming' 
                  ? 'Book your next appointment to stay on top of your health'
                  : 'Your appointment history will appear here'
                }
              </p>
            </div>
          )}
        </div>

        {/* Book Appointment Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Book New Appointment</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Doctor Name</label>
                    <input
                      type="text"
                      name="doctorName"
                      value={formData.doctorName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Dr. Smith"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Specialty</label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="select-field"
                      required
                    >
                      <option value="">Select specialty</option>
                      <option value="General Practice">General Practice</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Appointment Type</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="type"
                        value="in-person"
                        checked={formData.type === 'in-person'}
                        onChange={handleInputChange}
                      />
                      <span>In-Person Visit</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="type"
                        value="video"
                        checked={formData.type === 'video'}
                        onChange={handleInputChange}
                      />
                      <span>Video Consultation</span>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {formData.type === 'in-person' && (
                  <div className="input-group">
                    <label className="input-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Clinic address or room number"
                      required
                    />
                  </div>
                )}

                <div className="input-group">
                  <label className="input-label">Reason for Visit</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Describe your symptoms or reason for the appointment"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;