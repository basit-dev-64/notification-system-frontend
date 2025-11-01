# Notification System Frontend

A Next.js frontend application for managing and sending notifications.

## Features

- User authentication (Login/Signup)
- Create, edit, and delete notifications
- Send notifications immediately or schedule for later
- View notification logs with filtering
- Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

Replace `http://localhost:3000` with your backend API URL.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```
notification-system-frontend/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── notifications/     # Notifications pages
│   │   ├── create/       # Create notification
│   │   └── [id]/         # Edit and send notification
│   └── logs/              # Notification logs page
├── components/            # Reusable components
├── contexts/              # React contexts (Auth)
├── lib/                   # API client and utilities
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /notifications` - Get all notifications
- `POST /notifications` - Create notification
- `GET /notifications/:id` - Get single notification
- `PATCH /notifications/:id` - Update notification
- `DELETE /notifications/:id` - Delete notification
- `POST /notifications/send` - Send or schedule notification
- `GET /notifications/logs` - Get notification logs

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL

# notification-system-frontend
