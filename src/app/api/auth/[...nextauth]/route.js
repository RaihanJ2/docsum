import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/models/User";
import connectDB from "@/app/utils/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Connect to database
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user if doesn't exist
          const newUser = new User({
            email: user.email,
            name: user.name || profile.name,
            picture: user.image || profile.picture,
          });

          await newUser.save();
          console.log(`✅ New user created: ${user.email}`);
        } else {
          // Update existing user info if needed
          let updateNeeded = false;
          const updates = {};

          if (existingUser.picture !== (user.image || profile.picture)) {
            updates.picture = user.image || profile.picture;
            updateNeeded = true;
          }

          if (existingUser.name !== (user.name || profile.name)) {
            updates.name = user.name || profile.name;
            updateNeeded = true;
          }

          if (updateNeeded) {
            await User.findByIdAndUpdate(existingUser._id, updates);
            console.log(`✅ User updated: ${user.email}`);
          }
        }

        return true;
      } catch (error) {
        console.error("❌ Error saving user to database:", error);
        // Still allow sign in even if database save fails
        return true;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.dbId = dbUser._id.toString();
          } else {
            // Fallback to token sub if user not found in DB
            session.user.id = token.sub;
          }
        } catch (error) {
          console.error("❌ Error fetching user from database:", error);
          session.user.id = token.sub;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Add user ID to token on first sign in
      if (user) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.dbId = dbUser._id.toString();
          }
        } catch (error) {
          console.error("❌ Error in JWT callback:", error);
        }
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`🔐 User signed in: ${user.email} (New: ${isNewUser})`);
    },
    async signOut({ session, token }) {
      console.log(`👋 User signed out: ${session?.user?.email || "Unknown"}`);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
