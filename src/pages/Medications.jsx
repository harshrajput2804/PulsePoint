import React, { useState, useEffect } from 'react';
import { Plus, Clock, Check, X, Calendar, Pill } from 'lucide-react';
import { getMedications, saveMedication, updateMedicationStatus } from '../data/sampleData';

const Medications = ({ user, addNotification }) => {
  const [medications, setMedications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('schedule'); // schedule, history
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timing: '08:00',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: ''
  });

  useEffect(() => {
    const data = getMedications(user.id);
    setMedications(data);
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
    
    const newMedication = {
      id: Date.now(),
      userId: user.id,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
      takenDoses: [],
      missedDoses: []
    };

    const updatedMedications = saveMedication(newMedication);
    setMedications(updatedMedications);
    
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      timing: '08:00',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      instructions: ''
    });
    setShowForm(false);

    addNotification({
      type: 'success',
      title: 'Medication Added',
      message: `${newMedication.name} has been added to your medication schedule`
    });
  };

  const markAsTaken = (medicationId) => {
    const updated = updateMedicationStatus(medicationId, 'taken');
    setMedications(updated);
    
    const medication = medications.find(m => m.id === medicationId);
    addNotification({
      type: 'success',
      title: 'Medication Taken',
      message: `${medication.name} marked as taken`
    });
  };

  const markAsMissed = (medicationId) => {
    const updated = updateMedicationStatus(medicationId, 'missed');
    setMedications(updated);
    
    const medication = medications.find(m => m.id === medicationId);
    addNotification({
      type: 'warning',
      title: 'Medication Missed',
      message: `${medication.name} marked as missed`
    });
  };

  const getTodaysMedications = () => {
    const today = new Date().toDateString();
    return medications.filter(med => {
      const startDate = new Date(med.startDate);
      const endDate = med.endDate ? new Date(med.endDate) : new Date('2030-12-31');
      const currentDate = new Date();
      
      return currentDate >= startDate && currentDate <= endDate && med.status === 'active';
    });
  };

  const MedicationCard = ({ medication, showActions = true }) => (
    <div className="medication-card">
      <div className="medication-header">
        <div className="medication-info">
          <h4 className="medication-name">{medication.name}</h4>
          <p className="medication-dosage">{medication.dosage}</p>
        </div>
        <div className="medication-timing">
          <Clock size={16} />
          <span>{medication.timing}</span>
        </div>
      </div>
      
      <div className="medication-details">
        <div className="medication-frequency">
          <span className="frequency-badge">{medication.frequency}</span>
        </div>
        {medication.instructions && (
          <p className="medication-instructions">{medication.instructions}</p>
        )}
      </div>

      {showActions && (
        <div className="medication-actions">
          <button
            onClick={() => markAsTaken(medication.id)}
            className="btn btn-secondary action-btn"
          >
            <Check size={16} />
            Taken
          </button>
          <button
            onClick={() => markAsMissed(medication.id)}
            className="btn btn-outline action-btn"
          >
            <X size={16} />
            Missed
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="medications-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Medication Tracker</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Medication
          </button>
        </div>

        {/* View Toggle */}
        <div className="view-toggle mb-6">
          <button
            onClick={() => setViewMode('schedule')}
            className={`toggle-btn ${viewMode === 'schedule' ? 'active' : ''}`}
          >
            <Calendar size={16} />
            Today's Schedule
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`toggle-btn ${viewMode === 'history' ? 'active' : ''}`}
          >
            <Pill size={16} />
            All Medications
          </button>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'schedule' ? (
          <div className="schedule-view">
            <h3 className="section-title mb-4">Today's Medications</h3>
            <div className="grid grid-cols-1 grid-md-2 grid-lg-3">
              {getTodaysMedications().map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  showActions={true}
                />
              ))}
            </div>
            {getTodaysMedications().length === 0 && (
              <div className="empty-state">
                <Pill size={48} />
                <h3>No medications scheduled for today</h3>
                <p>Add your medications to start tracking</p>
              </div>
            )}
          </div>
        ) : (
          <div className="history-view">
            <h3 className="section-title mb-4">All Medications</h3>
            <div className="medications-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Timing</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((medication) => (
                    <tr key={medication.id}>
                      <td className="font-weight-medium">{medication.name}</td>
                      <td>{medication.dosage}</td>
                      <td>
                        <span className="frequency-badge">{medication.frequency}</span>
                      </td>
                      <td>{medication.timing}</td>
                      <td>
                        <span className={`status-badge status-${medication.status}`}>
                          {medication.status}
                        </span>
                      </td>
                      <td>{new Date(medication.startDate).toLocaleDateString()}</td>
                      <td>{medication.endDate ? new Date(medication.endDate).toLocaleDateString() : 'Ongoing'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Medication Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New Medication</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="medication-form">
                <div className="input-group">
                  <label className="input-label">Medication Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Aspirin"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Dosage</label>
                    <input
                      type="text"
                      name="dosage"
                      value={formData.dosage}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., 100mg"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Frequency</label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="select-field"
                    >
                      <option value="daily">Daily</option>
                      <option value="twice-daily">Twice Daily</option>
                      <option value="three-times">Three Times Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Timing</label>
                    <input
                      type="time"
                      name="timing"
                      value={formData.timing}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">End Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input-field"
                    min={formData.startDate}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Instructions</label>
                  <textarea
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Take with food, avoid alcohol, etc."
                    rows="3"
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
                    Add Medication
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

export default Medications;