import { useRef, useEffect } from "react";
import gsap from "gsap";

const CustomLoader = ({ loading }) => {
  const spinnerRef = useRef(null);
  const dots = [];
  const numberOfDots = 4;

  useEffect(() => {
    if (loading) {
      // Clear existing dots
      spinnerRef.current.innerHTML = '';

      for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        spinnerRef.current.appendChild(dot);
        dots.push(dot);

        // Animate dots in a circle with a staggered start
        gsap.to(dot, {
          duration: 2,
          repeat: -1,
          ease: "power1.inOut",
          rotation: 360,
          transformOrigin: "50px 50px", // Adjust the radius of the circle here
          delay: i * 0.5 // Staggered start for each dot
        });
      }
    } else {
      gsap.to(dots, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          dots.forEach(dot => {
            if (spinnerRef.current) {
              spinnerRef.current.removeChild(dot);
            }
          });
        }
      });
    }

    return () => {
      if (spinnerRef.current) {
        spinnerRef.current.innerHTML = '';
      }
    };
  }, [loading]);

  return (
    <div className="custom-loader" ref={spinnerRef}></div>
  );
};

export default CustomLoader;