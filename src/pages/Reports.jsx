import React, { useState } from 'react';
import { Download, FileText, Calendar, TrendingUp, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import { getVitalsData, getMedications, getAppointments } from '../data/sampleData';

const Reports = ({ user }) => {
  const [selectedReport, setSelectedReport] = useState('health-summary');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePDF = (reportType) => {
    const doc = new jsPDF();
    const vitals = getVitalsData(user.id);
    const medications = getMedications(user.id);
    const appointments = getAppointments(user.id);

    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('PulsePoint Health Report', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient: ${user.name}`, 20, 45);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
    doc.text(`Report Period: ${dateRange.startDate} to ${dateRange.endDate}`, 20, 65);

    let yPosition = 85;

    if (reportType === 'health-summary' || reportType === 'vitals') {
      // Vitals section
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('Vital Signs Summary', 20, yPosition);
      yPosition += 15;

      const recentVitals = vitals.slice(-5);
      recentVitals.forEach((vital, index) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${vital.date}: BP ${vital.bloodPressureHigh}/${vital.bloodPressureLow}, HR ${vital.heartRate}, Weight ${vital.weight}kg`, 20, yPosition);
        yPosition += 12;
      });
      yPosition += 10;
    }

    if (reportType === 'health-summary' || reportType === 'medications') {
      // Medications section
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('Current Medications', 20, yPosition);
      yPosition += 15;

      const activeMedications = medications.filter(med => med.status === 'active');
      activeMedications.forEach((med, index) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${med.name} - ${med.dosage} (${med.frequency})`, 20, yPosition);
        yPosition += 12;
      });
      yPosition += 10;
    }

    if (reportType === 'health-summary' || reportType === 'appointments') {
      // Appointments section
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.text('Recent Appointments', 20, yPosition);
      yPosition += 15;

      const recentAppointments = appointments.slice(-5);
      recentAppointments.forEach((apt, index) => {
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${new Date(apt.date).toLocaleDateString()} - Dr. ${apt.doctorName} (${apt.specialty})`, 20, yPosition);
        yPosition += 12;
      });
    }

    // Save the PDF
    doc.save(`pulsepoint-${reportType}-report.pdf`);
  };

  const ReportPreview = () => {
    const vitals = getVitalsData(user.id);
    const medications = getMedications(user.id);
    const appointments = getAppointments(user.id);

    return (
      <div className="report-preview">
        <div className="report-header">
          <h2>PulsePoint Health Report</h2>
          <div className="report-meta">
            <p><strong>Patient:</strong> {user.name}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Period:</strong> {dateRange.startDate} to {dateRange.endDate}</p>
          </div>
        </div>

        {(selectedReport === 'health-summary' || selectedReport === 'vitals') && (
          <div className="report-section">
            <h3>Vital Signs Summary</h3>
            <div className="vitals-summary">
              {vitals.slice(-5).map((vital, index) => (
                <div key={index} className="vital-row">
                  <span className="vital-date">{vital.date}</span>
                  <span>BP: {vital.bloodPressureHigh}/{vital.bloodPressureLow}</span>
                  <span>HR: {vital.heartRate}</span>
                  <span>Weight: {vital.weight}kg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(selectedReport === 'health-summary' || selectedReport === 'medications') && (
          <div className="report-section">
            <h3>Current Medications</h3>
            <div className="medications-summary">
              {medications.filter(med => med.status === 'active').map((med, index) => (
                <div key={index} className="medication-row">
                  <span className="medication-name">{med.name}</span>
                  <span className="medication-details">{med.dosage} - {med.frequency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(selectedReport === 'health-summary' || selectedReport === 'appointments') && (
          <div className="report-section">
            <h3>Recent Appointments</h3>
            <div className="appointments-summary">
              {appointments.slice(-5).map((apt, index) => (
                <div key={index} className="appointment-row">
                  <span className="appointment-date">{new Date(apt.date).toLocaleDateString()}</span>
                  <span>Dr. {apt.doctorName}</span>
                  <span className="appointment-specialty">{apt.specialty}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="reports-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
        </div>

        <div className="grid grid-cols-1 grid-lg-3 gap-8">
          {/* Report Controls */}
          <div className="report-controls">
            <div className="card">
              <h3 className="card-title">Generate Report</h3>
              
              <div className="input-group">
                <label className="input-label">Report Type</label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="select-field"
                >
                  <option value="health-summary">Complete Health Summary</option>
                  <option value="vitals">Vitals Report</option>
                  <option value="medications">Medications Report</option>
                  <option value="appointments">Appointments Report</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label className="input-label">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="input-field"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="report-actions">
                <button
                  onClick={() => generatePDF(selectedReport)}
                  className="btn btn-primary"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn btn-outline"
                >
                  <Printer size={16} />
                  Print
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="card-title">Health Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <TrendingUp size={20} />
                  <div>
                    <div className="stat-value">{getVitalsData(user.id).length}</div>
                    <div className="stat-label">Vitals Recorded</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FileText size={20} />
                  <div>
                    <div className="stat-value">{getMedications(user.id).length}</div>
                    <div className="stat-label">Medications</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Calendar size={20} />
                  <div>
                    <div className="stat-value">{getAppointments(user.id).length}</div>
                    <div className="stat-label">Appointments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Preview */}
          <div className="report-preview-container">
            <div className="card">
              <h3 className="card-title">Report Preview</h3>
              <ReportPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;