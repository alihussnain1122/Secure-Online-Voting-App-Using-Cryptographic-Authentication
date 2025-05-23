# 🗳️ Secure Online Voting App Using Cryptographic Authentication

A secure, scalable, and user-friendly online voting system built with cryptographic techniques to ensure privacy, authenticity, and integrity of votes.

---

## 🔍 Overview

This project enables voters to cast their votes securely from any location through a web-based application. The system uses CNIC and Voter ID authentication, encrypted data handling, and JWT-based session management.

---

## 🚀 Features

### 🔐 User Authentication

* Secure login using CNIC and Voter ID
* JWT tokens for stateless session management

### 🧍‍♂️ Profile Display

* Voter profile and image shown for visual identity confirmation before voting

### 🔒 Encrypted Voting

* Votes encrypted with AES algorithm to ensure data privacy
* Encrypted storage in MongoDB

### 🧱 Tamper-Proof Architecture

* Encrypted database storage to prevent data manipulation
* JWT ensures session integrity

### 📈 Real-Time Analytics

* Vote statistics with region-wise graphical representation
* Admin dashboard for viewing results and candidate performance

### 🧾 Vote Receipt & Certificate

* PDF vote receipt generation post voting
* Voting certificate issued for record-keeping

### 🌐 Secure Communication

* TLS/SSL certificate support for HTTPS
* Windows Firewall compatibility for added network security

### 🗺️ Location-Based Voting

* Logic to restrict or validate voting based on region or CNIC location

### 💬 Feedback System

* Users can submit experience feedback after voting

### 🎥 Video Instructions

* Integrated video guide for first-time digital voters

### 🧭 Multi-Language Support *(Planned)*

* Inclusive interface planned with `react-i18next`

---

## ⚙️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, GSAP
* **Backend:** Node.js, Express.js, MongoDB, JWT
* **Encryption:** AES for vote data, bcrypt for CNIC hashing
* **Storage:** MongoDB GridFS for image uploads

---

## 📂 Folder Structure

```
/server
  ├── controllers
  ├── models
  ├── routes
  ├── config
  └── middleware
/client
  ├── components
  ├── pages
  └── assets
```

---

## 📌 Future Enhancements

* Multi-language support
* Admin role separation (commissioner, observer)
* Blockchain-based vote tracking
* SMS/email verification

---

## 📜 License

MIT License

---

> "A nation’s voice is its vote—this app ensures that voice is encrypted, protected, and heard."
