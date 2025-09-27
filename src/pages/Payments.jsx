import React, { useState } from 'react';
import { CreditCard, Download, Calendar, CheckCircle } from 'lucide-react';

const Payments = ({ user }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    description: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [paymentHistory] = useState([
    {
      id: 1,
      amount: 150.00,
      description: 'Consultation - Dr. Smith',
      date: '2024-01-15',
      status: 'paid',
      invoiceId: 'INV-001'
    },
    {
      id: 2,
      amount: 75.00,
      description: 'Lab Tests - Blood Panel',
      date: '2024-01-10',
      status: 'paid',
      invoiceId: 'INV-002'
    },
    {
      id: 3,
      amount: 200.00,
      description: 'Cardiology Consultation',
      date: '2024-01-05',
      status: 'paid',
      invoiceId: 'INV-003'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Simulate payment processing
    setTimeout(() => {
      setShowPaymentForm(false);
      setPaymentData({
        amount: '',
        description: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      });
      
      // Generate and download invoice
      generateInvoice();
    }, 2000);
  };

  const generateInvoice = () => {
    // Simple invoice generation
    const invoiceData = {
      invoiceId: `INV-${Date.now()}`,
      amount: parseFloat(paymentData.amount),
      description: paymentData.description,
      date: new Date().toISOString(),
      patient: user.name
    };

    const invoiceContent = `
PULSEPOINT HEALTHCARE
Invoice #${invoiceData.invoiceId}

Patient: ${invoiceData.patient}
Date: ${new Date().toLocaleDateString()}
Description: ${invoiceData.description}
Amount: $${invoiceData.amount.toFixed(2)}

Payment Status: PAID
Payment Method: Credit Card ending in ${paymentData.cardNumber.slice(-4)}

Thank you for your payment!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadInvoice = (invoiceId) => {
    const invoiceContent = `
PULSEPOINT HEALTHCARE
Invoice #${invoiceId}

Thank you for your payment!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="payments-page fade-in">
      <div className="container">
        <div className="page-header">
          <h1>Payments & Billing</h1>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="btn btn-primary"
          >
            <CreditCard size={20} />
            Make Payment
          </button>
        </div>

        <div className="grid grid-cols-1 grid-lg-3 gap-8">
          {/* Payment Summary */}
          <div className="payment-summary">
            <div className="card">
              <h3 className="card-title">Payment Summary</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="summary-label">Total Paid This Year</span>
                  <span className="summary-value">$425.00</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Outstanding Balance</span>
                  <span className="summary-value text-warning">$0.00</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Last Payment</span>
                  <span className="summary-value">Jan 15, 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="payment-history">
            <div className="card">
              <h3 className="card-title">Payment History</h3>
              <div className="payment-list">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-info">
                      <div className="payment-description">{payment.description}</div>
                      <div className="payment-date">
                        <Calendar size={14} />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="payment-amount">${payment.amount.toFixed(2)}</div>
                    <div className="payment-actions">
                      <CheckCircle size={16} className="payment-status-icon" />
                      <button
                        onClick={() => downloadInvoice(payment.invoiceId)}
                        className="btn btn-outline btn-sm"
                      >
                        <Download size={14} />
                        Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="modal-overlay" onClick={() => setShowPaymentForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Make Payment</h2>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="input-group">
                  <label className="input-label">Amount ($)</label>
                  <input
                    type="number"
                    name="amount"
                    value={paymentData.amount}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={paymentData.description}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Consultation fee"
                    required
                  />
                </div>

                <div className="payment-divider">
                  <span>Payment Information</span>
                </div>

                <div className="input-group">
                  <label className="input-label">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label className="input-label">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CreditCard size={16} />
                    Process Payment
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

export default Payments;