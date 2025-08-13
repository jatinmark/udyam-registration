# Udyam Registration Portal Clone

A modern web application that replicates the first two steps of the Udyam registration process for Micro, Small, and Medium Enterprises (MSMEs) in India. Built with Next.js, TypeScript, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)

## 🚀 Features

- **Two-Step Registration Process**
  - Step 1: Aadhaar verification and validation
  - Step 2: PAN and business details collection
  
- **Real-time Form Validation**
  - Client-side validation for all fields
  - Server-side validation for data integrity
  - Duplicate checking for Aadhaar and PAN

- **Database Integration**
  - PostgreSQL database with Prisma ORM
  - Automatic registration number generation (UDYAM-YYYY-XXXXXX format)
  - Secure data storage with unique constraints

- **Responsive Design**
  - Mobile-first approach
  - Fully responsive UI with Tailwind CSS
  - Dark mode compatibility

- **User Experience**
  - Progress tracker for multi-step form
  - Success screen with registration details
  - Data persistence between form steps
  - Error handling with user-friendly messages

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher) or a cloud PostgreSQL service like [Supabase](https://supabase.com/)
- [Git](https://git-scm.com/)

## 📁 Project Structure

```
udyam-registration/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── udyam-registration/
│   │   │       └── route.ts         # API endpoints
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Main page component
│   │
│   ├── components/
│   │   ├── Step1Aadhaar.tsx        # Aadhaar verification step
│   │   ├── Step2PAN.tsx            # PAN & business details step
│   │   ├── ProgressTracker.tsx     # Progress indicator
│   │   └── RegistrationSuccess.tsx # Success screen
│   │
│   ├── data/
│   │   └── udyam-form-schema.json  # Form field configurations
│   │
│   └── utils/
│       └── validation.ts            # Validation utilities
│
├── prisma/
│   └── schema.prisma               # Database schema
│
├── public/                         # Static assets
├── tests/                          # Test files
├── .env.example                    # Environment variables template
├── package.json                    # Project dependencies
├── tailwind.config.js             # Tailwind CSS configuration
└── README.md                      # Project documentation
```

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/udyam-registration.git
cd udyam-registration
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following variables:

```env
# Database connection
# Format: postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public
DATABASE_URL="postgresql://username:password@localhost:5432/udyam_db?schema=public"

# For Supabase (recommended for quick setup):
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Server Port (optional, for backend server)
PORT=5000

# Frontend URL (for CORS, optional)
FRONTEND_URL=http://localhost:3000
```

### 4. Set up the database

Run Prisma migrations to create the database schema:

```bash
# Generate Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# (Optional) Run migrations in production
npx prisma migrate deploy
```

### 5. Seed the database (Optional)

If you want to add sample data:

```bash
npx prisma db seed
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```


## 🌐 API Endpoints

### POST `/api/udyam-registration`
Creates a new Udyam registration.

**Request Body:**
```json
{
  "aadhaar": "123456789012",
  "nameAsPerAadhaar": "John Doe",
  "typeOfOrganisation": "proprietorship",
  "pan": "ABCDE1234F",
  "mobile": "9876543210",
  "email": "john@example.com",
  "socialCategory": "general",
  "gender": "male",
  "speciallyAbled": "no",
  "nameOfEnterprise": "ABC Enterprises",
  "majorActivity": "manufacturing"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationNumber": "UDYAM-2024-123456",
    "registrationDate": "2024-01-01T00:00:00Z",
    "id": 1
  }
}
```

### GET `/api/udyam-registration`
Retrieves registration(s) based on query parameters.

**Query Parameters:**
- `registrationNumber` - Get specific registration
- `aadhaar` - Get registration by Aadhaar
- No parameters - Get all registrations (limited to 100)


## 🔧 Configuration

### Database Schema

The application uses a PostgreSQL database with the following main table:

```prisma
model UdyamRegistration {
  id                  Int      @id @default(autoincrement())
  aadhaar            String   @unique
  nameAsPerAadhaar   String
  typeOfOrganisation String
  pan                String   @unique
  mobile             String
  email              String
  socialCategory     String
  gender             String
  speciallyAbled     Boolean
  nameOfEnterprise   String
  majorActivity      String
  registrationNumber String   @unique
  registrationDate   DateTime @default(now())
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

## 🧪 Testing

The project includes comprehensive test coverage:

- **Unit Tests**: Validation functions, utilities
- **Component Tests**: Form components, user interactions
- **API Tests**: Endpoint functionality, error handling
- **Integration Tests**: Database operations

Run tests with:
```bash
npm test
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js:
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS EC2/ECS
- Google Cloud Run

## 🔒 Security Considerations

- All inputs are validated on both client and server
- SQL injection prevention through Prisma ORM
- Environment variables for sensitive data
- Unique constraints on Aadhaar and PAN
- CORS configuration for API security

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the official [Udyam Registration Portal](https://udyamregistration.gov.in/)
- Built as an educational project to demonstrate full-stack development skills
- Thanks to all contributors and the open-source community

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/udyam-registration](https://github.com/yourusername/udyam-registration)

## 🐛 Known Issues

- File upload functionality for documents is not yet implemented
- Email notifications are currently simulated
- OTP verification is bypassed for demo purposes

## 🚀 Future Enhancements

- [ ] Add remaining registration steps (3-5)
- [ ] Implement file upload for documents
- [ ] Add email/SMS notifications
- [ ] Create admin dashboard
- [ ] Add data export functionality
- [ ] Implement real OTP verification
- [ ] Add multi-language support
- [ ] Generate PDF certificates

---

**Note**: This is a demonstration project created for educational purposes and is not affiliated with the official Udyam Registration Portal by the Government of India.
