# MembersOnly

MembersOnly is a blog-like platform built with Next.js, where users can engage in creating posts, commenting, and replying to comments in a community-driven environment. The application features robust user authentication and session management, powered by NextAuth and JSON Web Tokens.

## Features

- **User Authentication**: Secure sign-up and login process using NextAuth.
- **Email Verification**: New users receive a verification code via email to confirm their account, using nodemailer and elastic email.
- **Post Creation**: Authenticated users can create and publish posts.
- **Commenting**: Users can comment on posts.
- **Replying to Comments**: The platform allows users to reply to comments, enabling threaded conversations.

## Technologies Used

- **Next.js**: A React framework for building server-side rendering and static web applications.
- **NextAuth**: A complete open-source authentication solution for Next.js applications.
- **MongoDB**: A NoSQL database used to store user data, posts, comments, and replies.
- **JSON Web Tokens**: For secure and efficient session management.
