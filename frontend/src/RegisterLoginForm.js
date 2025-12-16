// import React, { useState } from 'react';

// function RegisterLoginForm() {
//   // State for phone OTP
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpPassword, setOtpPassword] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpSuccess, setOtpSuccess] = useState(false);
//   const [message, setMessage] = useState('');

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  
//   // Send OTP to backend
//   const sendOtp = async () => {
//     setMessage(''); setOtpSuccess(false);
//     if (!phone.match(/^\d{10}$/)) {
//       setMessage("Please enter a valid 10-digit mobile number");
//       return;
//     }
//     const response = await fetch('http://localhost:8080/api/auth/sendOtp', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ phone }),
//     });
//     const text = await response.text();
//     setMessage(text);
//     if (text === "OTP sent") setOtpSent(true);
//   };

//   // Verify OTP and create user
//   const verifyOtp = async () => {
//     setMessage(''); setOtpSuccess(false);
//     if (!otp || !otpPassword) {
//       setMessage("Enter OTP and a password.");
//       return;
//     }
//     const response = await fetch('http://localhost:8080/api/auth/verifyOtp', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ phone, otp, password: otpPassword }),
//     });
//     const text = await response.text();
//     setMessage(text);
//     if (text === "Registration successful") {
//       setOtpSuccess(true);
//       setOtpSent(false);
//       setPhone(''); setOtp(''); setOtpPassword('');
//     }
//   };

//   const apiUrl = 'http://localhost:8080/api/auth';

//   const handleRegister = async () => {
//     const response = await fetch(`${apiUrl}/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     const text = await response.text();
//     setMessage(text);
//   };

//   const handleLogin = async () => {
//     const response = await fetch(`${apiUrl}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });
//     const text = await response.text();
//     setMessage(text);
//   };

//   const handleGoogleLogin = () => {
//     window.location.href = 'http://localhost:8080/oauth2/authorization/google';
//   };

//   const handleGithubLogin = () => {
//     window.location.href = 'http://localhost:8080/oauth2/authorization/github';
//   };

//   return (
//     <div style={{ maxWidth: 350, margin: '40px auto', border: "1px solid #ccc", padding: 16, borderRadius: 10 }}>
//       <h2>InsurAI Auth</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//       /><br/>
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//       /><br/>
//       <button onClick={handleRegister}>Register</button>
//       <button onClick={handleLogin}>Login</button>
//       <p>{message}</p>
      
//       {/* ...existing form */}
//       <button onClick={handleGoogleLogin}>Register with Google</button>
//       <button onClick={handleGithubLogin}>Register with GitHub</button>
    
//       <h2>Register with Mobile (OTP)</h2>
//       <input
//         type="text"
//         placeholder="Mobile Number"
//         value={phone}
//         onChange={e => setPhone(e.target.value)}
//         maxLength={10}
//         disabled={otpSent}
//       /><br /><br />
//       {!otpSent && (
//         <button onClick={sendOtp}>Send OTP</button>
//       )}
//       {otpSent && (
//         <>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={e => setOtp(e.target.value)}
//             maxLength={6}
//             style={{ marginRight: 8 }}
//           /><br /><br />
//           <input
//             type="password"
//             placeholder="Set Password"
//             value={otpPassword}
//             onChange={e => setOtpPassword(e.target.value)}
//           /><br /><br />
//           <button onClick={verifyOtp}>Verify & Register</button>
//         </>
//       )}
//       {otpSuccess && (
//         <div style={{ color: 'green', marginTop: 10 }}>You registered with mobile!</div>
//       )}
//       <div style={{ color: message === "Registration successful" ? "green" : "crimson", marginTop: 10 }}>{message}</div>
//       <hr />
//       {/* Optionally show your basic email/password register/login here for reference */}
//     </div>
//   );
// }

// export default RegisterLoginForm;
