import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Activity, Droplets, Scale, Plus } from 'lucide-react';
import { getVitalsData, saveVitalsData } from '../data/sampleData';

const Vitals = ({ user, addNotification }) => {
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bloodPressureHigh: '',
    bloodPressureLow: '',
    heartRate: '',
    bloodSugar: '',
    oxygenSaturation: '',
    weight: '',
    notes: ''
  });

  useEffect(() => {
    const data = getVitalsData(user.id);
    setVitalsHistory(data);
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
    
    const newVital = {
      id: Date.now(),
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      ...formData,
      bloodPressureHigh: parseInt(formData.bloodPressureHigh),
      bloodPressureLow: parseInt(formData.bloodPressureLow),
      heartRate: parseInt(formData.heartRate),
      bloodSugar: parseInt(formData.bloodSugar),
      oxygenSaturation: parseInt(formData.oxygenSaturation),
      weight: parseFloat(formData.weight)
    };

    const updatedHistory = saveVitalsData(newVital);
    setVitalsHistory(updatedHistory);
    
    // Reset form
    setFormData({
      bloodPressureHigh: '',
      bloodPressureLow: '',
      heartRate: '',
      bloodSugar: '',
      oxygenSaturation: '',
      weight: '',
      notes: ''
    });
    setShowForm(false);

    // Check for alerts
    if (newVital.bloodPressureHigh > 140 || newVital.bloodPressureLow > 90) {
      addNotification({
        type: 'warning',
        title: 'High Blood Pressure Alert',
        message: `Reading: ${newVital.bloodPressureHigh}/${newVital.bloodPressureLow} mmHg`
      });
    }

    addNotification({
      type: 'success',
      title: 'Vitals Recorded',
      message: 'Your health data has been successfully logged'
    });
  };

  const VitalCard = ({ title, value, unit, icon: Icon, status = 'normal' }) => (
    <div className="vital-card">
      <div className="vital-header">
        <Icon size={24} />
        <span className={`vital-status vital-status-${status}`}>{status}</span>
      </div>
      <div className="vital-value">{value} <span className="vital-unit">{unit}</span></div>
      <div className="vital-title">{title}</div>
    </div>
  );

  const latestVitals = vitalsHistory[vitalsHistory.length - 1] || {};

  return (
    <div className="vitals-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Vitals Tracker</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Log New Vitals
          </button>
        </div>

        {/* Current Vitals Cards */}
        <div className="grid grid-cols-1 grid-md-2 grid-lg-4 mb-8">
          <VitalCard
            title="Blood Pressure"
            value={`${latestVitals.bloodPressureHigh || '--'}/${latestVitals.bloodPressureLow || '--'}`}
            unit="mmHg"
            icon={Heart}
            status={latestVitals.bloodPressureHigh > 140 ? 'warning' : 'normal'}
          />
          <VitalCard
            title="Heart Rate"
            value={latestVitals.heartRate || '--'}
            unit="bpm"
            icon={Activity}
            status="normal"
          />
          <VitalCard
            title="Blood Sugar"
            value={latestVitals.bloodSugar || '--'}
            unit="mg/dL"
            icon={Droplets}
            status={latestVitals.bloodSugar > 140 ? 'warning' : 'normal'}
          />
          <VitalCard
            title="Weight"
            value={latestVitals.weight || '--'}
            unit="kg"
            icon={Scale}
            status="normal"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 grid-lg-2 mb-8">
          <div className="card">
            <h3 className="chart-title mb-4">Blood Pressure Trend (7 days)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsHistory.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="bloodPressureHigh" stroke="#ef4444" strokeWidth={2} name="Systolic" />
                  <Line type="monotone" dataKey="bloodPressureLow" stroke="#3b82f6" strokeWidth={2} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="chart-title mb-4">Heart Rate & Weight Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsHistory.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#10b981" strokeWidth={2} name="Heart Rate" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vitals History Table */}
        <div className="card">
          <h3 className="section-title mb-4">Vitals History</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Pressure</th>
                  <th>Heart Rate</th>
                  <th>Blood Sugar</th>
                  <th>Weight</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {vitalsHistory.slice(-10).reverse().map((vital) => (
                  <tr key={vital.id}>
                    <td>{new Date(vital.date).toLocaleDateString()}</td>
                    <td>
                      <span className={vital.bloodPressureHigh > 140 ? 'text-warning' : ''}>
                        {vital.bloodPressureHigh}/{vital.bloodPressureLow} mmHg
                      </span>
                    </td>
                    <td>{vital.heartRate} bpm</td>
                    <td>
                      <span className={vital.bloodSugar > 140 ? 'text-warning' : ''}>
                        {vital.bloodSugar} mg/dL
                      </span>
                    </td>
                    <td>{vital.weight} kg</td>
                    <td>{vital.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vitals Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Log New Vitals</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="vitals-form">
                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      name="bloodPressureHigh"
                      value={formData.bloodPressureHigh}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="120"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      name="bloodPressureLow"
                      value={formData.bloodPressureLow}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="80"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="72"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      name="bloodSugar"
                      value={formData.bloodSugar}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="100"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Oxygen Saturation (%)</label>
                    <input
                      type="number"
                      name="oxygenSaturation"
                      value={formData.oxygenSaturation}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="98"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="70.0"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Any additional observations..."
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
                    Save Vitals
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

export default Vitals;