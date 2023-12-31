import FriendsModal from "./FriendModal";
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
        initialLikesCount={post._count.likes}
        currentUserLiked={post.currentUserLiked}
        />
      ))}
      <PostModal />
    </>
  );
}

export default PostList;