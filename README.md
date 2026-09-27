# Netflix Streaming Platform

A full-stack video streaming platform built with the MERN stack. The project provides a foundation for a modern streaming service with user authentication, movie management, video uploads, transcoding, HLS-based playback, watch history, saved movies, categories, banners, and role-based administration.

## Overview

This project is designed as a scalable streaming platform with separate frontend and backend applications.

The backend provides REST APIs for authentication, users, movies, categories, banners, saved movies, watch history, file storage, and video processing.

The video processing pipeline is designed around asynchronous transcoding using FFmpeg and RabbitMQ. Uploaded source videos can be processed into multiple HLS resolutions for adaptive streaming.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- React Hook Form
- Yup
- React Query
- Lucide / Iconify
- HLS video playback

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- RabbitMQ
- FFmpeg
- JWT Authentication
- Passport.js
- Cloudinary
- AWS S3

### Infrastructure

- Docker
- Nginx
- Vercel
- AWS
- CDN-compatible HLS storage

## Features

### Authentication

- User registration
- User login
- OTP-based verification
- Password management
- JWT-based authentication
- Role-based access control
- Admin authentication

### Movie Management

- Create movies
- Update movie information
- Delete movies
- Movie categories
- Movie metadata
- Movie posters and backdrops
- Cast and crew information
- Movie ratings
- Movie descriptions
- Movie slugs

### Video Processing

The platform is designed to process uploaded source videos asynchronously.

The general pipeline is:

```text
Source Video
     |
     v
File Storage
     |
     v
RabbitMQ Queue
     |
     v
FFmpeg Worker
     |
     +---- 1080p HLS
     |
     +---- 720p HLS
     |
     +---- 480p HLS
     |
     +---- 360p HLS
     |
     v
HLS Storage
     |
     v
CDN
     |
     v
Video Player
```

This approach prevents video transcoding from blocking the main API server.

### User Features

- Browse movies
- Search movies
- View movie details
- Stream videos
- Save movies
- Watch history
- Continue watching
- Category-based browsing

### Admin Features

- Manage movies
- Upload source videos
- Manage categories
- Manage banners
- Manage users
- Monitor video processing
- Control movie metadata

## Project Structure

```text
netflix/
├── backend/
│   ├── src/
│   │   ├── common/
│   │   ├── config/
│   │   ├── core/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── banner/
│   │   │   ├── category/
│   │   │   ├── movies/
│   │   │   ├── saved/
│   │   │   └── watchHistory/
│   │   ├── queues/
│   │   ├── router/
│   │   ├── seeder/
│   │   ├── services/
│   │   └── utilities/
│   ├── worker/
│   │   └── transcode.worker.js
│   ├── index.js
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
NODE_ENV=development
PORT=9005

MONGO_URI=
JWT_SECRET=

REDIS_URL=
RABBITMQ_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=
```

Configure the variables according to your local or cloud environment.

Start the backend:

```bash
npm start
```

The API will be available at:

```text
http://localhost:9005
```

## Transcoding Worker

The transcoding worker is responsible for processing video jobs from RabbitMQ.

Make sure FFmpeg is installed and available in the system PATH.

Start the worker:

```bash
node worker/transcode.worker.js
```

The worker consumes transcoding jobs and generates HLS output at the configured resolutions.

## Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the required environment variables according to the frontend configuration.

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

## Video Upload Pipeline

An administrator can upload a movie through the backend API.

The upload process follows this architecture:

```text
Admin Dashboard
      |
      v
POST /api/v1/admin/movies
      |
      v
Backend API
      |
      v
Source Video Storage
      |
      v
Create Transcoding Job
      |
      v
RabbitMQ
      |
      v
Transcoding Worker
      |
      v
FFmpeg
      |
      v
HLS Segments
      |
      v
Object Storage
      |
      v
CDN
      |
      v
Movie.video.hlsUrl
```

The source video is not processed directly inside the request lifecycle. Instead, the API creates a background job that can be handled independently by the transcoding worker.

## HLS Structure

A processed movie can contain multiple HLS variants:

```text
movie/
├── master.m3u8
├── 1080p/
│   ├── playlist.m3u8
│   ├── segment000.ts
│   ├── segment001.ts
│   └── ...
├── 720p/
│   ├── playlist.m3u8
│   └── ...
├── 480p/
│   ├── playlist.m3u8
│   └── ...
└── 360p/
    ├── playlist.m3u8
    └── ...
```

The master playlist allows the player to select an appropriate quality based on available bandwidth and device capabilities.

## API

The backend API is organized by modules.

Example modules include:

```text
/api/v1/auth
/api/v1/users
/api/v1/movies
/api/v1/categories
/api/v1/banners
/api/v1/saved
/api/v1/watch-history
```

Administrative operations are protected through authentication and role-based access control.

## Development

Clone the repository:

```bash
git clone https://github.com/Bikashpandey90/netflix.git
```

Enter the project:

```bash
cd netflix
```

Install dependencies for both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Run the backend and frontend in separate terminals.

For video processing, run the transcoding worker separately.

## Environment

The project supports both local development and cloud-based deployment.

### Local Development

A typical local setup consists of:

```text
Frontend
   |
   v
Express API
   |
   +---- MongoDB
   |
   +---- Redis
   |
   +---- RabbitMQ
   |
   +---- Local Storage
   |
   +---- FFmpeg Worker
```

### Cloud Deployment

A production deployment can use:

```text
Client
   |
   v
Frontend
   |
   v
API Server
   |
   +---- MongoDB
   +---- Redis
   +---- RabbitMQ
   +---- Object Storage
   |
   v
Transcoding Workers
   |
   v
HLS Storage
   |
   v
CDN
```

This architecture allows the API, workers, storage, and frontend to scale independently.

## Security

The project uses several mechanisms to protect the application:

- JWT authentication
- Role-based access control
- Request validation
- Rate limiting
- Secure password handling
- Environment-based secrets
- Protected administrative routes
- Server-side file validation

Secrets and credentials should never be committed to the repository.

## Current Status

The project is under active development.

Current development areas include:

- Authentication
- Movie management
- Admin dashboard
- Video upload
- FFmpeg transcoding
- HLS streaming
- Storage abstraction
- Watch history
- Saved movies
- Frontend streaming experience
- Production deployment

## Roadmap

### Backend

- Complete movie management APIs
- Improve video processing reliability
- Add transcoding job status tracking
- Add retry handling for failed jobs
- Add storage cleanup
- Add media validation
- Improve API documentation

### Frontend

- Complete streaming player
- Adaptive HLS playback
- Continue watching
- Search
- Advanced movie filtering
- User profiles
- Admin dashboard

### Infrastructure

- Containerized transcoding workers
- Cloud object storage
- CDN integration
- Production monitoring
- Centralized logging
- Automated deployment

## License

This project is currently intended for educational and development purposes.
