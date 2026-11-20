# LeadFlow – Lead Management CRM

LeadFlow is a full-stack Lead Management CRM application built using the MERN stack. It allows users to manage, organize, track, and monitor their business leads through a modern and responsive dashboard.

## Features

### Authentication
- User signup and login
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected routes
- User-specific lead access

### Lead Management
- Create, view, update, and delete leads
- Lead information: Name, Email, Phone, Company
- Lead source selection
- Lead status management
- Delete confirmation

### Search, Filters & Pagination
- Search by name, email, phone, and company
- Filter by lead status
- Filter by lead source
- Sort by newest, oldest, and name
- Pagination

### Dashboard
- Total leads overview
- New leads count
- Contacted leads count
- Qualified leads count
- Lost leads count

### User Interface
- Modern and responsive CRM dashboard
- Sidebar navigation
- Toast notifications
- Loading and empty states
- Mobile, tablet, and desktop support

## Tech Stack

**Frontend**
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React
- React Hot Toast

**Backend**
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

## Project Structure

```text
Lead-Manager/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_random_secret
```

Start the backend:

```bash
npm run dev
```

If the development script is unavailable:

```bash
node index.js
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm start
```

## API Endpoints

Base URL: `/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/signin` | Login user |
| GET | `/auth/me` | Get authenticated user |

### Leads

| Method | Endpoint | Description |
|---|---|---|
| GET | `/leads` | Get all user's leads |
| POST | `/leads` | Create a new lead |
| PUT | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead |

Protected endpoints require a valid JWT Bearer token.

## Lead Statuses
- New
- Contacted
- Qualified
- Lost

## Lead Sources
- Website
- Referral
- Social Media
- Other

## Security
- Passwords are hashed before being stored.
- JWT authentication protects private API routes.
- Users can access and manage only their own leads.
- Environment variables are excluded from version control.

## Future Improvements
- Automated API testing
- Advanced analytics and reporting
- Export leads to CSV
- Server-side pagination and filtering

## Author

Developed as a Full Stack Developer assignment using the MERN stack.