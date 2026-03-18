# Specification

## Summary
**Goal:** Implement a complete alternative visual theme (Design B) for the Mobile Health Care App, inspired by the provided Figma reference, and make it switchable at runtime.

**Planned changes:**
- Add a distinct Design B styling system (non-blue/purple palette, typography, spacing, component and layout rules) applied consistently across the app.
- Create navigable Design B screens for: Welcome/Onboarding, Sign In, Home/Dashboard, and Profile, using realistic placeholder content in English.
- Add an in-app toggle/switcher to view Design B (and switch between default and Design B if a default design exists) without editing immutable template files.
- Generate and include required static images under `frontend/public/assets/generated` and use them across Design B screens.

**User-visible outcome:** Users can navigate through the core app screens in a clearly different Design B look and feel, and toggle the Design B UI on/off at runtime; screens display locally bundled theme images.
