# MembersOnly

MembersOnly is a private social media platform built with **Next.js**. Users can engage in the creation of posts, comments, and replies in a community-driven environment.

## Table of Contents
- [MembersOnly](#membersonly)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack and Tools](#tech-stack-and-tools)

## Features

- **Invite Only Registration**: Users can only create an account after receiving an invitation link with a unique URL token from an admin.
- **User Authentication**: Secure sign-up and login process using the new **Auth.js v5**. Role-based authorization for specific actions. Middleware to prevent protected routes from being accessed by unauthorized users.
- **Email Verification**: Essential for sign-up, 2FA, and password reset features. 
- **Posts**: Users can create posts and include images.
  ![Post Demo](/public/gifs/PostGif.gif)
- **Edit Posts**: Users can edit their posts anytime.
  ![Edit Post Demo](/public/gifs/EditPostGif.gif)
- **Comments & Replies**: Enable engaging discussions through comments and threaded replies.
  - ![Comment Demo](/public/gifs/PusherCommentGif.gif)
  - ![Reply Demo](/public/gifs/ReplyGif.gif)
- **Likes**: Users can like posts, comments, and replies to show appreciation.
  ![Like Demo](/public/gifs/LikeGif.gif)
- **Friends System**: Allows users to connect with others through friend requests, accepting or declining them, and unfriending.
- **Pagination w/ Infinite Scroll**: Smooth browsing experience with posts loaded in batches, powered by `react-intersection-observer`.
- **Post Filtering**: Sort posts by newest/oldest, specific user, or both.
  ![Filter Demo](/public/gifs/PostFilterGif.gif)
- **Real-time Updates**: Utilizes **Pusher** for live updates of posts, comments, likes, and friends without page refreshes.
  ![Pusher Demo](/public/gifs/PusherCommentGif.gif)
- **Multiple Themes**: Offers five different themes, savable in `localStorage` for user preference retention.
  ![Theme Demo](/public/gifs/ThemeChangeGif.gif)

## Tech Stack and Tools

- **Next.js**: A React framework for SSR and static web applications.
- **Next-Cloudinary**: Manages image uploads.
- **TypeScript**: Ensures type safety across the codebase.
- **Tailwind CSS**: A utility-first css framework.
- **Shadcn-ui**: Open-source, customizable and accessible react components for UI.
- **Auth.js v5**: Open-source authentication solution.
- **Bcrypt**: Secures user passwords.
- **Resend**: Sends verification emails.
- **MongoDB**: Stores application data.
- **Prisma**: ORM for database management.
- **Zustand**: State management for React.
- **Pusher**: Handles real-time data updates.
- **JSON Web Tokens**: Manages sessions securely and efficiently.

