import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateRegistrationNumber(): string {
  const prefix = 'UDYAM';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}-${year}-${randomNum}`;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'aadhaar', 'nameAsPerAadhaar', 'typeOfOrganisation',
      'pan', 'mobile', 'email', 'socialCategory', 
      'gender', 'speciallyAbled', 'nameOfEnterprise', 'majorActivity'
    ];
    
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if Aadhaar or PAN already exists
    const existingAadhaar = await prisma.udyamRegistration.findUnique({
      where: { aadhaar: data.aadhaar }
    });
    
    if (existingAadhaar) {
      return NextResponse.json(
        { error: 'This Aadhaar number is already registered' },
        { status: 400 }
      );
    }
    
    const existingPAN = await prisma.udyamRegistration.findUnique({
      where: { pan: data.pan }
    });
    
    if (existingPAN) {
      return NextResponse.json(
        { error: 'This PAN is already registered' },
        { status: 400 }
      );
    }
    
    // Generate unique registration number
    let registrationNumber = generateRegistrationNumber();
    let isUnique = false;
    
    while (!isUnique) {
      const existing = await prisma.udyamRegistration.findUnique({
        where: { registrationNumber }
      });
      if (!existing) {
        isUnique = true;
      } else {
        registrationNumber = generateRegistrationNumber();
      }
    }
    
    // Create new registration
    const registration = await prisma.udyamRegistration.create({
      data: {
        aadhaar: data.aadhaar,
        nameAsPerAadhaar: data.nameAsPerAadhaar,
        typeOfOrganisation: data.typeOfOrganisation,
        pan: data.pan,
        mobile: data.mobile,
        email: data.email,
        socialCategory: data.socialCategory,
        gender: data.gender,
        speciallyAbled: data.speciallyAbled === 'yes' || data.speciallyAbled === true,
        nameOfEnterprise: data.nameOfEnterprise,
        majorActivity: data.majorActivity,
        registrationNumber
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        registrationNumber: registration.registrationNumber,
        registrationDate: registration.registrationDate,
        id: registration.id
      }
    });
    
  } catch (error) {
    console.error('Error saving registration:', error);
    return NextResponse.json(
      { error: 'Failed to save registration' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationNumber = searchParams.get('registrationNumber');
    const aadhaar = searchParams.get('aadhaar');
    
    let registration;
    
    if (registrationNumber) {
      registration = await prisma.udyamRegistration.findUnique({
        where: { registrationNumber }
      });
    } else if (aadhaar) {
      registration = await prisma.udyamRegistration.findUnique({
        where: { aadhaar }
      });
    } else {
      // Return all registrations (with pagination in production)
      const registrations = await prisma.udyamRegistration.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return NextResponse.json({ success: true, data: registrations });
    }
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: registration });
    
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}