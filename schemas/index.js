import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword:z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    } 

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    } 

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required"
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  }),
});

// Edit later
export const CreatePostSchema = z.object({
  title: z.string().min(4, {
    message: "Minimum 4 characters required",
  }),
  message: z.string().min(4, {
    message: "Minimum 4 characters required"
  }),
});

export const CreateCommentSchema = z.object({
  message: z.string().min(1, {
    message: "Message is required"
  }),
});

export const CreateReplySchema = z.object({
  message: z.string().min(1, {
    message: "Message is required"
  }),
});

export const InvitationSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const SearchUserSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const FilterPostSchema = z.object({
  sortOrder: z.enum(["desc", "asc"], {
    required_error: "Sort order is required",
    invalid_type_error: "Invalid sort order"
  }),
  name: z.optional(z.string()),
});