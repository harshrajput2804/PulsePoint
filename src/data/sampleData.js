// Sample user data for demo purposes
export const sampleUsers = [
  {
    id: 1,
    name: 'John Patient',
    email: 'patient@demo.com',
    password: 'password123',
    role: 'patient',
    age: 35,
    gender: 'male',
    healthSummary: 'Generally healthy with occasional hypertension. Regular exercise routine.',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    emergencyContact: 'Jane Patient - (555) 987-6543',
    allergies: 'Penicillin, Shellfish',
    medicalConditions: 'Mild hypertension, Seasonal allergies',
    status: 'active'
  },
  {
    id: 2,
    name: 'Dr. Sarah Doctor',
    email: 'doctor@demo.com',
    password: 'password123',
    role: 'doctor',
    age: 42,
    gender: 'female',
    healthSummary: 'Healthcare professional',
    specialty: 'Cardiology',
    status: 'active'
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    age: 38,
    gender: 'male',
    healthSummary: 'System administrator',
    status: 'active'
  }
];

// Generate sample vitals data
const generateVitalsData = (userId, days = 30) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      id: Date.now() + i,
      userId: userId,
      date: date.toISOString().split('T')[0],
      bloodPressureHigh: 110 + Math.floor(Math.random() * 40),
      bloodPressureLow: 70 + Math.floor(Math.random() * 20),
      heartRate: 60 + Math.floor(Math.random() * 40),
      bloodSugar: 80 + Math.floor(Math.random() * 60),
      oxygenSaturation: 95 + Math.floor(Math.random() * 5),
      weight: 70 + Math.random() * 10,
      notes: i % 5 === 0 ? 'Feeling good today' : ''
    });
  }
  return data;
};

// Initialize sample data in localStorage if not exists
const initializeSampleData = () => {
  if (!localStorage.getItem('pulsepoint_vitals')) {
    const vitalsData = [];
    sampleUsers.forEach(user => {
      if (user.role === 'patient') {
        vitalsData.push(...generateVitalsData(user.id));
      }
    });
    localStorage.setItem('pulsepoint_vitals', JSON.stringify(vitalsData));
  }

  if (!localStorage.getItem('pulsepoint_medications')) {
    const medicationsData = [
      {
        id: 1,
        userId: 1,
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'daily',
        timing: '08:00',
        startDate: '2024-01-01',
        endDate: '',
        instructions: 'Take with water, preferably in the morning',
        status: 'active',
        nextDose: new Date().toISOString()
      },
      {
        id: 2,
        userId: 1,
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'daily',
        timing: '20:00',
        startDate: '2024-01-01',
        endDate: '',
        instructions: 'Take with food to avoid stomach upset',
        status: 'active',
        nextDose: new Date().toISOString()
      }
    ];
    localStorage.setItem('pulsepoint_medications', JSON.stringify(medicationsData));
  }

  if (!localStorage.getItem('pulsepoint_appointments')) {
    const appointmentsData = [
      {
        id: 1,
        userId: 1,
        doctorName: 'Sarah Smith',
        specialty: 'Cardiology',
        type: 'in-person',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        reason: 'Regular checkup and blood pressure monitoring',
        location: 'Cardiology Clinic, Room 205',
        status: 'scheduled'
      },
      {
        id: 2,
        userId: 1,
        doctorName: 'Michael Johnson',
        specialty: 'General Practice',
        type: 'video',
        date: new Date(Date.now() - 86400000 * 7).toISOString(), // Last week
        reason: 'Follow-up consultation',
        status: 'completed'
      }
    ];
    localStorage.setItem('pulsepoint_appointments', JSON.stringify(appointmentsData));
  }

  if (!localStorage.getItem('pulsepoint_medical_records')) {
    const recordsData = [
      {
        id: 1,
        userId: 1,
        title: 'Blood Test Results',
        category: 'lab-result',
        doctorName: 'Sarah Smith',
        date: '2024-01-10',
        description: 'Complete blood count and lipid panel',
        fileName: 'blood_test_jan2024.pdf',
        fileType: 'application/pdf',
        fileSize: 245760
      },
      {
        id: 2,
        userId: 1,
        title: 'Chest X-Ray',
        category: 'scan',
        doctorName: 'Michael Johnson',
        date: '2024-01-05',
        description: 'Routine chest X-ray - no abnormalities found',
        fileName: 'chest_xray_jan2024.jpg',
        fileType: 'image/jpeg',
        fileSize: 1048576
      }
    ];
    localStorage.setItem('pulsepoint_medical_records', JSON.stringify(recordsData));
  }
};

// Initialize data on module load
initializeSampleData();

// Data access functions
export const getVitalsData = (userId) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_vitals') || '[]');
  return data.filter(item => item.userId === userId);
};

export const saveVitalsData = (newVital) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_vitals') || '[]');
  data.push(newVital);
  localStorage.setItem('pulsepoint_vitals', JSON.stringify(data));
  return data.filter(item => item.userId === newVital.userId);
};

export const getMedications = (userId) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_medications') || '[]');
  return data.filter(item => item.userId === userId);
};

export const saveMedication = (newMedication) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_medications') || '[]');
  data.push(newMedication);
  localStorage.setItem('pulsepoint_medications', JSON.stringify(data));
  return data.filter(item => item.userId === newMedication.userId);
};

export const updateMedicationStatus = (medicationId, status) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_medications') || '[]');
  const updated = data.map(med => {
    if (med.id === medicationId) {
      const now = new Date().toISOString();
      if (status === 'taken') {
        med.takenDoses = [...(med.takenDoses || []), now];
      } else if (status === 'missed') {
        med.missedDoses = [...(med.missedDoses || []), now];
      }
    }
    return med;
  });
  localStorage.setItem('pulsepoint_medications', JSON.stringify(updated));
  return updated;
};

export const getAppointments = (userId) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_appointments') || '[]');
  return data.filter(item => item.userId === userId);
};

export const saveAppointment = (newAppointment) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_appointments') || '[]');
  data.push(newAppointment);
  localStorage.setItem('pulsepoint_appointments', JSON.stringify(data));
  return data.filter(item => item.userId === newAppointment.userId);
};

export const cancelAppointment = (appointmentId) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_appointments') || '[]');
  const updated = data.map(apt => 
    apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
  );
  localStorage.setItem('pulsepoint_appointments', JSON.stringify(updated));
  return updated;
};

export const getMedicalRecords = (userId) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_medical_records') || '[]');
  return data.filter(item => item.userId === userId);
};

export const saveMedicalRecord = (newRecord) => {
  const data = JSON.parse(localStorage.getItem('pulsepoint_medical_records') || '[]');
  data.push(newRecord);
  localStorage.setItem('pulsepoint_medical_records', JSON.stringify(data));
  return data.filter(item => item.userId === newRecord.userId);
};

export const getAllPatients = () => {
  return sampleUsers.filter(user => user.role === 'patient');
};

export const getAllUsers = () => {
  return sampleUsers;
};

export const savePrescription = (prescription) => {
  const medications = JSON.parse(localStorage.getItem('pulsepoint_medications') || '[]');
  const newMedication = {
    id: Date.now(),
    userId: prescription.patientId,
    name: prescription.medication,
    dosage: prescription.dosage,
    frequency: prescription.frequency,
    timing: '08:00',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: prescription.instructions,
    status: 'active',
    prescribedBy: prescription.doctorName,
    nextDose: new Date().toISOString()
  };
  medications.push(newMedication);
  localStorage.setItem('pulsepoint_medications', JSON.stringify(medications));
  return newMedication;
};

export const getUserActivityLogs = () => {
  return [
    {
      action: 'User Login',
      details: 'patient@demo.com logged in',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: 1
    },
    {
      action: 'Vitals Recorded',
      details: 'Blood pressure and heart rate logged',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      userId: 1
    },
    {
      action: 'Prescription Created',
      details: 'Dr. Smith created prescription for Lisinopril',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      userId: 2
    },
    {
      action: 'Appointment Scheduled',
      details: 'New appointment booked with Dr. Johnson',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      userId: 1
    },
    {
      action: 'Medical Record Uploaded',
      details: 'Blood test results uploaded',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      userId: 1
    }
  ];
};

export const exportSystemData = () => {
  return {
    users: getAllUsers(),
    vitals: JSON.parse(localStorage.getItem('pulsepoint_vitals') || '[]'),
    medications: JSON.parse(localStorage.getItem('pulsepoint_medications') || '[]'),
    appointments: JSON.parse(localStorage.getItem('pulsepoint_appointments') || '[]'),
    medicalRecords: JSON.parse(localStorage.getItem('pulsepoint_medical_records') || '[]'),
    exportDate: new Date().toISOString()
  };
};