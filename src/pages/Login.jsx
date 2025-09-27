import React, { useState } from 'react';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { sampleUsers } from '../data/sampleData';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!formData.age || formData.age < 1) {
        newErrors.age = 'Please enter a valid age';
      }
      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isLogin) {
      // Check against sample users for demo purposes
      const user = sampleUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );
      
      if (user) {
        onLogin({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
          gender: user.gender,
          healthSummary: user.healthSummary
        });
      } else {
        setErrors({ email: 'Invalid email or password' });
      }
    } else {
      // Register new user
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        age: parseInt(formData.age),
        gender: formData.gender,
        healthSummary: 'New user - health data being collected'
      };
      onLogin(newUser);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Heart className="logo-icon" size={32} />
            <h1>PulsePoint</h1>
          </div>
          <p className="login-subtitle">Your Personal Health Tracker</p>
        </div>

        <div className="login-tabs">
          <button
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`input-field ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label className="input-label">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`input-field ${errors.age ? 'error' : ''}`}
                    placeholder="Age"
                    min="1"
                    max="120"
                  />
                  {errors.age && <span className="error-text">{errors.age}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`select-field ${errors.gender ? 'error' : ''}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="select-field"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input-field ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input-field ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary login-submit">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        {isLogin && (
          <div className="demo-credentials">
            <h4>Demo Credentials:</h4>
            <div className="demo-users">
              <div className="demo-user">
                <strong>Patient:</strong> patient@demo.com / password123
              </div>
              <div className="demo-user">
                <strong>Doctor:</strong> doctor@demo.com / password123
              </div>
              <div className="demo-user">
                <strong>Admin:</strong> admin@demo.com / password123
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;