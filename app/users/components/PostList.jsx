import PostItem from "./PostItem";
import PostModal from "./PostModal";

const PostList = ({ posts }) => {

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
      <PostModal />
    </>
  );
}

export default PostList;