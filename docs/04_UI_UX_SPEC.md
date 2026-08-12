# 04 UI/UX Product Design Specification

> **Platform Vision**: FoundrCast is a premium, high-impact video streaming and creator community platform designed specifically for startup founders, tech builders, and innovators.  
> **Brand Direction**: Sleek, modern, obsidian dark aesthetic with electric accents, rich glassmorphism, responsive navigation, and fluid micro-animations. **NOT a generic clone**.

---

## 1. Visual Identity & Design System Tokens

### 1.1 Color Palette
```css
:root {
  /* Surface & Background Colors */
  --bg-dark-base: #090a0f;
  --bg-dark-surface: #12151e;
  --bg-dark-card: #181c28;
  --bg-dark-hover: #222738;
  --glass-bg: rgba(24, 28, 40, 0.75);
  --glass-border: rgba(255, 255, 255, 0.08);

  /* Primary Accent & Brand Colors */
  --brand-primary: #6366f1;       /* Deep Indigo */
  --brand-accent: #a855f7;        /* Vibrant Purple */
  --brand-cyan: #06b6d4;          /* Electric Cyan */
  --brand-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%);
  --brand-gradient-hover: linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #0891b2 100%);

  /* Text & Content Colors */
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #0f172a;

  /* State Colors */
  --state-success: #10b981;
  --state-error: #ef4444;
  --state-warning: #f59e0b;
  --state-info: #3b82f6;

  /* Elevation Shadows & Glows */
  --glow-primary: 0 0 20px rgba(99, 102, 241, 0.35);
  --glow-accent: 0 0 20px rgba(168, 85, 247, 0.35);
  --shadow-card: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}
```

### 1.2 Typography
- **Primary Font**: `Outfit`, `Inter`, sans-serif (Google Fonts)
- **Code/Tech Font**: `JetBrains Mono`, monospace
- **Hierarchy**:
  - `Display H1`: 36px / Bold / Line Height 1.2
  - `Section H2`: 24px / SemiBold / Line Height 1.3
  - `Card H3`: 18px / Medium / Line Height 1.4
  - `Body Regular`: 14px / Regular / Line Height 1.5
  - `Caption / Badge`: 12px / Medium / Tracking 0.5px

---

## 2. Layout & Page Specifications

```
+-------------------------------------------------------------------------+
| [LOGO] FoundrCast    [Search input bar...]       [Upload] [User Avatar] |
+-------------------------------------------------------------------------+
| [Side Nav] |                                                            |
|  Home      |  [Category Chips: All | Tech | AI | Startups | Design]    |
|  Explore   |                                                            |
|  Subscribed|  +-------------------+  +-------------------+              |
|  Library   |  | Thumbnail         |  | Thumbnail         |              |
|  History   |  | (04:15)           |  | (12:30)           |              |
|  Liked     |  | Title of video... |  | Title of video... |              |
|  Dashboard |  | Creator • 1.2k v  |  | Creator • 4.5k v  |              |
|            |  +-------------------+  +-------------------+              |
+-------------------------------------------------------------------------+
```

### 2.1 Navigation & Header (Top Bar & Collapsible Sidebar)
- **Top Navigation Bar**: Fixed header with glassmorphism backdrop blur. Features:
  - FoundrCast brand logo with gradient icon.
  - Central search bar with quick shortcut filter button and clear button.
  - Quick "Publish Video" action button (opens Upload Modal).
  - User profile menu trigger with avatar preview, dropdown links for Profile Settings, Creator Dashboard, and Logout.
- **Responsive Sidebar Drawer**:
  - Desktop: Collapsible sidebar with active link glow indicators.
  - Mobile: Bottom navigation bar with primary icons (Home, Explore, Subscriptions, Library).

---

### 2.2 Home Feed Page (`HomePage.jsx`)
- **Category Filter Chips**: Top scrollable chip bar (`All`, `Startups`, `AI & Code`, `Founders`, `Tech News`, `Design`).
- **Video Feed Grid**: Responsive grid layout (1 column on mobile, 2 on tablet, 3-4 on desktop).
- **Video Card UI**:
  - 16:9 aspect ratio thumbnail with duration badge (`mm:ss`) in bottom-right corner.
  - Channel avatar with hover glow.
  - Truncated 2-line title with high legibility.
  - Channel name (clickable to `/c/:username`), view count (`1.4k views`), and relative timestamp (`2 days ago`).
- **Loading State**: Skeleton cards with pulsing gradient animations.
- **Empty State**: Custom vector graphic with message "No videos found matching your topic" and reset filters button.

---

### 2.3 Watch Page (`WatchPage.jsx`)
- **Video Player Section**:
  - Full-width HTML5 video player with sleek custom control bar (play/pause, volume slider, progress scrubber, duration timer, fullscreen toggle).
  - Auto-increments view count via `POST /api/v1/videos/view/:videoId`.
- **Primary Video Metadata Bar**:
  - Video title (h1 font).
  - Channel Info Row: Creator avatar, username, subscriber count badge, and animated **Subscribe / Unsubscribe** button.
  - Action Controls:
    - **Like / Unlike Button**: Displays total likes count, toggles active heart icon state.
    - **Save to Playlist Button**: Opens playlist selection modal.
    - **Share Button**: Copies video link to clipboard with toast notification.
- **Expandable Description Box**:
  - Dark glass surface showing views, upload date, and full description with "Show More / Show Less" toggle.
- **Comments Section**:
  - Total comments count header.
  - New comment form with user avatar, textarea, and submit button.
  - Comment items list with owner avatar, username, timestamp, content text, like count button, edit action (if owner), and delete action (if owner).
- **Related Videos Sidebar Column**:
  - Compact horizontal video cards list for continuous viewing.

---

### 2.4 Channel Page (`ChannelPage.jsx`)
- **Channel Banner / Cover Image**: Full-width header image (default gradient fallback if cover image is empty).
- **Channel Info Header**:
  - Large circular avatar with outline ring.
  - Full name, username handle (`@username`), subscriber count badge, subscribed channels count badge.
  - Subscribe button (if visiting another channel) or Edit Profile Banner/Avatar buttons (if visiting own channel).
- **Tab Navigation Bar**:
  - `Videos`: Grid of videos uploaded by this channel.
  - `Playlists`: Grid of playlists created by this creator.
  - `Tweets / Community`: Feed of short text posts created by this channel with inline like & reply counts.
  - `Subscribers`: List of user subscribers with avatars.
  - `Subscribed To`: List of channels this user follows.

---

### 2.5 Creator Studio & Upload Experience (`DashboardPage.jsx`)
- **Top Analytics Stats Grid**:
  - **Total Views**: Metric card with view icon and value.
  - **Total Subscribers**: Metric card with audience icon and value.
  - **Total Likes**: Metric card with heart icon and value.
  - **Total Videos**: Metric card with video icon and count.
- **Video Management Table**:
  - Columns: Thumbnail, Title, Views, Publish Status, Upload Date, Actions.
  - **Publish Status Toggle**: Interactive toggle switch calling `/api/v1/videos/toggle/publish/:videoId`.
  - **Edit Video Button**: Opens Edit Modal to update title, description, thumbnail.
  - **Delete Video Button**: Triggers confirmation dialog to delete video permanently.
- **Video Upload Modal**:
  - Drag-and-drop zone for `videoFile` (`.mp4`, `.webm`, `.mov`).
  - Drag-and-drop zone for `thumbnail` (`.jpg`, `.png`, `.webp`).
  - Form fields for Title and Description.
  - Real-time progress bar indicator (0% - 100%) during upload.

---

### 2.6 Playlists & Library Views (`PlaylistsPage.jsx`)
- **Create Playlist Modal**: Name & description form inputs.
- **Playlist Grid**: Card list with stacked thumbnail effect, video count badge, and playlist title.
- **Playlist Detail Page**: Header with playlist title, description, owner details, and list of videos with "Remove from playlist" action.

---

### 2.7 User History & Liked Videos (`HistoryPage.jsx`, `LikedVideosPage.jsx`)
- Clean list layouts showing watched or liked videos with timestamp indicators, view counts, and quick play buttons.

---

### 2.8 Account & Profile Settings Modal / Page
- Tabs for:
  - **General Account**: Update Full Name and Email.
  - **Avatar & Banner**: Change profile avatar image or cover header banner.
  - **Security**: Change current password with old password confirmation.

---

## 3. Responsive Breakpoints & Motion Specification

### Breakpoint Architecture
- `sm`: `640px` (Mobile landscape & large phones)
- `md`: `768px` (Tablets & small laptops)
- `lg`: `1024px` (Desktop screens)
- `xl`: `1280px` (Large widescreen monitors)

### Micro-Animations & Transitions
- **Hover Scale**: Buttons and video cards scale up `1.02x` with `200ms cubic-bezier(0.4, 0, 0.2, 1)`.
- **Active State Glow**: Like buttons and subscribe buttons display an ambient glow ring when active.
- **Modal Entry**: Backdrop blurs `backdrop-filter: blur(8px)` with scale transition `scale(0.95) -> scale(1.0)`.
- **Skeleton Pulse**: Smooth linear gradient scan animation `background-position: -200% -> 200%`.
