import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Heart, 
  Pill, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Activity
} from 'lucide-react';
import { getVitalsData, getMedications, getAppointments } from '../data/sampleData';

const Dashboard = ({ user, addNotification }) => {
  const [vitalsData, setVitalsData] = useState([]);
  const [todayMedications, setTodayMedications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthScore, setHealthScore] = useState(85);

  useEffect(() => {
    // Load dashboard data
    const vitals = getVitalsData(user.id);
    setVitalsData(vitals.slice(-7)); // Last 7 days

    const medications = getMedications(user.id);
    const today = new Date().toDateString();
    setTodayMedications(medications.filter(med => 
      new Date(med.nextDose).toDateString() === today
    ));

    const appointments = getAppointments(user.id);
    setUpcomingAppointments(appointments.filter(apt => 
      new Date(apt.date) > new Date()
    ).slice(0, 3));

    // Simulate health notifications
    if (vitals.length > 0) {
      const latestVitals = vitals[vitals.length - 1];
      if (latestVitals.bloodPressureHigh > 140) {
        addNotification({
          type: 'warning',
          title: 'High Blood Pressure Alert',
          message: `Latest reading: ${latestVitals.bloodPressureHigh}/${latestVitals.bloodPressureLow} mmHg`
        });
      }
    }
  }, [user.id, addNotification]);

  const StatCard = ({ title, value, unit, icon: Icon, trend, color = 'primary' }) => (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-header">
        <Icon size={24} />
        <span className="stat-trend">{trend}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title} {unit && `(${unit})`}</div>
    </div>
  );

  const QuickActionCard = ({ title, description, link, icon: Icon, color = 'primary' }) => (
    <Link to={link} className={`quick-action-card quick-action-${color}`}>
      <div className="quick-action-icon">
        <Icon size={24} />
      </div>
      <div className="quick-action-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  );

  return (
    <div className="dashboard fade-in">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}!</h1>
          <p className="dashboard-subtitle">Here's your health overview for today</p>
        </div>

        {/* Health Score */}
        <div className="health-score-section mb-8">
          <div className="card">
            <div className="health-score-content">
              <div className="health-score-circle">
                <div className="health-score-value">{healthScore}</div>
                <div className="health-score-label">Health Score</div>
              </div>
              <div className="health-score-details">
                <h3>Overall Health Status</h3>
                <p>Based on your recent vitals, medications, and appointments</p>
                <div className="health-indicators">
                  <span className="health-indicator normal">Vitals Normal</span>
                  <span className="health-indicator normal">Medications On Track</span>
                  <span className="health-indicator warning">Exercise Goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 grid-md-2 grid-lg-4 mb-8">
          <StatCard
            title="Blood Pressure"
            value="120/80"
            unit="mmHg"
            icon={Heart}
            trend="+2%"
            color="success"
          />
          <StatCard
            title="Heart Rate"
            value="72"
            unit="bpm"
            icon={Activity}
            trend="-1%"
            color="primary"
          />
          <StatCard
            title="Medications Due"
            value={todayMedications.length}
            icon={Pill}
            trend="Today"
            color="warning"
          />
          <StatCard
            title="Next Appointment"
            value={upcomingAppointments.length > 0 ? "Tomorrow" : "None"}
            icon={Calendar}
            trend=""
            color="secondary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 grid-lg-2 mb-8">
          <div className="card">
            <h3 className="chart-title mb-4">Blood Pressure Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={vitalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bloodPressureHigh" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Systolic"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bloodPressureLow" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Diastolic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="chart-title mb-4">Heart Rate & Weight</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={vitalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Heart Rate (bpm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 grid-md-2 grid-lg-4 mb-8">
          <QuickActionCard
            title="Log Vitals"
            description="Record today's health measurements"
            link="/vitals"
            icon={TrendingUp}
            color="primary"
          />
          <QuickActionCard
            title="Manage Medications"
            description="Track pills and set reminders"
            link="/medications"
            icon={Pill}
            color="secondary"
          />
          <QuickActionCard
            title="Book Appointment"
            description="Schedule with your healthcare provider"
            link="/appointments"
            icon={Calendar}
            color="accent"
          />
          <QuickActionCard
            title="View Reports"
            description="Generate health summaries"
            link="/reports"
            icon={FileText}
            color="success"
          />
        </div>

        {/* Today's Tasks */}
        <div className="grid grid-cols-1 grid-lg-2">
          <div className="card">
            <h3 className="section-title mb-4">
              <Pill size={20} />
              Medications Due Today
            </h3>
            {todayMedications.length > 0 ? (
              <div className="medication-list">
                {todayMedications.map((med) => (
                  <div key={med.id} className="medication-item">
                    <div className="medication-info">
                      <span className="medication-name">{med.name}</span>
                      <span className="medication-dosage">{med.dosage}</span>
                    </div>
                    <div className="medication-time">
                      <Clock size={16} />
                      {new Date(med.nextDose).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No medications due today</p>
            )}
          </div>

          <div className="card">
            <h3 className="section-title mb-4">
              <Calendar size={20} />
              Upcoming Appointments
            </h3>
            {upcomingAppointments.length > 0 ? (
              <div className="appointment-list">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="appointment-item">
                    <div className="appointment-info">
                      <span className="appointment-doctor">Dr. {apt.doctor}</span>
                      <span className="appointment-type">{apt.type}</span>
                    </div>
                    <div className="appointment-date">
                      {new Date(apt.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;