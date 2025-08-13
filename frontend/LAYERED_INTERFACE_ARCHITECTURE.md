# Layered Interface Architecture Documentation

## Overview

This document outlines the architectural approach for implementing a layered interface where the 3D environment serves as a persistent background, and navigation content appears as overlays on top.

## Design Concept

- **Background Layer**: 3D scene with colorful orbs (permanent, always visible)
- **Overlay Layer**: Navigation content (profile, ideas, settings) appears on top
- **Result**: Modern, layered UX similar to Figma, Notion, or other contemporary apps

## Core Architecture

### Component Structure

```
App.jsx
├── 3DScene (always rendered, background)
├── OverlayContainer
│   ├── ProfileSidebar (conditionally rendered)
│   ├── IdeasPanel (conditionally rendered)
│   ├── SettingsModal (conditionally rendered)
│   └── NavigationOverlay (conditionally rendered)
└── Navigation (floating controls)
```

### Routing Strategy

**IMPORTANT**: The 3D environment is NOT part of individual routes. It's a persistent background that stays mounted across ALL routes.

```
/                    → 3D environment (persistent background) + no overlay
/profile             → 3D environment (persistent background) + profile sidebar overlay
/ideas               → 3D environment (persistent background) + ideas panel overlay
/settings            → 3D environment (persistent background) + settings modal overlay
```

**Key Point**: Routes only control what overlay appears on top of the 3D environment. The 3D environment itself never unmounts or re-renders.

### Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    App Container                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Background Layer (z-index: 1)            │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │             3D Scene                        │   │   │ ← ALWAYS HERE
│  │  │         (orbs, animations)                  │   │   │   NEVER UNMOUNTS
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Overlay Layer (z-index: 10)             │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │                                             │   │   │ ← CHANGES BASED ON ROUTE
│  │  │         Profile Sidebar                     │   │   │   (only this part changes)
│  │  │                                             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Approach: React Router with Layout Wrapper

### Key Principles

1. **Persistent 3D Scene**: Never unmounts, always running in background
2. **Conditional Overlays**: Only render when route changes
3. **Smart Interaction**: Overlays don't block 3D scene interaction where appropriate
4. **URL-based Navigation**: Clean routing structure

### App.jsx Structure

```jsx
const App = () => {
  return (
    <Router>
      <div className='app-container'>
        {/* 3D Scene - ALWAYS rendered, never unmounts */}
        <div className='background-layer'>
          <Scene />
        </div>

        {/* Overlay layer */}
        <div className='overlay-layer'>
          <Routes>
            <Route path='/' element={null} />
            <Route path='/profile' element={<ProfileSidebar />} />
            <Route path='/ideas' element={<IdeasPanel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};
```

## CSS Layering Strategy

### Base Layout

```css
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.overlay-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  pointer-events: none; /* Allow clicks to pass through by default */
}
```

### Overlay-Specific Styles

#### Profile Sidebar

```css
.profile-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: rgba(40, 40, 40, 0.95);
  pointer-events: auto; /* Only this area blocks clicks */
}
```

#### Ideas Panel

```css
.ideas-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}
```

## Overlay Component Examples

### Profile Sidebar Component

```jsx
const ProfileSidebar = () => {
  return (
    <div className='profile-sidebar'>
      <div className='sidebar-content'>
        {/* Profile content - only this area blocks 3D scene interaction */}
        <div className='profile-header'>
          <div className='profile-avatar' />
          <h2>Mary Smith</h2>
          <p>Designer</p>
        </div>
        <div className='profile-gallery'>{/* Image gallery */}</div>
        <div className='profile-description'>
          <h3>Lorem Ipsum è un testo segnaposto.</h3>
          <p>
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della
            tipografia...
          </p>
        </div>
      </div>
    </div>
  );
};
```

### Ideas Panel Component

```jsx
const IdeasPanel = () => {
  return (
    <div className='ideas-panel'>
      <div className='panel-backdrop' />
      <div className='panel-content'>
        {/* Ideas content - modal-style overlay */}
      </div>
    </div>
  );
};
```

## Interaction Patterns

### Different Overlay Behaviors

1. **Profile Sidebar**: Covers only right side, 3D scene remains interactive on left
2. **Ideas Panel**: Full-screen overlay with backdrop, blocks all 3D interaction
3. **Settings Modal**: Center modal with backdrop blur
4. **Navigation**: Floating controls that don't block 3D interaction

### Click-through Strategy

- **Default**: Overlays allow clicks to pass through to 3D scene
- **Selective**: Only overlay content areas block interaction
- **Full-block**: Modal overlays block all background interaction

## Performance Considerations

### 3D Scene Optimization

- Scene remains mounted and running
- No re-renders on route changes
- Maintains smooth 60fps performance
- Camera controls remain active

### Overlay Performance

- Lightweight overlay components
- Minimal DOM manipulation
- Smooth animations for overlay transitions
- Efficient state management

## Animation Strategy

### Overlay Transitions

```css
.profile-sidebar {
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.profile-sidebar.visible {
  transform: translateX(0);
}
```

### 3D Scene Continuity

- No interruption to 3D animations
- Orb movements continue during overlay transitions
- Camera controls remain responsive
- Background effects persist

## Benefits of This Architecture

✅ **Consistent Background**: 3D environment always visible  
✅ **Smooth Transitions**: Overlays can animate in/out  
✅ **URL-based Navigation**: Users can bookmark specific views  
✅ **Progressive Disclosure**: Information appears when needed  
✅ **Modern UX**: Similar to contemporary design tools  
✅ **Performance**: No unnecessary re-renders  
✅ **Flexibility**: Different overlay types with different behaviors  
✅ **Accessibility**: Proper focus management for overlays

## Implementation Steps

1. **Install React Router**: `npm install react-router-dom`
2. **Restructure App.jsx**: Implement layered layout
3. **Create Overlay Components**: Profile, Ideas, Settings
4. **Implement CSS Layering**: Background and overlay styles
5. **Add Animations**: Smooth transitions between states
6. **Test Interactions**: Ensure proper click-through behavior
7. **Optimize Performance**: Monitor 3D scene performance

## Visual Result Examples

- **Homepage (`/`)**: Pure 3D environment, fully interactive
- **Profile (`/profile`)**: 3D environment visible on left, profile sidebar on right
- **Ideas (`/ideas`)**: 3D environment with ideas panel overlay
- **Settings (`/settings`)**: 3D environment with modal overlay

## Future Enhancements

- **Backdrop Blur**: Add blur effect to 3D scene when overlays are active
- **Gesture Support**: Swipe gestures for overlay navigation
- **Keyboard Shortcuts**: Quick navigation between overlays
- **Custom Animations**: Advanced transition effects
- **Responsive Design**: Adapt overlay sizes for different screen sizes
