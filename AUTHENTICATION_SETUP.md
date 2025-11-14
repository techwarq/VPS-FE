# Authentication Setup Guide

## ✅ What's Been Created

### 1. **Authentication Service** (`/src/services/auth.service.ts`)
Complete authentication service with:
- Email/Password registration and login
- Google OAuth login
- Token management
- Profile management
- Protected API calls

### 2. **Sign In Page** (`/src/app/signin/page.tsx`)
Beautiful glassmorphism sign-in page with:
- Email/Password login form
- Google OAuth button
- Form validation
- Error handling
- Animated backgrounds
- Link to sign up page

### 3. **Sign Up Page** (`/src/app/signup/page.tsx`)
Beautiful glassmorphism sign-up page with:
- Full registration form (Name, Email, Password)
- Password confirmation
- Google OAuth button
- Form validation
- Error handling
- Animated backgrounds
- Link to sign in page

### 4. **Protected Route Component** (`/src/components/auth/ProtectedRoute.tsx`)
Wrapper component to protect routes requiring authentication

## 🚀 How to Use

### Access the Pages
- **Sign In**: Navigate to `/signin`
- **Sign Up**: Navigate to `/signup`

### Protect a Route
Wrap any page that requires authentication:

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <YourProtectedContent />
    </ProtectedRoute>
  );
}
```

### Check Authentication Status
```typescript
import { AuthService } from '@/services/auth.service';

// Check if user is logged in
const isLoggedIn = AuthService.isAuthenticated();

// Get current user
const user = AuthService.getUser();

// Logout
AuthService.logout();
```

### Make Authenticated API Calls
```typescript
import { AuthService } from '@/services/auth.service';

const response = await AuthService.authenticatedFetch(
  'http://localhost:4000/api/photoshoot/models',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ /* your data */ })
  }
);
```

## 📦 Optional: Google OAuth Setup

To enable full Google OAuth functionality:

1. **Install the package:**
```bash
npm install @react-oauth/google
```

2. **Update `src/app/layout.tsx`:**
```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '830525870730-26k9e3g8clnkhrh6oi9en1rg55i69d4h.apps.googleusercontent.com';

export default function RootLayout({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </GoogleOAuthProvider>
  );
}
```

3. **Update the Google buttons in signin/signup pages** with the proper GoogleLogin component from the library.

## 🎨 Design Features

- **Emerald Glassmorphism Theme**: Matches your existing design
- **Smooth Animations**: Framer Motion animations on all elements
- **Form Validation**: Real-time error handling
- **Responsive**: Works on all screen sizes
- **Loading States**: Beautiful loading indicators
- **Auto-redirect**: Successful login redirects to `/generate-2`

## 🔐 Backend Integration

The authentication system connects to:
- **Backend URL**: `http://localhost:4000/api`
- **Endpoints**:
  - POST `/auth/register` - Register new user
  - POST `/auth/login` - Login with email/password
  - POST `/auth/google` - Login with Google
  - GET `/auth/me` - Get current user
  - PUT `/auth/profile` - Update profile
  - PUT `/auth/password` - Change password

## 🔑 JWT Token Flow

1. User logs in successfully
2. Backend returns JWT token
3. Token stored in localStorage
4. Token automatically included in all API calls via `Authorization: Bearer <token>` header
5. Backend extracts `userId` from token automatically

## 🎯 Routes Created

- `/signin` - Sign in page
- `/signup` - Sign up page
- All existing routes can be protected with `<ProtectedRoute>`

## 📝 Next Steps

1. Test the sign-in and sign-up flows
2. Install Google OAuth library if needed
3. Wrap protected pages with `<ProtectedRoute>`
4. Customize redirect URLs after login/signup
5. Add forgot password functionality (optional)
6. Add email verification (optional)

## 🐛 Troubleshooting

**"Login failed" error:**
- Make sure backend is running on `http://localhost:4000`
- Check browser console for detailed error messages
- Verify email/password are correct

**Google OAuth not working:**
- Install `@react-oauth/google` package
- Wrap app in GoogleOAuthProvider
- Update the Google button components

**Token expired:**
- User will be automatically logged out
- Redirected to `/signin` page

