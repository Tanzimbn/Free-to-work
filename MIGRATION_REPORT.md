# Migration Report: Express/HBS to React+Vite

**Date:** 2026-02-18
**Status:** In Progress (Advanced Stage)

## 1. Project Overview
The goal is to migrate the existing Express/Handlebars (HBS) web application to a React+Vite frontend while preserving the existing Express backend, MongoDB database, and session-based authentication.

## 2. Migration Status by Module

### ✅ Completed / Migrated
*   **Authentication**
    *   `LoginPage.jsx`: Implemented with session login.
    *   `RegisterPage.jsx`: Multi-step form implemented (Personal Info -> Contact Info -> Submit).
    *   `AuthContext.jsx`: Manages global user state, notifications, and mood toggle.
    *   `ProtectedRoute.jsx`: Route guard implemented.
*   **Landing Page**
    *   `LandingPage.jsx`: Converted from `landingpage.hbs`. UI matches original.
*   **Newsfeed**
    *   `NewsfeedPage.jsx`: Main feed functionality, sorting (Date/Price), ad carousel (Swiper).
    *   `PostCard.jsx` & `PostDetailsModal.jsx`: Post display and interaction.
    *   `CreatePostModal.jsx`: Post creation form with location cascading (Division -> District -> Thana).
    *   `FilterSidebar.jsx`: Sidebar for filtering posts.
*   **Profile**
    *   `ProfilePage.jsx`: User profile view (own and others).
    *   `EditProfileModal.jsx`, `ReviewsModal.jsx`, `ReportUserModal.jsx`: All modal functionalities migrated.
    *   **Note:** Password verification in frontend preserved from HBS logic (security note added).
*   **List Page (Worker Search)**
    *   `ListPage.jsx`: User listing with filtering, sorting (Rating), and pagination (Load More).
    *   Integration with `AuthNavbar` for search.
*   **Admin Dashboard**
    *   `AdminPage.jsx`: Dashboard statistics, User blocking, Report management, Feedback viewing, Category management.
*   **Components**
    *   `AuthNavbar.jsx`: Responsive navbar with Notifications, Mood Toggle, and Search.
    *   Global CSS (`index.css`) updated with HBS variables.

### ⚠️ In Progress / Needs Verification
*   **Backend Compatibility**:
    *   `profile.js`: Logic replicated in frontend to match HBS behavior.
    *   `filter.js` & `list.controller.js`: Confirmed they return JSON compatible with React.
*   **Asset Paths**:
    *   Images in `public/` need to be verified. Some hardcoded paths like `/home_page/images/...` were preserved but need to ensure files exist in React `public` folder.

## 3. Technical Implementation Notes
*   **API & CORS**:
    *   Frontend runs on `http://localhost:5173`.
    *   Backend runs on `http://localhost:3000`.
    *   `cors` configured on backend to allow `credentials: true`.
    *   `axios` instance (`api.js`) configured with `withCredentials: true` for session cookies.
*   **Image Handling**:
    *   Backend serves images as binary data in MongoDB (`Buffer`).
    *   Frontend converts these to Base64 strings using a helper function (`btoa`).
    *   File uploads use `FormData` with field name `testImage` to match `multer` config.
*   **State Management**:
    *   React `Context` used for Auth.
    *   Local state (`useState`) used for page-level data.
    *   `useLocation` state used for passing data between routes (e.g., opening a specific post from notification).

## 4. Pending Tasks & Next Steps
1.  **Testing**:
    *   **Registration Flow**: Verify email confirmation link handling (Route `/verify/:id` exists in backend, need frontend route/component if it redirects to a view, or handle strictly in backend). *Current backend redirects to a URL, might need adjustment.*
    *   **Admin Functions**: Test "Block User" and "Add Category" in the live React app.
    *   **Search**: Verify `AuthNavbar` search input correctly filters `ListPage` results.
2.  **Refinement**:
    *   **Toast Notifications**: Replace `alert()` calls with `react-toastify` in `AdminPage` and `ProfilePage` for better UX (already done in Auth pages).
    *   **Error Handling**: Add more robust error boundaries or UI feedback for API failures.
3.  **Cleanup**:
    *   Remove legacy HBS views and static files once migration is fully verified (optional).

## 5. How to Restart
1.  **Backend**: Ensure MongoDB is running and start server: `node index.js`.
2.  **Frontend**: Navigate to `client/` and start Vite: `npm run dev`.
3.  **Resume Work**:
    *   Open `d:\Projects\Free-to-work`.
    *   Check `client/src/pages/ListPage.jsx` for search integration refinement.
    *   Run through the "Testing" checklist above.
