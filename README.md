# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace application where clients can post jobs and freelancers can submit bids. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Core Features
- ✅ **Secure Authentication**: JWT-based authentication with HttpOnly cookies
- ✅ **Role Flexibility**: Users can be both clients (post jobs) and freelancers (submit bids)
- ✅ **Job Management**: Full CRUD operations for job postings
- ✅ **Bidding System**: Freelancers can submit bids with custom messages and prices
- ✅ **Search Functionality**: Search jobs by title
- ✅ **Hiring Logic**: Atomic hiring process using MongoDB transactions

### Bonus Features (Implemented)
- ✅ **Transactional Integrity**: MongoDB transactions prevent race conditions during hiring
- ✅ **Real-time Notifications**: Socket.io integration for instant hiring notifications
- ✅ **Professional UI**: Clean, responsive design with Tailwind CSS
- ✅ **State Management**: Redux Toolkit for predictable state management

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io-client** for real-time features
- **Tailwind CSS** for styling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcryptjs** for password hashing
- **Socket.io** for real-time communication
- **Cookie-parser** for HttpOnly cookies

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd GigFlow
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file (use .env.example as reference)
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# Example:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/gigflow
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development
# CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create .env file (use .env.example as reference)
cp .env.example .env

# Update .env with your API URL
# VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB
Make sure MongoDB is running on your local machine or use MongoDB Atlas.

### 5. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - Get all open gigs (with optional search query)
- `GET /api/gigs/:id` - Get single gig
- `GET /api/gigs/my/jobs` - Get user's posted jobs
- `POST /api/gigs` - Create new gig (Protected)
- `PUT /api/gigs/:id` - Update gig (Protected, Owner only)
- `DELETE /api/gigs/:id` - Delete gig (Protected, Owner only)

### Bids
- `POST /api/bids` - Submit a bid (Protected)
- `GET /api/bids/:gigId` - Get all bids for a gig (Protected, Owner only)
- `GET /api/bids/my/bids` - Get user's submitted bids (Protected)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (Protected, Owner only)

## 🔐 Security Features

1. **HttpOnly Cookies**: JWT tokens stored in HttpOnly cookies prevent XSS attacks
2. **Password Hashing**: Bcrypt with salt rounds for secure password storage
3. **Protected Routes**: Middleware-based authentication for sensitive endpoints
4. **CORS Configuration**: Properly configured CORS for cross-origin requests
5. **Input Validation**: Server-side validation for all user inputs

## 🎯 Key Implementation Details

### Atomic Hiring Logic
The hiring process uses MongoDB transactions to ensure data consistency:
1. Updates gig status to "assigned"
2. Marks selected bid as "hired"
3. Rejects all other pending bids
4. All operations are atomic - either all succeed or all fail

```javascript
// Transaction ensures no race conditions
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Update gig
  await Gig.findByIdAndUpdate(gigId, { status: 'assigned' }, { session });
  // Update selected bid
  await Bid.findByIdAndUpdate(bidId, { status: 'hired' }, { session });
  // Reject other bids
  await Bid.updateMany({ gig: gigId, _id: { $ne: bidId } }, 
    { status: 'rejected' }, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
}
```

### Real-time Notifications
Socket.io implementation for instant notifications:
- Freelancers receive real-time notifications when hired
- No page refresh required
- Toast-style notifications with auto-dismiss

## 📱 User Flow

1. **Registration/Login**: Users create an account or log in
2. **Browse Jobs**: View all open job postings
3. **Submit Bids**: Freelancers can bid on jobs they're interested in
4. **Post Jobs**: Clients can create new job postings
5. **Review Bids**: Job owners can view all submitted bids
6. **Hire Freelancer**: Client selects and hires the best bid
7. **Real-time Notification**: Hired freelancer receives instant notification
8. **Track Progress**: Users can view their posted jobs and submitted bids

## 🎨 UI Features

- Responsive design for all screen sizes
- Loading states and error handling
- Toast notifications for important actions
- Clean, modern interface with Tailwind CSS
- Intuitive navigation and user experience

## 🧪 Testing the Hiring Flow

1. Create two user accounts (User A and User B)
2. Login as User A and post a job
3. Login as User B and submit a bid on User A's job
4. Login as User A and navigate to "My Jobs"
5. Click "View Bids" on your posted job
6. Click "Hire This Freelancer" on User B's bid
7. User B will receive a real-time notification (if logged in)

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables (VITE_API_URL)

### MongoDB Atlas
1. Create a free cluster
2. Get connection string
3. Update MONGODB_URI in backend .env

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

This is an internship assignment project. For questions or suggestions, please reach out.

## 📄 License

MIT

## 👨‍💻 Author

Created as part of the Full Stack Development Internship Assignment

---

**Note**: This project implements all required features plus both bonus features (MongoDB Transactions for race condition handling and Socket.io for real-time notifications).
