import './signup.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [fullName, setFullName] = useState('');  // Updated to match backend naming
    const [idNumber, setIdNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [currency, setCurrency] = useState('');
    const [provider, setProvider] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        axios.post('https://localhost:3000/payments', {
            fullName,  // Updated to match backend field names
            idNumber,
            accountNumber,
            swiftCode,
            paymentAmount,
            currency,
            provider,
        })
        .then(response => {
            alert('Payment successfull!');
            navigate('/paymentportal');  // Navigates to the home page on success
        })
        .catch(err => {
            console.error('Error:', err.response ? err.response.data : err.message);
            alert('Payment failed. Please try again.');
        });
    };

    return (
        <div id="payment-form-container">
            <form onSubmit={handleSignup}>
                <h1 id="signup-heading">Payment</h1>

                <div>
                    <label>Full Name: </label>
                    <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>ID Number: </label>
                    <input 
                        type="text" 
                        value={idNumber} 
                        onChange={(e) => setIdNumber(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Account Number: </label>
                    <input 
                        type="text" 
                        value={accountNumber} 
                        onChange={(e) => setAccountNumber(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Currency: </label>
                    <input 
                        type="text" 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Amount: </label>
                    <input 
                        type="number" 
                        value={paymentAmount} 
                        onChange={(e) => setPaymentAmount(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Provider: </label>
                    <input 
                        type="text" 
                        value={provider} 
                        onChange={(e) => setProvider(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Swift Code: </label>
                    <input 
                        type="text" 
                        value={swiftCode} 
                        onChange={(e) => setSwiftCode(e.target.value)} 
                        required 
                    />
                </div>

                <button className="App-button">Pay Now</button>
            </form>
        </div>
    );
};

export default Payment;
