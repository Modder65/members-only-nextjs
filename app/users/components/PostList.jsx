import PostItem from "./PostItem";

const PostList = ({ posts, setPosts }) => {
  return (
    <>
      {posts.map(post => (
        <PostItem 
          key={post.id} 
          posts={posts}
          setPosts={setPosts}
          post={post} 
          postId={post.id} 
          initialCommentsCount={post._count.comments}
        />
      ))}
    </>
  );
}

export default PostList;
