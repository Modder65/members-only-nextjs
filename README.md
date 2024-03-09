# MembersOnly

MembersOnly is a private social media platform built with Next.js Users can engage in the creation of posts, comments, and replies in a community-driven environment.

## Features

- **Invite Only Registration**: Users can only create an account after receiving an invitation link with a unique url token from an admin.
- **User Authentication**: Secure sign-up and login process using the new Auth.js v5. Role based authorization for specific actions. Middleware to prevent protected routes from being accessed by users who don't have an account.
- **Email Verification**: Used for sign-up, 2FA and password reset features.
- **Posts**: Users can create posts.
- **Comments**: Users can comment on posts.
- **Replies**: Users can reply to comments, enabling threaded conversations.
- **Likes**: Users can like posts, comments and replies.
- **Friends**: Fully functional friends system. Users can send friend requests to other users, accept or decline friend requests and unfriend. 
- **Pagination w/ Infinite Scroll**: Via the react-intersection-observer library. Used for posts on the home page. Posts are loaded in batches of 10 with a smooth infinite scrolling experience.
- **Real-time Updates**: Posts, comments, replies, likes, and friends update in real-time using Pusher.

## Technologies Used

- **Next.js**: A React framework for building server-side rendering and static web applications.
- **Auth.js v5**: A complete open-source authentication solution for Next.js applications.
- **Resend**: An email service used to send verification emails to users.
- **MongoDB**: A NoSQL database used to store all data.
- **Prisma**: An ORM that communicates with and defines the structure of data stored in the MongoDB database.
- **Zustand**: A state management library for react.
- **Pusher**: A hosted API service that handles real-time data updates.
- **JSON Web Tokens**: For secure and efficient session management.


