// app/api/auth/[...nextauth]/options.js
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { UserModel } from "../../../../models/user.js"; // Adjust the path as needed

const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await UserModel.findOne({ email: credentials.email });
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id, name: user.name, email: user.email }; // object that gets encoded with the JWT
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt", 
    maxAge: 60 * 60, // token is valid for 1 hour 
    // additional JWT configuration if needed
  },
  // saves user id in token in session data
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  // Additional NextAuth configuration here
};

export default options;
