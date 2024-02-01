import { useSelector } from 'react-redux';
import PostItem from "./PostItem";

const PostList = () => {
  const posts = useSelector((state) => state.posts.posts)

  return (
    <>
      {posts.map(post => (
        <PostItem 
          key={post.id} 
          post={post} 
          posts={posts}
          postId={post.id} 
          initialCommentsCount={post._count.comments}
        />
      ))}
    </>
  );
}

export default PostList;
