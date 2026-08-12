# 05 Frontend Implementation Plan

> **Strategy**: Phase-by-phase iterative frontend development.  
> **Rule**: Every phase must be independently reviewable and validated against the live backend before proceeding to the next.

---

## Phase Summary Table

| Phase | Title | Main Scope | Backend APIs Used |
|---|---|---|---|
| **Phase 1** | Setup & API Infrastructure | React/Vite app initialization, Axios client, Design Tokens, Auth Context | `GET /healthcheck/test`, `GET /users/current-user` |
| **Phase 2** | Authentication & User Profile | Login, Register, Logout, Password Change, Avatar/Cover updates | `/users/login`, `/register`, `/logout`, `/avatar`, `/cover-image`, `/change-password`, `/update-account` |
| **Phase 3** | Main Shell & Video Feed | Navbar, Sidebar, Category filters, Video Grid, Search page | `GET /videos`, `GET /healthcheck/test` |
| **Phase 4** | Watch Page & Video Player | Custom Video Player, Video details, Channel row, View count trigger | `GET /videos/:videoId`, `POST /videos/view/:videoId` |
| **Phase 5** | Engagement & Interaction | Video/Comment/Tweet likes, Comment CRUD, Channel Subscription toggle | `/likes/toggle/*`, `/comments/*`, `/subscriptions/c/*` |
| **Phase 6** | Channel Pages, Playlists & Tweets | Channel profile tabs, Playlists CRUD, Add/Remove video, Tweets CRUD | `/users/c/*`, `/playlist/*`, `/tweets/*`, `/subscriptions/*` |
| **Phase 7** | Creator Studio & Video Upload | Channel Analytics stats, Video management table, Video Publish toggle, Video Upload modal | `GET /dashboard/stats`, `GET /dashboard/videos`, `POST /videos`, `PATCH /videos/:id`, `DELETE /videos/:id`, `PATCH /videos/toggle/publish/:id` |
| **Phase 8** | History, Liked Videos & UX Polish | Watch History feed, Liked Videos library, Skeletons, Error Toasts, Responsive audit | `GET /users/history`, `GET /likes/videos`, Full App polish |

---

## Detailed Phase Breakdown

### Phase 1: Project Initialization & API Client Setup

- **Goal**: Initialize the React Vite project in `./frontend`, configure global CSS design tokens, set up `axiosClient` with credentials and token refresh interceptors, and establish `AuthContext` for session bootstrap.
- **Files / Components to Create**:
  - `frontend/package.json`, `frontend/vite.config.js`
  - `frontend/src/index.css` (Global CSS tokens & baseline reset)
  - `frontend/src/api/axiosClient.js` (Axios instance + 401 interceptor)
  - `frontend/src/context/AuthContext.jsx` & `useAuth.js`
  - `frontend/src/context/ToastContext.jsx` & `useToast.js`
  - `frontend/src/components/common/Button.jsx`, `Spinner.jsx`
- **Backend APIs Used**:
  - `GET /api/v1/healthcheck/test`
  - `GET /api/v1/users/current-user`
  - `POST /api/v1/users/refresh-token`
- **Acceptance Criteria**:
  1. Frontend builds cleanly via Vite.
  2. `axiosClient` makes credentials-enabled requests (`withCredentials: true`).
  3. App boots up, checks `current-user`, and accurately populates `AuthContext`.
- **Validation & Testing**:
  - Run dev server, inspect console log for healthcheck ping and session bootstrap response.

---

### Phase 2: Authentication & User Profile Management

- **Goal**: Build complete login, signup, logout, account details update, password change, and avatar/cover image upload features.
- **Files / Components to Create**:
  - `frontend/src/api/auth.api.js`
  - `frontend/src/pages/LoginPage.jsx`
  - `frontend/src/pages/RegisterPage.jsx`
  - `frontend/src/components/profile/AccountSettingsModal.jsx`
  - `frontend/src/components/common/FileUploadInput.jsx`
- **Backend APIs Used**:
  - `POST /api/v1/users/register` (multipart/form-data with avatar)
  - `POST /api/v1/users/login`
  - `POST /api/v1/users/logout`
  - `PATCH /api/v1/users/update-account`
  - `PATCH /api/v1/users/avatar` (multipart/form-data)
  - `PATCH /api/v1/users/cover-image` (multipart/form-data)
  - `POST /api/v1/users/change-password`
- **Acceptance Criteria**:
  1. New user registration with avatar image upload succeeds and sets DB fields.
  2. Login authenticates user and sets HTTP-Only cookies.
  3. Logout clears cookies and resets `AuthContext`.
  4. Avatar and cover banner updates immediately reflect in UI and Cloudinary.
- **Validation & Testing**:
  - Test registration, login, logout, and avatar updates with live backend endpoints.

---

### Phase 3: Main Shell Layout, Navigation & Public Video Feed

- **Goal**: Create responsive top navigation bar, collapsible sidebar drawer, category filter chips, public video grid, search page, and paginated feed logic.
- **Files / Components to Create**:
  - `frontend/src/api/video.api.js`
  - `frontend/src/components/layout/Navbar.jsx`
  - `frontend/src/components/layout/Sidebar.jsx`
  - `frontend/src/components/layout/MainLayout.jsx`
  - `frontend/src/components/video/VideoCard.jsx`
  - `frontend/src/components/video/VideoGrid.jsx`
  - `frontend/src/components/common/SkeletonCard.jsx`
  - `frontend/src/pages/HomePage.jsx`
  - `frontend/src/pages/SearchPage.jsx`
- **Backend APIs Used**:
  - `GET /api/v1/videos` (with `page`, `limit`, `query`, `sortBy`, `sortType`, `userId`)
- **Acceptance Criteria**:
  1. Video grid renders videos returned by `getAllVideos`.
  2. Search bar filters videos by text query via API parameter.
  3. Category chips trigger filtered queries (`query` / `sortBy`).
  4. Skeleton loading cards render smoothly during API fetch.
- **Validation & Testing**:
  - Test pagination, category switching, and search query execution.

---

### Phase 4: Watch Page, Custom Video Player & View Counter

- **Goal**: Build the video playback experience, showing player, video title, owner channel card, subscriber button, like count, description box, and related videos column.
- **Files / Components to Create**:
  - `frontend/src/pages/WatchPage.jsx`
  - `frontend/src/components/video/VideoPlayer.jsx`
  - `frontend/src/components/video/VideoDescription.jsx`
  - `frontend/src/components/video/RelatedVideosList.jsx`
- **Backend APIs Used**:
  - `GET /api/v1/videos/:videoId`
  - `POST /api/v1/videos/view/:videoId`
- **Acceptance Criteria**:
  1. Video page fetches video by ID and streams Cloudinary video file.
  2. Adapter maps backend payload fields (handling `tottalLikes` field mapping).
  3. Playback trigger sends `POST /videos/view/:videoId` to increment view count.
  4. Video description expand/collapse operates smoothly.
- **Validation & Testing**:
  - Open video watch page, verify player playback, check view counter increment in DB.

---

### Phase 5: Engagement Layer - Likes, Comments & Subscriptions

- **Goal**: Implement video likes, comment likes, tweet likes, comment CRUD operations, and channel subscription toggle buttons.
- **Files / Components to Create**:
  - `frontend/src/api/like.api.js`
  - `frontend/src/api/comment.api.js`
  - `frontend/src/api/sub.api.js`
  - `frontend/src/components/comment/CommentSection.jsx`
  - `frontend/src/components/comment/CommentItem.jsx`
  - `frontend/src/components/common/SubscribeButton.jsx`
  - `frontend/src/components/common/LikeButton.jsx`
- **Backend APIs Used**:
  - `POST /api/v1/likes/toggle/v/:videoId`
  - `POST /api/v1/likes/toggle/c/:commentId`
  - `POST /api/v1/likes/toggle/t/:tweetId`
  - `GET /api/v1/comments/:videoId`
  - `POST /api/v1/comments/:videoId`
  - `PATCH /api/v1/comments/c/:commentId`
  - `DELETE /api/v1/comments/c/:commentId`
  - `POST /api/v1/subscriptions/c/:channelId`
- **Acceptance Criteria**:
  1. Toggling video like updates button active state and total count.
  2. Users can post, edit, and delete their own comments on videos.
  3. Subscribe button toggles channel subscription status (`Subscribed!` / `Channel unsubscribed`).
- **Validation & Testing**:
  - Test adding a comment, editing it, deleting it, and toggling likes/subscriptions.

---

### Phase 6: Channel Profiles, Playlists & Community Tweets

- **Goal**: Build channel profile view (`/c/:username`), user playlists management (create, view, add video, remove video, delete), and community tweets feed.
- **Files / Components to Create**:
  - `frontend/src/api/playlist.api.js`
  - `frontend/src/api/tweet.api.js`
  - `frontend/src/pages/ChannelPage.jsx`
  - `frontend/src/pages/PlaylistsPage.jsx`
  - `frontend/src/components/channel/ChannelHeader.jsx`
  - `frontend/src/components/channel/CommunityTab.jsx`
  - `frontend/src/components/playlist/PlaylistModal.jsx`
  - `frontend/src/components/playlist/SaveToPlaylistModal.jsx`
- **Backend APIs Used**:
  - `GET /api/v1/users/c/:username`
  - `GET /api/v1/subscriptions/c/:channelId`
  - `GET /api/v1/subscriptions/u/:subscriberId`
  - `POST /api/v1/playlist`
  - `GET /api/v1/playlist/user/:userId`
  - `GET /api/v1/playlist/:playlistId`
  - `PATCH /api/v1/playlist/add/:videoId/:playlistId`
  - `PATCH /api/v1/playlist/remove/:videoId/:playlistId`
  - `DELETE /api/v1/playlist/:playlistId`
  - `POST /api/v1/tweets`
  - `GET /api/v1/tweets/user/:userId`
  - `PATCH /api/v1/tweets/:tweetId`
  - `DELETE /api/v1/tweets/:tweetId`
- **Acceptance Criteria**:
  1. Channel page displays cover banner, avatar, statistics, and subtabs.
  2. Users can create custom playlists and add/remove videos from Watch page modal.
  3. Creators can post community tweets and manage existing posts.
- **Validation & Testing**:
  - Test playlist creation, adding a video to playlist, and posting a tweet.

---

### Phase 7: Creator Studio, Analytics & Video Upload Studio

- **Goal**: Build Creator Dashboard (`/dashboard`) featuring channel analytics cards, uploaded videos management table, publish status toggles, and video upload modal.
- **Files / Components to Create**:
  - `frontend/src/api/dashboard.api.js`
  - `frontend/src/pages/DashboardPage.jsx`
  - `frontend/src/components/dashboard/StatCard.jsx`
  - `frontend/src/components/dashboard/VideoManagementTable.jsx`
  - `frontend/src/components/dashboard/VideoUploadModal.jsx`
  - `frontend/src/components/dashboard/VideoEditModal.jsx`
- **Backend APIs Used**:
  - `GET /api/v1/dashboard/stats`
  - `GET /api/v1/dashboard/videos`
  - `POST /api/v1/videos` (multipart: videoFile, thumbnail, title, description)
  - `PATCH /api/v1/videos/:videoId` (multipart)
  - `DELETE /api/v1/videos/:videoId`
  - `PATCH /api/v1/videos/toggle/publish/:videoId`
- **Acceptance Criteria**:
  1. Dashboard displays real-time aggregate stats (views, likes, subs, videos).
  2. Video management table displays user's uploaded videos with live status toggles.
  3. Video Upload Modal uploads video & thumbnail with progress bar indicator.
- **Validation & Testing**:
  - Upload a new test video file, verify progress bar, toggle publish status in table, verify appearance in home feed.

---

### Phase 8: Watch History, Liked Videos & UX Polish Audit

- **Goal**: Implement Watch History feed page, Liked Videos library page, global toast alerts, loading skeletons across all views, empty states, and full responsive design audit.
- **Files / Components to Create**:
  - `frontend/src/pages/HistoryPage.jsx`
  - `frontend/src/pages/LikedVideosPage.jsx`
  - `frontend/src/components/common/Toast.jsx`
  - `frontend/src/components/common/EmptyState.jsx`
- **Backend APIs Used**:
  - `GET /api/v1/users/history`
  - `GET /api/v1/likes/videos`
- **Acceptance Criteria**:
  1. Watch History page displays chronologically watched videos.
  2. Liked Videos page displays all videos liked by current user.
  3. Every page renders polished loading, empty, error, and responsive layouts.
- **Validation & Testing**:
  - Conduct full user journey walkthrough test across mobile and desktop viewports.
