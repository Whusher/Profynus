# Landing Page Components

This directory contains all the components used in the Profynus landing page. The code has been refactored from a single 724-line file into smaller, maintainable, and reusable components.

## 📁 Structure

```
src/components/landing/
├── Logo.jsx                    # Animated logo component (FIXED VISIBILITY BUG)
├── Navigation.jsx              # Header navigation with mobile menu
├── HeroSection.jsx             # Main hero section with CTA
├── MusicParticles.jsx          # Animated background particles
├── FeaturesSection.jsx         # Features showcase with auto-rotation
├── FeatureCard.jsx             # Individual feature card
├── FeatureShowcase.jsx         # Large feature display component
├── HowItWorksSection.jsx       # How it works (3-step process)
├── StepCard.jsx                # Step card for "How It Works"
├── MusicShowcaseSection.jsx    # Featured playlists section
├── PlaylistCard.jsx            # Playlist card with hover effects
├── StatsSection.jsx            # Statistics display (users, songs, etc.)
├── StatCard.jsx                # Individual stat card
├── DownloadSection.jsx         # Download CTA section
├── Footer.jsx                  # Footer with links and newsletter
└── SectionHeader.jsx           # Reusable section header
```

## 🐛 Fixed Issues

### Logo Visibility Bug
**Problem:** The logo wasn't visible because it used dynamic Tailwind classes:
```jsx
// ❌ BROKEN - Tailwind can't process dynamic classes
className={`w-${size} h-${size}`}
```

**Solution:** Use inline styles for dynamic values:
```jsx
// ✅ FIXED - Use inline styles
style={{ width: `${size}px`, height: `${size}px` }}
```

## 🎨 Component Guide

### Main Page Component
**File:** `src/pages/landing/LandingPage.jsx`

The main landing page now imports and composes all section components:
```jsx
<Navigation onNavigate={handleNavigation} />
<HeroSection onNavigate={handleNavigation} />
<FeaturesSection />
<HowItWorksSection />
<MusicShowcaseSection />
<StatsSection />
<DownloadSection onNavigate={handleNavigation} />
<Footer />
```

### Navigation Component
Includes responsive mobile menu and desktop navigation with hover effects.

### FeaturesSection Component
- Auto-rotates between 3 features every 5 seconds
- Features: Download Music, Listen Anywhere, Create Playlists
- Displays feature cards and a large showcase area

### Reusable Components
- **FeatureCard**: Displays feature icon, title, and description
- **StepCard**: Shows numbered steps with large background numbers
- **PlaylistCard**: Interactive playlist cards with play button on hover
- **StatCard**: Displays statistics with animation on scroll
- **SectionHeader**: Consistent header styling across sections

## 🎯 Key Benefits of Refactoring

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components like cards and headers can be reused
3. **Maintainability**: Easy to find and update specific sections
4. **Readability**: Main page is now ~45 lines instead of 724
5. **Testability**: Individual components can be tested in isolation
6. **Performance**: Easier to optimize individual components

## 🚀 Usage Example

To modify a section, simply edit the corresponding component file:

```jsx
// To change the hero section, edit:
src/components/landing/HeroSection.jsx

// To update navigation links, edit:
src/components/landing/Navigation.jsx
```

## 📝 Props Reference

### Navigation
- `onNavigate(path)`: Function to handle navigation

### HeroSection
- `onNavigate(path)`: Function to handle navigation

### DownloadSection
- `onNavigate(path)`: Function to handle navigation

### SectionHeader
- `title`: Section title (first word will be cyan-colored)
- `subtitle`: Section subtitle text

### FeatureCard
- `icon`: React element (icon component)
- `title`: Feature title
- `description`: Feature description

### PlaylistCard
- `title`: Playlist name
- `songs`: Number of songs
- `image`: Image URL
- `index`: Index for staggered animation

## 💡 Tips for Development

1. **Adding new sections**: Create a new component in this folder and import it in LandingPage.jsx
2. **Styling consistency**: All components use cyan (#22D3EE) as the accent color
3. **Animations**: All sections use `framer-motion` for smooth animations
4. **Responsive**: All components are mobile-responsive with Tailwind classes

## 🎨 Design System

- **Primary Color**: Cyan (#22D3EE, `cyan-400`)
- **Background**: Black with gradient overlays
- **Text**: White with gray-300/400 for secondary text
- **Borders**: `border-cyan-900/30` with hover state `border-cyan-500/50`
- **Cards**: Gradient backgrounds with border and hover effects
- **Animations**: Smooth transitions with `framer-motion`
