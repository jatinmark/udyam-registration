const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Validate Aadhaar endpoint
app.post('/api/validate-aadhaar', async (req, res) => {
  try {
    const { aadhaar, nameAsPerAadhaar } = req.body;
    
    // Validate Aadhaar format
    if (!aadhaar || !/^\d{12}$/.test(aadhaar)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar number format'
      });
    }
    
    // Validate name
    if (!nameAsPerAadhaar || !/^[a-zA-Z\s\.]+$/.test(nameAsPerAadhaar)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid name format'
      });
    }
    
    // In production, this would integrate with UIDAI API
    // For demo, we'll simulate OTP generation
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in session/cache (simplified for demo)
    // In production, use Redis or similar
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      // Don't send OTP in production - this is for demo only
      demoOTP: otp
    });
  } catch (error) {
    console.error('Error validating Aadhaar:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { otp, aadhaar } = req.body;
    
    // Validate OTP format
    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format'
      });
    }
    
    // In production, verify OTP from cache/session
    // For demo, any 6-digit OTP is valid
    
    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Submit registration endpoint
app.post('/api/submit-registration', async (req, res) => {
  try {
    const {
      // Step 1 data
      aadhaar,
      nameAsPerAadhaar,
      
      // Step 2 data
      typeOfOrganisation,
      pan,
      mobile,
      email,
      socialCategory,
      gender,
      speciallyAbled,
      nameOfEnterprise,
      majorActivity
    } = req.body;
    
    // Validate required fields
    const requiredFields = {
      aadhaar: /^\d{12}$/,
      nameAsPerAadhaar: /^[a-zA-Z\s\.]+$/,
      pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      mobile: /^[6-9]\d{9}$/,
      email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };
    
    for (const [field, pattern] of Object.entries(requiredFields)) {
      if (!req.body[field] || !pattern.test(req.body[field])) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${field} format`,
          field
        });
      }
    }
    
    // Check other required fields
    if (!typeOfOrganisation || !socialCategory || !gender || 
        !speciallyAbled || !nameOfEnterprise || !majorActivity) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Save to database
    const registration = await prisma.udyamRegistration.create({
      data: {
        aadhaar,
        nameAsPerAadhaar,
        typeOfOrganisation,
        pan,
        mobile,
        email,
        socialCategory,
        gender,
        speciallyAbled: speciallyAbled === 'Yes',
        nameOfEnterprise,
        majorActivity,
        registrationNumber: `UDYAM-${Date.now()}`, // Generate unique registration number
        registrationDate: new Date()
      }
    });
    
    res.json({
      success: true,
      message: 'Registration submitted successfully',
      registrationNumber: registration.registrationNumber,
      data: registration
    });
  } catch (error) {
    console.error('Error submitting registration:', error);
    
    // Check for unique constraint violations
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'A registration with this Aadhaar or PAN already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get registration by ID
app.get('/api/registration/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const registration = await prisma.udyamRegistration.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }
    
    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});