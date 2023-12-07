import PostItem from "./PostItem";

const PostList = ({ posts, comments, setComments }) => {
  return (
    <>
      {posts.map(post => (
        <PostItem key={post.id} post={post} postId={post.id} initialCommentsCount={post._count.comments} comments={comments} setComments={setComments}/>
      ))}
    </>
  );
}

export default PostList;