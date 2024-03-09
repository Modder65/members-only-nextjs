import { Prisma, User, Comment, Reply, Friendship, Like, Post } from "@prisma/client";

export type PublicUserInfo = Pick<User, 'id' | 'name' | 'email' | 'role'> & Partial<Pick<User, 'image'>>;

interface UploadInfo {
  access_mode: string;
  asset_id: string;
  batchId: string;
  bytes: number;
  created_at: string;
  etag: string;
  folder: string;
  format: string;
  height: number;
  id: string;
  original_filename: string;
  path: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  thumbnail_url: string;
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}

export interface UploadResult {
  event: string;
  info: UploadInfo;
}

export interface ExtendedPost extends Post {
  user: { name: string };
  _count: { comments: number };
  currentUserLiked: boolean;
  initialLikesCount: number;
}

export interface ExtendedComment extends Comment {
  user: { name: string };
  _count: { replies: number };
  currentUserLiked: boolean;
  initialLikesCount: number;
}

export interface ExtendedReply extends Reply {
  user: { name: string };
  currentUserLiked: boolean;
  initialLikesCount: number;
}

export interface LikeWithCount extends Like {
  likeCount: number;
}

export type TabValue = "about" | "friends" | "posts";

export type LikesData = {
  type: 'posts' | 'comments' | 'replies',
  itemId: string,
  currentUserLiked: boolean, 
  likeCount: number,
}

// Correct syntax to include prisma relations in types must use Prisma.typenameGetPayload<{relation fields to include here}>
export type PostWithLikes = 
Prisma.PostGetPayload<{
  include: { likes: true }
}>;

export type CommentWithLikes = 
Prisma.CommentGetPayload<{
  include: { likes: true }
}>;

export type ReplyWithLikes = 
Prisma.ReplyGetPayload<{
  include: { likes: true }
}>

export type ReplyWithUser = 
Prisma.ReplyGetPayload<{
  include: { user: true }
}>

export type FriendshipPayload = 
Prisma.FriendshipGetPayload<{
  include: {
    user: true,
    friend: true
  }
}>;

export type PendingRequestPayload = 
Prisma.FriendshipGetPayload<{
  include: { user: true }
}>;