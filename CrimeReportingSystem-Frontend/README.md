# Online Crime Reporting System - Frontend

A modern React.js application for citizens to report crimes, track complaints, and communicate with law enforcement authorities.

## Features

- **User Authentication**: Secure login and registration
- **Crime Reporting**: Easy-to-use form to report crimes
- **Status Tracking**: Real-time complaint status tracking
- **User Dashboard**: View and manage your complaints
- **Role-Based UI**: Different interfaces for USER, POLICE, and ADMIN
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Protected Routes**: Secure access control

## Tech Stack

- React 18.2
- React Router 6
- Axios for API calls
- Tailwind CSS for styling
- React Icons
- Context API for state management

## Prerequisites

- Node.js 14+
- npm 6+ or yarn
- Backend API running on `http://localhost:8080`

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CrimeReportingSystem-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Endpoint

Edit `src/services/api.js` and ensure the BASE_URL matches your backend:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

### 4. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable React components
│   └── ProtectedRoute.js
├── pages/              # Page components
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── UserDashboard.js
│   └── ReportCrimePage.js
├── services/           # API services
│   └── api.js
├── context/            # React Context
│   └── AuthContext.js
├── hooks/              # Custom hooks
│   └── useAuth.js
├── styles/             # CSS modules
│   ├── Auth.module.css
│   └── Form.module.css
├── App.js              # Main App component
├── App.css
├── index.js
└── index.css

public/
├── index.html          # HTML entry point
└── manifest.json
```

## Key Components

### AuthContext

Manages user authentication state, login, logout, and token management.

```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### ProtectedRoute

Wraps protected routes to enforce authentication and authorization.

```javascript
<ProtectedRoute requiredRole="ROLE_USER">
  <Dashboard />
</ProtectedRoute>
```

### API Service

Centralized API calls with automatic token management.

```javascript
import { authAPI, complaintAPI } from "../services/api";

const response = await complaintAPI.registerComplaint(data);
```

## Pages

### LoginPage

- Email/Mobile and password authentication
- Error handling and validation
- Redirect based on user role

### RegisterPage

- User registration form
- Email and mobile validation
- Address information collection

### UserDashboard

- View complaint statistics
- List recent complaints
- Quick links to report crime

### ReportCrimePage

- Crime type selection
- Detailed description input
- Evidence file upload
- Priority and datetime selection

## API Integration

### Authentication Flow

1. **Register/Login** → Store tokens in localStorage
2. **API Requests** → Attach token in Authorization header
3. **Token Expired** → Refresh token or redirect to login
4. **Logout** → Clear tokens and redirect

### Error Handling

API errors are caught and displayed to users:

```javascript
try {
  const response = await authAPI.login(email, password);
} catch (error) {
  const message = error.response?.data?.message || "Error occurred";
}
```

## Styling

### Tailwind CSS

Inline utility classes for rapid styling:

```javascript
<div className="flex items-center justify-center min-h-screen bg-gray-50">
```

### CSS Modules

Scoped styles for components:

```css
.authCard {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

## Development

### Building

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

### Testing

```bash
npm test
```

Runs the test suite.

### Environment Variables

Create `.env` file for configuration:

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

## Features in Detail

### Registration

- Full name, email, mobile number
- Password validation (minimum 8 characters)
- Address and location information
- Form validation and error messages

### Login

- Email or mobile number login
- Password authentication
- Role-based redirect
- Remember me functionality (optional)

### Report Crime

- Crime type selection
- Detailed description
- Location and datetime
- Priority level
- Evidence file upload (up to 5 files, 10MB each)

### Track Complaint

- View complaint status
- Timeline of status changes
- Investigation notes
- Evidence files
- Contact information

### User Dashboard

- Statistics dashboard
- Recent complaints list
- Quick actions
- Profile management

## User Roles

### USER (Citizen)

- Register and report crimes
- Track complaint status
- View investigation notes
- Upload evidence

### POLICE

- View assigned complaints
- Update complaint status
- Add investigation notes
- Manage cases

### ADMIN

- View all complaints
- Manage users and police officers
- Assign cases to police stations
- View analytics and reports

## Security

- **JWT Token Storage**: Secure localStorage management
- **Protected Routes**: Authentication checks
- **Authorization**: Role-based access control
- **Input Validation**: Client-side validation
- **CORS**: Configured for backend communication

## Performance Optimization

- Code splitting with React Router
- Lazy loading of routes
- Memoization of components
- Image optimization
- CSS optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Build Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop 'build' folder to Netlify
```

## Testing

### Unit Tests

```bash
npm test
```

### E2E Testing

Update `.env` with production URL and test credentials

## Troubleshooting

### API Connection Issues

- Ensure backend is running on `http://localhost:8080`
- Check `src/services/api.js` for correct BASE_URL
- Verify CORS configuration in backend

### Authentication Errors

- Clear localStorage
- Login again
- Check token expiration time

### Token Expired

- Automatically refreshed on API call
- Manual refresh in settings
- Logout and login again

## Environment Setup

### Windows

```bash
set REACT_APP_API_URL=http://localhost:8080/api
npm start
```

### macOS/Linux

```bash
export REACT_APP_API_URL=http://localhost:8080/api
npm start
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## Future Enhancements

- [ ] Police Officer dashboard
- [ ] Admin analytics dashboard
- [ ] Real-time notifications
- [ ] Video upload for evidence
- [ ] Advanced search and filters
- [ ] Print complaint reports
- [ ] SMS notifications
- [ ] Multi-language support

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:

1. Check existing issues
2. Create detailed bug report
3. Include screenshots/logs
4. Contact support team

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Backend Required**: See Backend README for setup
