import { toast } from "react-hot-toast";

export const notifyNewPost = () =>
    toast('New post available!', {
      icon: '🆕',
      duration: 2000,
    });

export const notifyNewComment = (postTitle) =>
    toast(`New comment at ${postTitle}!`, {
      icon: '🆕',
      duration: 2000,
    });

    export const notifyNewReply = () =>
    toast('New reply available!', {
      icon: '🆕',
      duration: 2000,
    });

    export const notifyLike = () =>
    toast('Liked!', {
      icon: '💗',
      duration: 2000,
    });



  