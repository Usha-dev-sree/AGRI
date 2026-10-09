# AgriValue AI — An AI-Powered Agricultural Waste-to-Value and Marketplace Platform

[![React](https://img.shields.io/badge/Frontend-React_19-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![FastAPI](https://img.shields.io/badge/AI_Microservice-FastAPI_Python-teal.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/Project-B.Tech_Major_Project-orange.svg)]()

> **Final Project Definition**: An AI-powered software platform that identifies agricultural waste using Computer Vision, recommends optimized waste-to-value pathways using a multi-criteria scoring algorithm, and connects farmers with verified industrial processors through a digital marketplace.

---

## 🌾 Project Highlights

- **100% Software-Based**: Zero IoT devices or sensors required.
- **3 Stakeholder Portals**: 👨🌾 Farmer, 🏭 Industrial Processor, 👨💼 Executive Admin.
- **10 Core Functional Modules**: Authentication, Farm Management, Crop Cycles, Waste Logging, AI Vision Scanner, Recommendation Engine, Waste Marketplace, Matching Engine, 6-Stage Pickup Logistics, ESG Carbon Analytics.
- **12 Normalized MongoDB Collections**: Users, Farms, Crops, WasteReports, Recommendations, Pathways, Processors, Requirements, MarketplaceListings, Matches, PickupRequests, Transactions, AuditLogs.
- **Instant Viva Demo Switcher**: 1-click role switcher in the top navbar to seamlessly demonstrate all 3 roles during exams.

---

## 🏗️ System Architecture

```
                 ┌──────────────────────────────────────┐
                 │       AgriValue AI React Client      │
                 │  - Farmer Portal  - Processor Hub    │
                 │  - Admin CRM      - Recharts & Maps  │
                 └──────────────────┬───────────────────┘
                                    │ HTTP / REST / JWT
                                    ▼
                 ┌──────────────────────────────────────┐
                 │      Node.js + Express Backend       │
                 │  - Auth & Role Guards                │
                 │  - Marketplace Matchmaker            │
                 │  - Logistics & Audit Ledger          │
                 └──────────┬─────────────────┬─────────┘
                            │                 │
              Mongoose CRUD │                 │ Axios Proxy
                            ▼                 ▼
                 ┌────────────────────┐ ┌────────────────────┐
                 │  MongoDB Database  │ │ Python FastAPI AI  │
                 │  - 12 Collections  │ │ - MobileNetV3      │
                 │  - Pre-seeded Data │ │ - Multi-Scorer     │
                 └────────────────────┘ └────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (Tested on v24.3.0)
- **Python**: v3.10+ (Tested on v3.11.3)
- **MongoDB**: (Local MongoDB or Atlas connection; built-in high-performance mock store auto-activates if MongoDB is offline)

### Option 1: 1-Click Windows Launcher
Double-click `start_agrivalue.bat` in the root folder. It will launch the Node backend, Python AI service, and React frontend simultaneously.

### Option 2: Manual Terminal Startup

1. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start Python AI Microservice**:
   ```bash
   cd ai-service
   pip install fastapi uvicorn python-multipart pillow numpy scikit-learn
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   # AI Service runs on http://127.0.0.1:8000
   ```

3. **Start React Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   # React Client runs on http://localhost:5173
   ```

---

## 🔑 Pre-Configured Demo Accounts for Project Viva

| Role | Email | Password | Pre-seeded Persona |
|---|---|---|---|
| 👨🌾 **Farmer** | `farmer@agrivalue.ai` | `agri123` | Ramesh Kumar (Green Valley Farm, Nalgonda) |
| 🏭 **Processor** | `processor@agrivalue.ai` | `agri123` | Priya Reddy (BioEnergy Renewable Fuels Ltd, Hyd) |
| 👨💼 **Admin** | `admin@agrivalue.ai` | `agri123` | Dr. K. Rao (Chief Agricultural Tech Officer) |

*(You can also simply click the **"Viva Role"** buttons in the top navbar to switch roles in 1 click!)*

---

## 🧠 AI Models & Mathematical Algorithms

### 1. Computer Vision Residue Classifier (MobileNetV3)
- **Supported Classes**: Rice Straw, Wheat Straw, Cotton Stalk, Maize Residue, Tomato Residue, Sugarcane Bagasse, Groundnut Residue.
- **Explainability**: Returns Top-3 predicted classes with Softmax probability percentages and inference latency ($ms$).

### 2. Multi-Criteria Waste-to-Value Scoring Formula
$$\text{Score} = (0.30 \times C_{\text{compat}}) + (0.20 \times D_{\text{market}}) + (0.15 \times Q_{\text{suit}}) + (0.15 \times V_{\text{econ}}) + (0.10 \times G_{\text{geo}}) + (0.10 \times E_{\text{carbon}})$$

### 3. Haversine Spatial Distance Matching Formula
$$d = 2R \times \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lng}}{2}\right)}\right)$$

---

## 🎓 Viva / Project Review Quick Reference

1. **Why MERN + Python instead of pure Python or pure Node.js?**  
   *Separation of Concerns: Node.js delivers high-throughput non-blocking I/O for marketplace transactions, while Python FastAPI handles deep learning image tensors and scientific NumPy calculations.*

2. **How does the AI Scanner differentiate residue from raw produce?**  
   *The MobileNetV3 model is fine-tuned on crop residue features (straw, stalks, bagasse, vines) and evaluates texture, color profiles, and fiber distribution.*

3. **How is stubble burning prevented?**  
   *By giving farmers immediate economic value ($\approx ₹4,000-₹8,000/\text{Ton}$) and scheduling verified buyers with automated transport pickup.*

---
*AgriValue AI — Developed for B.Tech Major Project*
