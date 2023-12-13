import PostItem from "./PostItem";

const PostList = ({ posts }) => {
  return (
    <>
      {posts.map(post => (
        <PostItem 
        key={post.id} 
        post={post} 
        postId={post.id} 
        initialCommentsCount={post._count.comments} 
        initialLikesCount={post._count.likes}
        currentUserLiked={post.currentUserLiked}
        />
      ))}
    </>
  );
}

export default PostList;