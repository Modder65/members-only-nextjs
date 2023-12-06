import { toast } from "react-hot-toast";

export const notifyNewPost = () =>
    toast('New post available!', {
      icon: '🆕',
      duration: 2000
    });