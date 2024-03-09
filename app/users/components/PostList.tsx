import { ExtendedPost } from "@/types/types";
import PostItem from "./PostItem";
import usePostsStore from "@/zustand/postStore";

const PostList = () => {
  const posts = usePostsStore((state) => state.posts);

  return (
    <>
      {posts.map(post => (
        <PostItem 
          key={post.id} 
          post={post} 
          postId={post.id} 
          initialCommentsCount={post._count.comments}
        />
      ))}
    </>
  );
}

export default PostList;
