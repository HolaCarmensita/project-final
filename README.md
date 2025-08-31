# Creative Ideas Hub / The Pensive

A collaborative platform where users can share and discover creative ideas in an immersive 3D environment. Connect with ideas and find collaborators for your projects through idea connections.

OBS!!! MVP mode - header and nav not fixed/animated on mobile, basic scroll behavior. The hidden mobileheader also take room in the desktop, no time to refactor that one. 

## What it does

This app lets you:

- Share your creative ideas with text and images
- Browse ideas in a cool 3D space where each idea is a floating orb
- Connect with ideas you're interested in collaborating on
- Receive email notifications when someone connects with your idea
- Get social media links from potential collaborators
- Navigate the 3D world using keyboard, mouse, or touch controls
- Edit and manage your own ideas (under construction)
- View and edit your profile (under construction)

## How we built it

### Frontend (React)

- **React 19** - The main framework for building the user interface
- **Three.js** - For the 3D graphics and interactive scene
- **Zustand** - For managing app state (like user data and ideas)
- **Styled Components** - For styling the app
- **React Router** - For navigation between pages

### Backend (Node.js)

- **Express.js** - The server framework
- **MongoDB** - Database to store users, ideas, and connections
- **JWT** - For user authentication and security
- **Cloudinary** - For storing and managing images
- **Multer** - For handling file uploads

## View it live

- **Frontend**: https://aesthetic-dolphin-63dc60.netlify.app/
- **Backend API**: https://project-final-backend-gq0x.onrender.com

## API Documentation

The backend uses the `express-list-endpoints` library to automatically generate API documentation. You can view all available endpoints at:
https://project-final-backend-gq0x.onrender.com/api-docs

## Future improvements

If we had more time, we'd add:

- BETTER errorhandling
- BETTER Loading States through out the app
- BETTER User Experience
- Well, to be honest, finish the app? Its only at MVP stage
- Real-time chat between users
- More 3D effects and animations
- Idea categories and search
- Video upload support
