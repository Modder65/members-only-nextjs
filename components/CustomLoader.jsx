import { useEffect, useRef } from "react";
import gsap from "gsap";

export const CustomLoader = () => {
  const spinnerRef = useRef(null);

  useEffect(() => {
    gsap.to(spinnerRef.current, {
      rotation: 360,
      repeat: -1,
      duration: 1,
      ease: "linear"
    });
  }, []);

  return (
    <div ref={spinnerRef} className="w-12 h-12 flex justify-center items-center">
      <div className="w-full h-full border-4 border-transparent border-t-green-600 border-r-green-600 rounded-full"></div>
    </div>
  );
}