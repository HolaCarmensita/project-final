# Import Path Aliases Guide

## Overview

This guide documents the import path alias configuration that makes importing files much easier and more maintainable.

## Current Setup

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@data': path.resolve(__dirname, './src/data'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
```

### Available Aliases

- `@` → `src/`
- `@components` → `src/components/`
- `@pages` → `src/pages/`
- `@data` → `src/data/`
- `@assets` → `src/assets/`

## Usage Examples

### Before (Relative Imports)

```javascript
// Hard to read and maintain
import mockApi from '../../../data/mockData';
import IdeaCard from '../ideaCard/IdeaCard';
import Navigation from '../../components/Navigation';
```

### After (Alias Imports)

```javascript
// Clean and readable
import mockApi from '@data/mockData';
import IdeaCard from '@pages/ideas/ideaCard/IdeaCard';
import Navigation from '@components/Navigation';
```

## Benefits

1. **No more counting `../` levels** - Import from anywhere using aliases
2. **Easier refactoring** - Move files without breaking imports
3. **Better readability** - Clear, semantic import paths
4. **IDE support** - Autocomplete and IntelliSense work with aliases
5. **Consistent imports** - Same pattern across the entire project

## Common Import Patterns

### Data and API

```javascript
import mockApi from '@data/mockData';
import apiConfig from '@data/config';
```

### Components

```javascript
import Navigation from '@components/Navigation';
import IdeaCard from '@pages/ideas/ideaCard/IdeaCard';
```

### Pages

```javascript
import HomePage from '@pages/Home3D/Home3D/Home3D';
import IdeaCarousel from '@pages/ideas/IdeaCarousel/IdeaCarousel';
```

### Assets

```javascript
import logo from '@assets/img/logo.png';
import icon from '@assets/icons/heart.svg';
```

## Adding New Aliases

To add a new alias, update the `vite.config.js`:

```javascript
resolve: {
  alias: {
    // ... existing aliases
    '@utils': path.resolve(__dirname, './src/utils'),
    '@hooks': path.resolve(__dirname, './src/hooks'),
    '@styles': path.resolve(__dirname, './src/styles'),
  },
}
```

## Migration Tips

1. **Gradual migration** - You can mix relative and alias imports
2. **IDE support** - Most editors will suggest the alias paths
3. **Team consistency** - Use aliases for new imports, migrate old ones gradually

## Troubleshooting

### If imports don't work:

1. Restart the dev server after changing `vite.config.js`
2. Check that the alias path is correct
3. Verify the target file exists

### Common mistakes:

- Forgetting to restart the dev server
- Typos in alias names (e.g., `@data` vs `@Data`)
- Incorrect file paths in the alias configuration

## Branch Strategy

**Recommendation**: Create a separate branch for implementing this across your entire codebase:

```bash
git checkout -b feature/import-path-aliases
# Update all imports to use aliases
git add .
git commit -m "feat: implement import path aliases for better maintainability"
git push origin feature/import-path-aliases
```

This way you can:

- Test the changes thoroughly
- Review the impact on the entire codebase
- Merge when ready
- Rollback if needed

---

_Last updated: [Current Date]_
_Created for: Project Final - Frontend Import Path Optimization_
