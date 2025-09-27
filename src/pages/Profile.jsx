import React, { useState } from 'react';
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    phone: user.phone || '',
    address: user.address || '',
    emergencyContact: user.emergencyContact || '',
    allergies: user.allergies || '',
    medicalConditions: user.medicalConditions || '',
    healthSummary: user.healthSummary
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    localStorage.setItem('pulsepoint_user', JSON.stringify({
      ...user,
      ...formData
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      phone: user.phone || '',
      address: user.address || '',
      emergencyContact: user.emergencyContact || '',
      allergies: user.allergies || '',
      medicalConditions: user.medicalConditions || '',
      healthSummary: user.healthSummary
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              <Edit2 size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={handleCancel}
                className="btn btn-outline"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 grid-lg-3 gap-8">
          {/* Profile Overview */}
          <div className="profile-overview">
            <div className="card">
              <div className="profile-avatar">
                <User size={64} />
              </div>
              <div className="profile-basic-info">
                <h2>{formData.name}</h2>
                <p className="profile-role">{user.role}</p>
                <div className="profile-stats">
                  <div className="stat-item">
                    <Mail size={16} />
                    <span>{formData.email}</span>
                  </div>
                  <div className="stat-item">
                    <Calendar size={16} />
                    <span>{formData.age} years old</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Summary */}
            <div className="card">
              <h3 className="card-title">Health Summary</h3>
              {isEditing ? (
                <textarea
                  name="healthSummary"
                  value={formData.healthSummary}
                  onChange={handleInputChange}
                  className="input-field"
                  rows="4"
                  placeholder="Brief health summary..."
                />
              ) : (
                <p className="health-summary-text">{formData.healthSummary}</p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="profile-details">
            <div className="card">
              <h3 className="card-title">Personal Information</h3>
              
              <div className="profile-form">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <div className="profile-value">{formData.name}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Age</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="input-field"
                        min="1"
                        max="120"
                      />
                    ) : (
                      <div className="profile-value">{formData.age}</div>
                    )}
                  </div>
                  <div className="input-group">
                    <label className="input-label">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="select-field"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="profile-value">{formData.gender}</div>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <div className="profile-value">{formData.email}</div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <div className="profile-value">{formData.phone || 'Not provided'}</div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="2"
                      placeholder="Your address"
                    />
                  ) : (
                    <div className="profile-value">{formData.address || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="medical-details">
            <div className="card">
              <h3 className="card-title">Medical Information</h3>
              
              <div className="profile-form">
                <div className="input-group">
                  <label className="input-label">Emergency Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Name and phone number"
                    />
                  ) : (
                    <div className="profile-value">{formData.emergencyContact || 'Not provided'}</div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">Allergies</label>
                  {isEditing ? (
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="3"
                      placeholder="List any known allergies"
                    />
                  ) : (
                    <div className="profile-value">{formData.allergies || 'None reported'}</div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">Medical Conditions</label>
                  {isEditing ? (
                    <textarea
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="3"
                      placeholder="List any ongoing medical conditions"
                    />
                  ) : (
                    <div className="profile-value">{formData.medicalConditions || 'None reported'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;