import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Eye, Calendar, User } from 'lucide-react';
import { getMedicalRecords, saveMedicalRecord } from '../data/sampleData';

const MedicalRecords = ({ user }) => {
  const [records, setRecords] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'lab-result',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    const data = getMedicalRecords(user.id);
    setRecords(data);
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRecord = {
      id: Date.now(),
      userId: user.id,
      ...formData,
      fileName: selectedFile ? selectedFile.name : '',
      fileType: selectedFile ? selectedFile.type : '',
      fileSize: selectedFile ? selectedFile.size : 0,
      uploadedAt: new Date().toISOString()
    };

    const updatedRecords = saveMedicalRecord(newRecord);
    setRecords(updatedRecords);
    
    setFormData({
      title: '',
      category: 'lab-result',
      doctorName: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setSelectedFile(null);
    setShowUploadForm(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'lab-result': return '🧪';
      case 'prescription': return '💊';
      case 'scan': return '📷';
      case 'report': return '📄';
      default: return '📋';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const RecordCard = ({ record }) => (
    <div className="record-card">
      <div className="record-header">
        <div className="record-icon">
          {getCategoryIcon(record.category)}
        </div>
        <div className="record-info">
          <h4 className="record-title">{record.title}</h4>
          <p className="record-category">{record.category.replace('-', ' ')}</p>
        </div>
        <div className="record-actions">
          <button className="btn btn-outline btn-sm">
            <Eye size={14} />
            View
          </button>
          <button className="btn btn-outline btn-sm">
            <Download size={14} />
            Download
          </button>
        </div>
      </div>

      <div className="record-details">
        <div className="record-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{new Date(record.date).toLocaleDateString()}</span>
          </div>
          {record.doctorName && (
            <div className="meta-item">
              <User size={14} />
              <span>Dr. {record.doctorName}</span>
            </div>
          )}
          {record.fileName && (
            <div className="meta-item">
              <FileText size={14} />
              <span>{record.fileName} ({formatFileSize(record.fileSize)})</span>
            </div>
          )}
        </div>
        
        {record.description && (
          <p className="record-description">{record.description}</p>
        )}
      </div>
    </div>
  );

  const groupedRecords = records.reduce((groups, record) => {
    const category = record.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(record);
    return groups;
  }, {});

  return (
    <div className="medical-records-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Medical Records</h1>
          <button
            onClick={() => setShowUploadForm(true)}
            className="btn btn-primary"
          >
            <Upload size={20} />
            Upload Document
          </button>
        </div>

        {/* Records by Category */}
        {Object.keys(groupedRecords).length > 0 ? (
          Object.entries(groupedRecords).map(([category, categoryRecords]) => (
            <div key={category} className="category-section mb-8">
              <h2 className="category-title">
                {getCategoryIcon(category)} {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <span className="record-count">({categoryRecords.length})</span>
              </h2>
              <div className="records-grid">
                {categoryRecords.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No medical records yet</h3>
            <p>Upload your medical documents to keep them organized and accessible</p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="btn btn-primary mt-4"
            >
              <Upload size={20} />
              Upload First Document
            </button>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="modal-overlay" onClick={() => setShowUploadForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Upload Medical Document</h2>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="upload-form">
                <div className="file-upload-area">
                  <div className="upload-zone">
                    <Upload size={32} />
                    <p>Choose a file to upload</p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="file-input"
                    />
                  </div>
                  {selectedFile && (
                    <div className="selected-file">
                      <FileText size={16} />
                      <span>{selectedFile.name}</span>
                      <span className="file-size">({formatFileSize(selectedFile.size)})</span>
                    </div>
                  )}
                </div>

                <div className="input-group">
                  <label className="input-label">Document Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Blood Test Results"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="select-field"
                    >
                      <option value="lab-result">Lab Result</option>
                      <option value="prescription">Prescription</option>
                      <option value="scan">Medical Scan</option>
                      <option value="report">Medical Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Doctor Name (Optional)</label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Dr. Smith"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Brief description of the document"
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Upload Document
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

export default MedicalRecords;