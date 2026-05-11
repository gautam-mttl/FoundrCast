# FoundrCast
 
> A video-first feedback platform for founders and VCs — built on a production-grade Node.js backend.
 
[![API Docs](https://img.shields.io/badge/API-Postman_Docs-orange?style=flat-square)](https://documenter.getpostman.com/view/41863970/2sBXirhnZn)
[![Architecture](https://img.shields.io/badge/Architecture-Eraser.io-blue?style=flat-square)](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)
[![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)](#license)
 
---
 
## The Idea
 
This started as a learning project — built to understand how industry-grade backends actually work.  
JWT auth, MongoDB schema design, REST API structure, subscription workflows — the fundamentals.
 
But somewhere during development, the architecture started feeling familiar for a problem I kept noticing:
 
**Founders have no good place to show their product in motion and get real feedback from people who matter.**
 
Loom links get buried in Slack. YouTube is too public too early. Static decks miss the product feel entirely.
 
What if this backend powered a **closed-loop video feedback platform — exclusively for founders and VCs?**
 
- Founders post short-form product walkthroughs and UI demos
- VCs and peers leave comments, replies, and tweet-style reactions  
- Subscription engine lets you track founders you're watching
- Channel dashboards become living founder profile pages
The infrastructure already supports all of this.  
The idea is just waiting for the right builder.
 
> *Built as a backend learning project. The use case found itself.*
 
---
 
## What It Does
 
FoundrCast is a full-featured video platform backend — think YouTube's core engine, rebuilt from scratch with clean architecture and industry-standard practices.
 
| Feature | Description |
|---|---|
| Auth & Sessions | JWT-based login with access + refresh token rotation |
| Video Management | Upload, update, delete, and stream video content |
| Social Layer | Comments, replies, likes, dislikes on videos |
| Subscriptions | Subscribe/unsubscribe with channel feed aggregation |
| Channel Dashboard | Per-user stats, video history, subscriber counts |
| Tweet System | Short-form post support alongside video content |
| Secure File Handling | Cloudinary integration for video and image storage |
| Pagination | Aggregation pipelines with cursor-based pagination |
 
---
 
## Architecture
 
```
src/
 ├── routes/          → API endpoint definitions
 ├── controllers/     → Business logic per resource
 ├── models/          → Mongoose schemas (User, Video, Comment, Tweet...)
 ├── middlewares/     → Auth guards, file upload handlers, error handling
 └── utils/           → Cloudinary client, JWT helpers, async wrappers
```
 
Full data model and system design →  
[View Architecture on Eraser.io](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)
 
---
 
## API
 
40+ RESTful endpoints documented and tested in Postman.
 
[View Full API Documentation →](https://documenter.getpostman.com/view/41863970/2sBXirhnZn)
 
Key endpoint groups:
- `/api/v1/users` — auth, profile, avatar
- `/api/v1/videos` — CRUD, streaming, visibility
- `/api/v1/comments` — threaded comments per video
- `/api/v1/likes` — likes on videos, comments, tweets
- `/api/v1/subscriptions` — subscribe, feed, subscriber list
- `/api/v1/dashboard` — channel stats and analytics
- `/api/v1/tweets` — short-form posts
---
 
## Tech Stack
 
| Package | Purpose |
|---|---|
| Node.js + Express | Server and routing |
| MongoDB + Mongoose | Database and ORM |
| JWT + bcrypt | Authentication and password hashing |
| Cloudinary | Video and image storage |
| Multer | File upload handling |
| cookie-parser | Cookie-based token management |
| cors | Cross-origin request handling |
| dotenv | Environment configuration |
| mongoose-aggregate-paginate-v2 | Aggregation pagination |
| nodemon | Development auto-restart |
 
---
 
## Run Locally
 
**Prerequisites:** Node.js 18+, MongoDB URI, Cloudinary account
 
```bash
# Clone the repo
git clone https://github.com/gautam-mttl/FoundrCast.git
cd FoundrCast
 
# Install dependencies
npm install
 
# Set up environment variables
cp .env.example .env
# Fill in your values (see below)
 
# Start dev server
npm run dev
```
 
---
 
## Environment Variables
 
Create a `.env` file in the root:
 
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
 
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
 
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
 
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
 
---
 
## License
 
Licensed under the **ISC License** — use this however you want.
 
---
 
*If this repo helped you understand backend architecture, leave a star. If you want to build the founder-facing product on top of this — reach out.*
