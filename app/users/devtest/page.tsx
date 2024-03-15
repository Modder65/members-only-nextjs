"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const DevTest = () => {

  const [initialValues, setInitialValues] = useState({ y: "-100vh", opacity: 0 });
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ y: "0vh", opacity: 1, transition: { duration: 0.5 } });
  }, [controls]);


  return ( 
    <motion.div
      className="flex justify-center mt-8 max-w-3xl w-full mx-auto px-5"
      initial={initialValues}
      animate={controls}
    >
      <div className="bg-sky-800 w-full flex justify-center items-center">
        <button
          className="text-white bg-sky-500 p-4 rounded-lg w-[500px]"
        >
          Hello There
        </button>
      </div>
    </motion.div>
   );
}
 
export default DevTest;