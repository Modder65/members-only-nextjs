# MembersOnly

MembersOnly is a blog-like platform built with Next.js, where users can engage in creating posts, commenting, and replying to comments in a community-driven environment.

## Features

- **User Authentication**: Secure sign-up and login process using NextAuth.
- **Email Verification**: New users receive a verification code via email to confirm their account, using nodemailer and elastic email.
- **Post Creation**: Authenticated users can create and publish posts.
- **Commenting**: Users can comment on posts.
- **Replying to Comments**: The platform allows users to reply to comments, enabling threaded conversations.
- **Real-time Updates**: Posts, comments, and replies update in real-time when created using Pusher/

## Technologies Used

- **Next.js**: A React framework for building server-side rendering and static web applications.
- **NextAuth**: A complete open-source authentication solution for Next.js applications.
- **Elastic Email**: An email service used to send verification emails to users.
- **MongoDB**: A NoSQL database used to store user data, posts, comments, and replies.
- **Pusher**: A hosted API service that handles real-time data updates.
- **JSON Web Tokens**: For secure and efficient session management.


