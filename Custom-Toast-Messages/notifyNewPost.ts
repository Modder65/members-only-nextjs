import { toast } from "react-hot-toast";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const notifyNewPost = () =>
    toast('New post available!', {
      icon: '🆕',
      duration: 2000,
      onClick: scrollToTop
    });