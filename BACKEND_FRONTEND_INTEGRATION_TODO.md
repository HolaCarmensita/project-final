# Backend-Frontend Integration TODO

## Overview

This TODO breaks down the integration of your backend API with the frontend into manageable phases. Each phase builds upon the previous one, and tasks within each phase can be done in parallel by different team members.

---

## Phase 1: API Service Layer Setup

**Goal**: Create a clean API service layer to communicate with your backend

### 1.1 Create API Configuration

- [x] Create `frontend/src/services/api.js`
  - [x] Set up base URL configuration (use environment variables)
  - [x] Create axios instance with default headers
  - [x] Add request/response interceptors for JWT token handling
  - [x] Add error handling for network issues

### 1.2 Create Authentication Service

- [x] Create `frontend/src/services/authService.js`
  - [x] Implement `login(email, password)` function
  - [x] Implement `register(userData)` function
  - [x] Implement `logout()` function
  - [x] Add token storage/retrieval functions
  - [x] Add token refresh logic (if needed)

### 1.3 Create Ideas Service

- [x] Create `frontend/src/services/ideasService.js`
  - [x] Implement `getAllIdeas()` function
  - [x] Implement `getIdeaById(id)` function
  - [x] Implement `createIdea(ideaData)` function
  - [x] Implement `updateIdea(id, ideaData)` function
  - [x] Implement `deleteIdea(id)` function
  - [x] Implement `likeIdea(id)` function
  - [x] Implement `unlikeIdea(id)` function

### 1.4 Create Users Service (Optional for Phase 1)

- [x] Create `frontend/src/services/usersService.js`
  - [x] Implement `getUserProfile()` function
  - [x] Implement `updateUserProfile(userData)` function
  - [x] Implement `getUserConnections()` function

---

## Phase 2: Zustand Store Refactoring

**Goal**: Split the monolithic store into focused, maintainable stores

### 2.1 Create Authentication Store

- [x] Create `frontend/src/store/useAuthStore.js`
  - [x] State: `user`, `token`, `isAuthenticated`, `isLoading`, `error`
  - [x] Actions: `login`, `logout`, `register`, `setUser`, `clearError`
  - [x] Persist authentication state to localStorage
  - [x] Add automatic token validation on app start

### 2.2 Refactor Ideas Store

- [x] Update `frontend/src/store/useIdeasStore.js`
  - [x] Remove authentication-related state
  - [x] Remove UI state (modals, navigation)
  - [x] Keep: `ideas`, `selectedIndex`, `likedIds`
  - [x] Add: `isLoading`, `error`, `hasMore`
  - [x] Actions: `fetchIdeas`, `fetchIdea`, `createIdea`, `updateIdea`, `deleteIdea`, `likeIdea`, `unlikeIdea`, `searchIdeas`
  - [x] Add pagination support for large datasets

### 2.3 Create UI Store

- [x] Create `frontend/src/store/useUIStore.js`
  - [x] State: `isAddOpen`, `isConnectOpen`, `connectTarget`, `currentPage`
  - [x] Actions: `setIsAddOpen`, `setIsConnectOpen`, `setConnectTarget`, `setCurrentPage`
  - [x] Add navigation state management

### 2.4 Create Users Store

- [x] Create `frontend/src/store/useUsersStore.js`
  - [x] State: `currentUser`, `userConnections`, `allUsers`, `isLoading`, `error`
  - [x] Actions: `fetchCurrentUserProfile`, `updateUserProfile`, `fetchUserConnections`, `createConnection`, `removeConnection`, `fetchAllUsers`, `searchUsers`

---

## Phase 3: Frontend-Backend Integration ✅

**Goal**: Replace mock data with real API calls

### 3.1 Update Authentication Pages

- [x] Update `frontend/src/pages/Auth/LoginPage.jsx`

  - [x] Replace mock login with `authService.login()`
  - [x] Add proper error handling and user feedback
  - [x] Redirect to main app on successful login
  - [x] Add loading states

- [ ] Update `frontend/src/pages/Auth/RegisterPage.jsx`
  - [ ] Replace mock registration with `authService.register()`
  - [ ] Add proper error handling and user feedback
  - [ ] Redirect to main app on successful registration
  - [ ] Add loading states

### 3.2 Update Ideas Management

- [x] Update `frontend/src/pages/ideas/IdeaPage/IdeaPage.jsx`

  - [x] Replace mock data with `useIdeasStore.fetchIdeas()`
  - [x] Add loading states and error handling
  - [ ] Implement infinite scroll or pagination

- [x] Update `frontend/src/modals/AddIdeaModal.jsx`
  - [x] Replace mock submission with `useIdeasStore.createIdea()`
  - [x] Add proper validation (match backend requirements)
  - [x] Add loading states and success feedback

### 3.3 Update Idea Interactions

- [x] Update `frontend/src/pages/ideas/IdeaSocialBar/IdeaSocialBar.jsx`

  - [x] Replace mock like/unlike with `useIdeasStore.likeIdea()` / `useIdeasStore.unlikeIdea()`
  - [x] Add optimistic updates for better UX
  - [x] Handle errors gracefully

- [ ] Update idea deletion functionality
  - [ ] Replace mock deletion with `useIdeasStore.deleteIdea()`
  - [ ] Add confirmation dialogs
  - [ ] Handle authorization errors

### 3.4 Update Profile Pages

- [x] Update `frontend/src/pages/ProfilePage/ProfilePage.jsx`

  - [x] Use `useAuthStore.user` for user data
  - [x] Replace mock data with real user connections
  - [ ] Add profile update functionality

- [x] Update `frontend/src/pages/UserProfilePage/UserProfilePage.jsx`
  - [x] Fetch user data by ID from API
  - [x] Display real user information

---

## Phase 4: Error Handling & User Experience ✅

**Goal**: Provide excellent user experience with proper error handling

### 4.1 Global Error Handling

- [ ] Create `frontend/src/components/ErrorBoundary.jsx`

  - [ ] Catch and display React errors gracefully
  - [ ] Add error reporting (optional)

- [ ] Create `frontend/src/components/Toast.jsx` or use existing
  - [ ] Display success/error messages
  - [ ] Auto-dismiss functionality
  - [ ] Different styles for different message types

### 4.2 Loading States

- [ ] Create `frontend/src/components/LoadingSpinner.jsx`

  - [ ] Reusable loading component
  - [ ] Different sizes and styles

- [ ] Add loading states to all async operations
  - [ ] Page loads
  - [ ] Form submissions
  - [ ] Data fetching

### 4.3 Form Validation

- [x] Update all forms to match backend validation
  - [x] Title: 3-100 characters
  - [x] Description: 10-2000 characters
  - [x] Email validation
  - [x] Password requirements

### 4.4 Responsive Design Testing

- [ ] Test all new functionality on mobile
  - [ ] Authentication flows
  - [ ] Idea creation/editing
  - [ ] Navigation and modals

---

## Phase 5: Testing & Polish

**Goal**: Ensure everything works smoothly together

### 5.1 Integration Testing

- [ ] Test complete user flows
  - [ ] Register → Login → Create Idea → Like → Delete
  - [ ] Login → Browse Ideas → Connect with Users
  - [ ] Profile updates and settings

### 5.2 Error Scenarios

- [ ] Test network failures
- [ ] Test invalid tokens
- [ ] Test server errors
- [ ] Test validation errors

### 5.3 Performance Optimization

- [ ] Add request caching where appropriate
- [ ] Optimize bundle size
- [ ] Add lazy loading for routes
- [ ] Optimize images and assets

### 5.4 Final Polish

- [ ] Add proper meta tags for SEO
- [ ] Test on different browsers
- [ ] Add keyboard navigation support
- [ ] Ensure accessibility compliance

---

## Environment Setup

**Before starting, ensure you have:**

### Backend Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Creative Ideas
```

---

## Development Tips

### Working with Zustand

- Use `immer` for complex state updates
- Keep stores focused on single responsibilities
- Use selectors for derived state
- Persist important state to localStorage

### API Error Handling

- Always handle network errors
- Show user-friendly error messages
- Log errors for debugging
- Implement retry logic for transient failures

### Testing Strategy

- Test happy path first
- Then test error scenarios
- Test on different devices/screens
- Test with slow network connections

---

## Notes

- Each phase can be worked on by different team members
- Start with Phase 1 to establish the foundation
- Don't move to the next phase until the current one is stable
- Keep the existing UI working while integrating new functionality
- Use feature flags if needed to gradually roll out changes

Good luck with the integration! 🚀
