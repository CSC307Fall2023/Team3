import React, { useState } from 'react';
import styles from './SantaSleigh.module.css';  // Create a separate CSS file for styling

const SantaSleigh = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prevVisible) => !prevVisible);
  };
  return (
    <div className={styles.santaSleigh} style={{ display: isVisible ? 'block' : 'none' }}>
      {/* Add your Santa and sleigh SVG or image here */}
      <img src="https://th.bing.com/th/id/R.6e35db845b6b3fa48fd0c23bfd25f998?rik=BrJsF3K7FcJqlw&riu=http%3a%2f%2fwww.carlswebgraphics.com%2fchristmas%2freindeer-santa-dancing.gif&ehk=Iph1xnJ4VYxfRZx3%2frLT3t5FXdkuGnotjwaC7%2fGxKiI%3d&risl=&pid=ImgRaw&r=0" alt="Santa Riding Sleigh" />
      
    </div>
  );
};

export default SantaSleigh;

