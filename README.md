# Unipart Employee Directory

A modern React-based employee directory application built for Unipart. This application provides a secure, user-friendly interface for employees to access company directory information with role-based permissions.

![Unipart Logo](/public/logo.png)

## Instructions for Testing
To test the application, follow these steps:
#### Application URLs:
    https://unipart.suyogshah.com/
    https://unipart-assignment.web.app/

#### Login Credentials
**Admin User**
- Email: `bhabani.nayak@unipart.com`
- Password: `Unipart@123`

**Regular User**
- Email: `suyog.shah@gmail.com`
- Password: `Unipart@123`


## Features

- **Authentication System**
  - Email/Password registration and login
  - Google Sign-In integration
  - Role-based access control (ADMIN and USER roles)
  - Secure authentication via Firebase

- **Employee Directory**
  - Display of employee information from external API
  - Real-time search functionality
  - Sortable columns for easy data navigation
  - Role-based data access (ADMIN sees more details than regular users)

- **Data Export**
  - Export directory data to CSV format
  - Role-aware exports (only exports data visible to the current user)

- **Responsive Design**
  - Mobile-friendly interface
  - Bootstrap-based UI components
  - Custom styling

## Technologies Used

- **Frontend**
  - React 19
  - React Router v7
  - React Bootstrap
  - Bootstrap 5
  - Bootstrap Icons

- **Backend & Services**
  - Firebase Authentication
  - Firestore Database
  - Google Apps Script API (for directory data)

- **Build Tools**
  - Vite
  - ESLint

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd unipart-assignment
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

   Note: The Firebase configuration is already included in the `src/firebase.js` file, so you don't need to set up any environment variables.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173/

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
├── public/                 # Public assets
├── src/                    # Source code
│   ├── components/         # React components
│   ├── contexts/           # React context providers
│   ├── styles/             # CSS styles
│   ├── App.jsx             # Main application component
│   ├── firebase.js         # Firebase configuration
│   └── main.jsx            # Application entry point
├── .eslintrc.js            # ESLint configuration
├── index.html              # HTML entry point
├── package.json            # Project metadata and dependencies
└── vite.config.js          # Vite configuration
```

## User Roles

- **ADMIN**: Can view extended employee information including email addresses and start dates
- **USER**: Can view basic employee information (name and department only)

## Setting Up Admin Users

To designate a user as an Admin:

1. After the user registers, locate their record in the Firestore database
2. Navigate to the `users` collection in Firebase Console
3. Find the user document by their email address
4. Edit the document and set the `role` field to `"ADMIN"` (must be uppercase)
5. Save the changes - the user will now have admin privileges on their next login

## Data Source

The application fetches employee directory data from a Google Apps Script API. The data is displayed based on the user's role, with administrators seeing more detailed information.
https://docs.google.com/spreadsheets/d/1Q0CnAdh_G8UpEZwceC7_nXY6CeHlrfEp-qPTVAe0n8k/edit?gid=0#gid=0

## Assumptions and Limitations

- Password reset functionality was not implemented as it wasn't required for this demonstration
- User profile editing features were omitted to keep the scope focused
- Directory data is read-only; CRUD operations for employee records are not implemented

## Deployment

This application can be deployed to Firebase Hosting:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```

4. Deploy the application:
   ```bash
   firebase deploy
   ```

## License

This project is proprietary and confidential. All rights reserved.