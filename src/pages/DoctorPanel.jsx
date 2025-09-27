import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, TrendingUp, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllPatients, getVitalsData, savePrescription } from '../data/sampleData';

const DoctorPanel = ({ user, addNotification }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    patientId: '',
    medication: '',
    dosage: '',
    frequency: 'daily',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    const allPatients = getAllPatients();
    setPatients(allPatients);
  }, []);

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrescriptionSubmit = (e) => {
    e.preventDefault();
    
    const newPrescription = {
      id: Date.now(),
      doctorId: user.id,
      doctorName: user.name,
      ...prescriptionData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    savePrescription(newPrescription);
    
    setPrescriptionData({
      patientId: '',
      medication: '',
      dosage: '',
      frequency: 'daily',
      duration: '',
      instructions: ''
    });
    setShowPrescriptionForm(false);

    addNotification({
      type: 'success',
      title: 'Prescription Created',
      message: `Prescription for ${newPrescription.medication} has been created`
    });
  };

  const PatientCard = ({ patient, onClick }) => {
    const vitals = getVitalsData(patient.id);
    const latestVitals = vitals[vitals.length - 1] || {};

    return (
      <div className="patient-card" onClick={() => onClick(patient)}>
        <div className="patient-header">
          <div className="patient-info">
            <h4 className="patient-name">{patient.name}</h4>
            <p className="patient-details">{patient.age} years • {patient.gender}</p>
          </div>
          <div className="patient-status">
            <span className="status-badge status-active">Active</span>
          </div>
        </div>
        
        <div className="patient-vitals">
          <div className="vital-item">
            <span className="vital-label">BP:</span>
            <span className="vital-value">
              {latestVitals.bloodPressureHigh || '--'}/{latestVitals.bloodPressureLow || '--'}
            </span>
          </div>
          <div className="vital-item">
            <span className="vital-label">HR:</span>
            <span className="vital-value">{latestVitals.heartRate || '--'} bpm</span>
          </div>
          <div className="vital-item">
            <span className="vital-label">Last Visit:</span>
            <span className="vital-value">
              {vitals.length > 0 ? new Date(vitals[vitals.length - 1].date).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const PatientDetails = ({ patient }) => {
    const vitals = getVitalsData(patient.id);
    
    return (
      <div className="patient-details-container">
        <div className="patient-details-header">
          <h3>{patient.name} - Patient Details</h3>
          <button
            onClick={() => {
              setPrescriptionData(prev => ({ ...prev, patientId: patient.id }));
              setShowPrescriptionForm(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} />
            New Prescription
          </button>
        </div>

        <div className="grid grid-cols-1 grid-md-2 gap-6">
          <div className="card">
            <h4 className="section-title">Patient Information</h4>
            <div className="patient-info-grid">
              <div className="info-item">
                <span className="info-label">Age:</span>
                <span className="info-value">{patient.age} years</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender:</span>
                <span className="info-value">{patient.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{patient.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Health Summary:</span>
                <span className="info-value">{patient.healthSummary}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="section-title">Recent Vitals Trend</h4>
            <div className="chart-container" style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="bloodPressureHigh" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="heartRate" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="doctor-panel-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Doctor Panel</h1>
          <div className="doctor-stats">
            <div className="stat-badge">
              <Users size={16} />
              <span>{patients.length} Patients</span>
            </div>
          </div>
        </div>

        {!selectedPatient ? (
          <div>
            <h2 className="section-title mb-6">My Patients</h2>
            <div className="grid grid-cols-1 grid-md-2 grid-lg-3">
              {patients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={setSelectedPatient}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="back-navigation mb-6">
              <button
                onClick={() => setSelectedPatient(null)}
                className="btn btn-outline"
              >
                ← Back to Patients
              </button>
            </div>
            <PatientDetails patient={selectedPatient} />
          </div>
        )}

        {/* Prescription Form Modal */}
        {showPrescriptionForm && (
          <div className="modal-overlay" onClick={() => setShowPrescriptionForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Prescription</h2>
                <button
                  onClick={() => setShowPrescriptionForm(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handlePrescriptionSubmit} className="prescription-form">
                <div className="input-group">
                  <label className="input-label">Medication Name</label>
                  <input
                    type="text"
                    name="medication"
                    value={prescriptionData.medication}
                    onChange={handlePrescriptionChange}
                    className="input-field"
                    placeholder="e.g., Lisinopril"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Dosage</label>
                    <input
                      type="text"
                      name="dosage"
                      value={prescriptionData.dosage}
                      onChange={handlePrescriptionChange}
                      className="input-field"
                      placeholder="e.g., 10mg"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Frequency</label>
                    <select
                      name="frequency"
                      value={prescriptionData.frequency}
                      onChange={handlePrescriptionChange}
                      className="select-field"
                    >
                      <option value="daily">Once Daily</option>
                      <option value="twice-daily">Twice Daily</option>
                      <option value="three-times">Three Times Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={prescriptionData.duration}
                    onChange={handlePrescriptionChange}
                    className="input-field"
                    placeholder="e.g., 30 days, 6 months, ongoing"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Instructions</label>
                  <textarea
                    name="instructions"
                    value={prescriptionData.instructions}
                    onChange={handlePrescriptionChange}
                    className="input-field"
                    placeholder="Take with food, avoid alcohol, etc."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Prescription
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

export default DoctorPanel;