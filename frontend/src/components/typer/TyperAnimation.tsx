import React from 'react'
import { TypeAnimation } from 'react-type-animation';
const TyperAnimation = () => {
  return (
    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed out once, initially
        'This is a safe space to talk',
        2000, // wait 1s before replacing "Mice" with "Hamsters"
        'Only listening, no judgment',
        2000,
        'Prioritize your mental health',
        1500,
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: '60px', color:"white",display: 'inline-block', textShadow:"1px 1px 20px #000" }}
      repeat={Infinity}
    />
  );

};

export default TyperAnimation;