# 01 Backend Audit & Endpoint Inventory

> **Audited Repository**: `FoundrCast/BACK-END`  
> **Source Files Inspected**: `src/app.js`, `src/routes/*.js`, `src/controllers/*.js`, `src/models/*.js`, `src/middlewares/*.js`, `src/utils/*.js`

---

## 1. Overview & Architecture Summary

The backend is built with **Node.js**, **Express v5**, and **MongoDB** (Mongoose v9).  
It uses **JSON Web Tokens (JWT)** (stored in HTTP-Only cookies or Authorization Bearer header) for authentication, **Multer** for local temporary file buffering (`public/temp`), and **Cloudinary** for cloud media asset storage.

### Global Middlewares Configured (`app.js`)
- `cors({ origin: process.env.CORS_ORIGIN, credentials: true })`
- `express.json({ limit: "16kb" })`
- `express.urlencoded({ extended: true, limit: "16kb" })`
- `express.static('public')`
- `cookieParser()`
- `errorHandler` (Custom global error middleware)

### Base API Route Prefixes
| Module | Base Path | Router File | Controller File |
|---|---|---|---|
| Healthcheck | `/api/v1/healthcheck` | `healthcheck.routes.js` | `healthcheck.controller.js` |
| Users / Auth | `/api/v1/users` | `user.routes.js` | `user.controller.js` |
| Videos | `/api/v1/videos` | `video.routes.js` | `video.controller.js` |
| Comments | `/api/v1/comments` | `comment.routes.js` | `comment.controller.js` |
| Likes | `/api/v1/likes` | `like.routes.js` | `like.controller.js` |
| Subscriptions | `/api/v1/subscriptions` | `subscription.routes.js` | `subscription.controller.js` |
| Playlists | `/api/v1/playlist` | `playlist.routes.js` | `playlist.controller.js` |
| Tweets | `/api/v1/tweets` | `tweet.routes.js` | `tweet.controller.js` |
| Dashboard | `/api/v1/dashboard` | `dashboard.routes.js` | `dashboard.controller.js` |

---

## 2. Comprehensive Endpoint Inventory

### 2.1 Authentication & User Management (`/api/v1/users`)

#### 1. Register User
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/users/register`
- **Auth Required**: No
- **Ownership Required**: N/A
- **Request Format**: `multipart/form-data`
- **Required Body Fields**: `fullName`, `email`, `username`, `password`
- **Required Files**: `avatar` (1 file)
- **Optional Files**: `coverImage` (1 file)
- **Path / Query Params**: None
- **Success Response Structure**: `201 Created`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "username": "...",
      "email": "...",
      "fullName": "...",
      "avatar": "https://res.cloudinary.com/...",
      "avatar_publicId": "...",
      "coverImage": "https://res.cloudinary.com/...",
      "coverImage_publicId": "...",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "message": "User registered Successfully lol",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Missing required fields or avatar file), `409` (Username or email already exists), `500` (Cloudinary upload failure / DB registration failure).
- **Intended Frontend Usage**: User Signup form page with avatar and optional cover banner upload inputs.

---

#### 2. Login User
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/users/login`
- **Auth Required**: No
- **Request Format**: `application/json` or `application/x-www-form-urlencoded`
- **Required Body Fields**: `password`, plus either `email` OR `username`
- **Path / Query Params**: None
- **Cookies Set**: `accessToken`, `refreshToken` (HTTP-Only, Secure)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "...",
        "username": "...",
        "email": "...",
        "fullName": "...",
        "avatar": "...",
        "coverImage": "..."
      },
      "accessToken": "ey...",
      "refreshToken": "ey..."
    },
    "message": "User logged In Successfully!!",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Missing credentials/password), `404` (User does not exist), `401` (Invalid user credentials).
- **Intended Frontend Usage**: Login page. Stores tokens in memory/state and browser cookies automatically.

---

#### 3. Logout User
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/users/logout`
- **Auth Required**: Yes (`verifyJWT`)
- **Request Format**: None / Empty Body
- **Cookies Cleared**: `accessToken`, `refreshToken`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "User logged Out",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Unauthorized request / invalid token).
- **Intended Frontend Usage**: User profile / header dropdown Logout button.

---

#### 4. Refresh Access Token
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/users/refresh-token`
- **Auth Required**: No (Uses incoming refresh token from cookies or body)
- **Request Format**: `application/json` or Cookie
- **Optional Body Fields**: `refreshToken` (if cookie is absent)
- **Cookies Set**: Updated `accessToken`, `refreshToken`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "accessToken": "ey...",
      "newRefreshToken": "ey..."
    },
    "message": "Access token refreshed",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Unauthorized request / Token expired or used / User not found).
- **Intended Frontend Usage**: Axios response interceptor for automatic silent token renewal when API calls return 401.

---

#### 5. Change Current Password
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/users/change-password`
- **Auth Required**: Yes (`verifyJWT`)
- **Request Format**: `application/json`
- **Required Body Fields**: `oldPassword`, `newPassword`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Password changed successfully",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Invalid old password or unauthorized token).
- **Intended Frontend Usage**: Account Settings / Password Change tab.

---

#### 6. Get Current User
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/users/current-user`
- **Auth Required**: Yes (`verifyJWT`)
- **Request Format**: None
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "username": "...",
      "email": "...",
      "fullName": "...",
      "avatar": "...",
      "coverImage": "..."
    },
    "message": "Current user fetched successfully",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Unauthorized).
- **Intended Frontend Usage**: App initialization / session bootstrap check in `AuthContext`.

---

#### 7. Update Account Details
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/users/update-account`
- **Auth Required**: Yes (`verifyJWT`)
- **Request Format**: `application/json`
- **Required Body Fields**: `fullName`, `email`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "username": "...",
      "email": "...",
      "fullName": "...",
      "avatar": "...",
      "coverImage": "..."
    },
    "message": "Account details updated successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (All fields required), `409` (Email taken by another user).
- **Intended Frontend Usage**: Profile settings form for updating display name and email.

---

#### 8. Update User Avatar
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/users/avatar`
- **Auth Required**: Yes (`verifyJWT`)
- **Request Format**: `multipart/form-data`
- **Required File**: `avatar` (1 file)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "avatar": "https://res.cloudinary.com/...",
      "avatar_publicId": "..."
    },
    "message": "Avatar image updated successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Missing avatar file / upload error), `401` (Unauthorized).
- **Intended Frontend Usage**: Quick avatar upload button on profile page.

---

#### 9. Update User Cover Image
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/users/cover-image`
- **Auth Required**: Yes (`verifyJWT`)
- **Request Format**: `multipart/form-data`
- **Required File**: `coverImage` (1 file)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "coverImage": "https://res.cloudinary.com/...",
      "coverImage_publicId": "..."
    },
    "message": "Cover image updated successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Missing file), `401` (Unauthorized).
- **Intended Frontend Usage**: Channel banner update input on user's own channel page.

---

#### 10. Get User Channel Profile
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/users/c/:username`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `username` (Channel handle)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "fullName": "...",
      "username": "...",
      "email": "...",
      "avatar": "...",
      "coverImage": "...",
      "subscribersCount": 42,
      "channelsSubscribedToCount": 10,
      "isSubscribed": true
    },
    "message": "User channel fetched successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Username missing), `404` (Channel does not exist).
- **Intended Frontend Usage**: Channel header and channel detail page initialization.

---

#### 11. Get Watch History
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/users/history`
- **Auth Required**: Yes (`verifyJWT`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "...",
        "title": "...",
        "description": "...",
        "thumbnail": "...",
        "videoFile": "...",
        "duration": 120,
        "views": 1500,
        "owner": {
          "fullName": "...",
          "username": "...",
          "avatar": "..."
        }
      }
    ],
    "message": "Watch history fetched successfully",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Unauthorized).
- **Intended Frontend Usage**: User Watch History page.

---

### 2.2 Videos (`/api/v1/videos`)

#### 1. Get All Videos
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/videos`
- **Auth Required**: Yes (`verifyJWT`)
- **Query Parameters**:
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `10`)
  - `query`: Text search term for title & description
  - `sortBy`: Field name to sort by (e.g. `createdAt`, `views`)
  - `sortType`: Sort order (`asc` or `desc`)
  - `userId`: Filter videos created by specific user ObjectId
- **Success Response Structure**: `200 OK` (Mongoose Aggregate Paginate envelope)
  ```json
  {
    "statusCode": 200,
    "data": {
      "docs": [
        {
          "_id": "...",
          "title": "...",
          "description": "...",
          "thumbnail": "...",
          "videoFile": "...",
          "duration": 340,
          "views": 120,
          "createdAt": "...",
          "isPublished": true,
          "channel": {
            "_id": "...",
            "username": "...",
            "avatar": "..."
          }
        }
      ],
      "totalDocs": 25,
      "limit": 10,
      "page": 1,
      "totalPages": 3,
      "pagingCounter": 1,
      "hasPrevPage": false,
      "hasNextPage": true,
      "prevPage": null,
      "nextPage": 2
    },
    "message": "Videos fetched successfully",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Unauthorized).
- **Intended Frontend Usage**: Home feed grid, search results page, and channel videos grid.

---

#### 2. Publish A Video
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/videos`
- **Auth Required**: Yes (`verifyJWT`)
- **Request Format**: `multipart/form-data`
- **Required Body Fields**: `title`, `description`
- **Required Files**: `videoFile` (1 file), `thumbnail` (1 file)
- **Success Response Structure**: `201 Created`
  ```json
  {
    "statusCode": 201,
    "data": {
      "newVideo": {
        "_id": "...",
        "title": "...",
        "description": "...",
        "videoFile": "https://res.cloudinary.com/...",
        "thumbnail": "https://res.cloudinary.com/...",
        "duration": 185.4,
        "views": 0,
        "isPublished": true,
        "owner": "..."
      },
      "channel": {
        "_id": "...",
        "username": "...",
        "avatar": "..."
      }
    },
    "message": "Video published successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Missing title/description/files), `500` (Cloudinary upload error).
- **Intended Frontend Usage**: Creator Studio video upload modal/page.

---

#### 3. Get Video By ID
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/videos/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `videoId` (Mongo ObjectId)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "title": "...",
      "description": "...",
      "thumbnail": "...",
      "videoUrl": "...",
      "duration": 210,
      "createdAt": "...",
      "isPublished": true,
      "channel": {
        "_id": "...",
        "username": "...",
        "avatar": "..."
      },
      "tottalLikes": 15,
      "totalComments": 4
    },
    "message": "Video found",
    "success": true
  }
  ```
  > **Note Backend Reality**: Notice the typo in backend controller property `tottalLikes` (double 't'). The frontend API adapter must map `tottalLikes` to `totalLikes`.
- **Error Behavior**: `400` (Invalid video ID), `404` (Video not found), `403` (Video is private and user is not owner).
- **Intended Frontend Usage**: Watch page player & metadata section.

---

#### 4. Update Video Details
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/videos/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`verifyVideoOwnership`)
- **Request Format**: `multipart/form-data` or `application/json`
- **Optional Body Fields**: `title`, `description`
- **Optional Files**: `thumbnail` (1 file)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "title": "Updated Title",
      "description": "Updated Desc",
      "thumbnail": "https://..."
    },
    "message": "Video updated successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID), `403` (Not authorized/not owner), `404` (Video not found).
- **Intended Frontend Usage**: Creator Dashboard video edit modal.

---

#### 5. Delete Video
- **HTTP Method**: `DELETE`
- **Exact Path**: `/api/v1/videos/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`verifyVideoOwnership`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Video deleted successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID), `403` (Not owner), `404` (Not found).
- **Intended Frontend Usage**: Creator Dashboard delete confirmation action.

---

#### 6. Toggle Video Publish Status
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/videos/toggle/publish/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`verifyVideoOwnership`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "isPublished": false
    },
    "message": "Publish status toggled successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID), `403` (Not owner).
- **Intended Frontend Usage**: Creator Dashboard publish/unpublish toggle switch.

---

#### 7. Increase Video View Count
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/videos/view/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `videoId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "View counted",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid video ID).
- **Intended Frontend Usage**: Triggered on Watch page when video playback starts / passes threshold.

---

### 2.3 Comments (`/api/v1/comments`)

#### 1. Get Video Comments
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/comments/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Query Parameters**: `page` (default: 1), `limit` (default: 10)
- **Success Response Structure**: `200 OK` (Paginated)
  ```json
  {
    "statusCode": 200,
    "data": {
      "docs": [
        {
          "_id": "...",
          "content": "Awesome video!",
          "createdAt": "...",
          "owner": {
            "_id": "...",
            "username": "...",
            "avatar": "..."
          }
        }
      ],
      "totalDocs": 18,
      "limit": 10,
      "page": 1,
      "totalPages": 2
    },
    "message": "Comments fetched successfully",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid video ID).
- **Intended Frontend Usage**: Comment section on Watch page.

---

#### 2. Add Comment
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/comments/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Required Body Fields**: `content`
- **Success Response Structure**: `201 Created`
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "...",
      "content": "Great foundrcast!",
      "owner": "...",
      "video": "..."
    },
    "message": "Comment added",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid video ID or missing content).
- **Intended Frontend Usage**: Watch page new comment form.

---

#### 3. Update Comment
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/comments/c/:commentId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`comment.owner.equals(req.user._id)`)
- **Required Body Fields**: `content`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "content": "Updated comment text"
    },
    "message": "Comment updated",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID / empty content), `403` (Not authorized), `404` (Comment not found).
- **Intended Frontend Usage**: Inline comment edit action.

---

#### 4. Delete Comment
- **HTTP Method**: `DELETE`
- **Exact Path**: `/api/v1/comments/c/:commentId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`comment.owner.equals(req.user._id)`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Comment deleted",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID), `403` (Not authorized), `404` (Not found).
- **Intended Frontend Usage**: Inline comment delete action.

---

### 2.4 Likes (`/api/v1/likes`)

#### 1. Toggle Video Like
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/likes/toggle/v/:videoId`
- **Auth Required**: Yes (`verifyJWT`)
- **Success Response Structure**: `200 OK` / `201 Created`
  - Liked: `201 Created` -> `{ "statusCode": 201, "data": {}, "message": "Video liked!", "success": true }`
  - Unliked: `200 OK` -> `{ "statusCode": 200, "data": {}, "message": "Video unliked", "success": true }`
- **Error Behavior**: `400` (Invalid video ID).
- **Intended Frontend Usage**: Like button on Watch page video player toolbar.

---

#### 2. Toggle Comment Like
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/likes/toggle/c/:commentId`
- **Auth Required**: Yes (`verifyJWT`)
- **Success Response Structure**: `200 OK` (Unliked) / `201 Created` (Liked)
- **Error Behavior**: `400` (Invalid comment ID).
- **Intended Frontend Usage**: Like button next to comment item.

---

#### 3. Toggle Tweet Like
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/likes/toggle/t/:tweetId`
- **Auth Required**: Yes (`verifyJWT`)
- **Success Response Structure**: `200 OK` (Unliked) / `201 Created` (Liked)
- **Error Behavior**: `400` (Invalid tweet ID).
- **Intended Frontend Usage**: Like button on community tweet post item.

---

#### 4. Get Liked Videos
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/likes/videos`
- **Auth Required**: Yes (`verifyJWT`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "...",
        "likedBy": "...",
        "video": {
          "_id": "...",
          "title": "...",
          "thumbnail": "...",
          "views": 100,
          "duration": 120
        }
      }
    ],
    "message": "Liked videos fetched successfully",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Unauthorized).
- **Intended Frontend Usage**: User Liked Videos playlist/page.

---

### 2.5 Subscriptions (`/api/v1/subscriptions`)

#### 1. Toggle Channel Subscription
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/subscriptions/c/:channelId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `channelId`
- **Success Response Structure**:
  - Subscribed: `201 Created` -> `{ "statusCode": 201, "data": {}, "message": "Subscribed!", "success": true }`
  - Unsubscribed: `200 OK` -> `{ "statusCode": 200, "data": {}, "message": "Channel unsubscribed", "success": true }`
- **Error Behavior**: `400` (Invalid channel ID / Cannot subscribe to self).
- **Intended Frontend Usage**: Subscribe button on Watch page channel row and Channel Profile header.

---

#### 2. Get Channel Subscribers
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/subscriptions/c/:channelId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `channelId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "subscribers": [
        {
          "_id": "...",
          "subscriber": {
            "_id": "...",
            "username": "...",
            "avatar": "..."
          }
        }
      ],
      "totalSubscribers": 1
    },
    "message": "Subscribers fetched",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid channel ID), `404` (Channel not found).
- **Intended Frontend Usage**: Channel Subscribers tab.

---

#### 3. Get Subscribed Channels
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/subscriptions/u/:subscriberId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `subscriberId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "...",
        "channel": {
          "_id": "...",
          "username": "...",
          "avatar": "..."
        }
      }
    ],
    "message": "Subscribed channels fetched",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid subscriber ID), `404` (User not found).
- **Intended Frontend Usage**: Subscriptions sidebar item list & Channel Subscribed Channels tab.

---

### 2.6 Playlists (`/api/v1/playlist`)

#### 1. Create Playlist
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/playlist`
- **Auth Required**: Yes (`verifyJWT`)
- **Required Body Fields**: `name`, `description`
- **Success Response Structure**: `201 Created`
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "...",
      "name": "Tech Podcasts",
      "description": "Best podcast highlights",
      "owner": "...",
      "videos": []
    },
    "message": "Playlist created",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Missing name/description or playlist name already exists for user), `500` (Server error).
- **Intended Frontend Usage**: Create Playlist modal dialog.

---

#### 2. Get User Playlists
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/playlist/user/:userId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `userId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "...",
        "name": "...",
        "description": "...",
        "videos": ["..."]
      }
    ],
    "message": "Playlists fetched",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid user ID).
- **Intended Frontend Usage**: Library page, Channel Playlists tab, Save to Playlist modal dropdown.

---

#### 3. Get Playlist By ID
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/playlist/:playlistId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `playlistId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "name": "...",
      "description": "...",
      "owner": "...",
      "videos": [
        {
          "_id": "...",
          "title": "...",
          "thumbnail": "...",
          "duration": 150
        }
      ]
    },
    "message": "Playlist fetched",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID), `404` (Playlist not found).
- **Intended Frontend Usage**: Playlist detail view page.

---

#### 4. Add Video To Playlist
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/playlist/add/:videoId/:playlistId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`playlist.owner.equals(req.user._id)`)
- **Path Parameters**: `videoId`, `playlistId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "videos": [
        {
          "_id": "...",
          "title": "...",
          "thumbnail": "..."
        }
      ]
    },
    "message": "Video added",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid IDs), `403` (Not playlist owner), `404` (Playlist or video not found).
- **Intended Frontend Usage**: Watch page "Save to Playlist" modal item selection.

---

#### 5. Remove Video From Playlist
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/playlist/remove/:videoId/:playlistId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`playlist.owner.equals(req.user._id)`)
- **Path Parameters**: `videoId`, `playlistId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "videos": []
    },
    "message": "Video removed from playlist",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid IDs), `403` (Not owner), `404` (Playlist not found).
- **Intended Frontend Usage**: Remove action inside Playlist detail view page.

---

#### 6. Update Playlist Details
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/playlist/:playlistId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`playlist.owner.equals(req.user._id)`)
- **Optional Body Fields**: `name`, `description`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "name": "New Title",
      "description": "New Desc"
    },
    "message": "Playlist updated",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Name/description required), `403` (Not owner), `404` (Not found).
- **Intended Frontend Usage**: Playlist edit modal dialog.

---

#### 7. Delete Playlist
- **HTTP Method**: `DELETE`
- **Exact Path**: `/api/v1/playlist/:playlistId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`playlist.owner.equals(req.user._id)`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Playlist deleted",
    "success": true
  }
  ```
- **Error Behavior**: `403` (Not owner), `404` (Not found).
- **Intended Frontend Usage**: Playlist delete action button.

---

### 2.7 Tweets / Community Posts (`/api/v1/tweets`)

#### 1. Create Tweet
- **HTTP Method**: `POST`
- **Exact Path**: `/api/v1/tweets`
- **Auth Required**: Yes (`verifyJWT`)
- **Required Body Fields**: `content`
- **Success Response Structure**: `201 Created`
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "...",
      "content": "Excited for the upcoming stream!",
      "owner": "..."
    },
    "message": "Tweet created",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Content required).
- **Intended Frontend Usage**: Community posts creator widget on channel page.

---

#### 2. Get User Tweets
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/tweets/user/:userId`
- **Auth Required**: Yes (`verifyJWT`)
- **Path Parameters**: `userId`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "...",
        "content": "...",
        "owner": {
          "_id": "...",
          "username": "...",
          "avatar": "..."
        },
        "createdAt": "..."
      }
    ],
    "message": "Tweets fetched",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid user ID), `404` (No tweets found for this user).
- **Intended Frontend Usage**: Channel Tweets / Community tab.

---

#### 3. Update Tweet
- **HTTP Method**: `PATCH`
- **Exact Path**: `/api/v1/tweets/:tweetId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`tweet.owner.equals(req.user._id)`)
- **Required Body Fields**: `content`
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "...",
      "content": "Updated post content"
    },
    "message": "Tweet updated",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID / content required), `403` (Not authorized), `404` (Not found).
- **Intended Frontend Usage**: Edit tweet inline action.

---

#### 4. Delete Tweet
- **HTTP Method**: `DELETE`
- **Exact Path**: `/api/v1/tweets/:tweetId`
- **Auth Required**: Yes (`verifyJWT`)
- **Ownership Required**: Yes (`tweet.owner.equals(req.user._id)`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Tweet deleted",
    "success": true
  }
  ```
- **Error Behavior**: `400` (Invalid ID), `403` (Not authorized), `404` (Not found).
- **Intended Frontend Usage**: Delete tweet inline action.

---

### 2.8 Dashboard (`/api/v1/dashboard`)

#### 1. Get Channel Stats
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/dashboard/stats`
- **Auth Required**: Yes (`verifyJWT`)
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "totalVideos": 12,
      "totalViews": 4520,
      "totalLikes": 380,
      "totalSubscribers": 150
    },
    "message": "Channel stats fetched",
    "success": true
  }
  ```
- **Error Behavior**: `500` (Error while aggregating video stats or counting subscribers).
- **Intended Frontend Usage**: Creator Dashboard top metrics cards.

---

#### 2. Get Channel Videos
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/dashboard/videos`
- **Auth Required**: Yes (`verifyJWT`)
- **Query Parameters**: `page` (default: 1), `limit` (default: 10)
- **Success Response Structure**: `200 OK` (Paginated)
  ```json
  {
    "statusCode": 200,
    "data": {
      "docs": [
        {
          "_id": "...",
          "title": "...",
          "thumbnail": "...",
          "views": 450,
          "isPublished": true,
          "createdAt": "..."
        }
      ],
      "totalDocs": 12,
      "limit": 10,
      "page": 1,
      "totalPages": 2
    },
    "message": "Channel videos fetched",
    "success": true
  }
  ```
- **Error Behavior**: `401` (Unauthorized).
- **Intended Frontend Usage**: Creator Dashboard video management table.

---

### 2.9 Health (`/api/v1/healthcheck`)

#### 1. Healthcheck Test
- **HTTP Method**: `GET`
- **Exact Path**: `/api/v1/healthcheck/test`
- **Auth Required**: No
- **Success Response Structure**: `200 OK`
  ```json
  {
    "statusCode": 200,
    "data": {
      "status": "OK"
    },
    "message": "Server is healthy",
    "success": true
  }
  ```
- **Intended Frontend Usage**: Initial server connection check / status ping.
