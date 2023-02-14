import React, { useEffect } from 'react';

const Clockv2 = () => {
  useEffect(() => {
    console.log("montage")
    document.title = `il est ${new Date().toLocaleTimeString()}`;
  }, []);

  console.log("rendu");
  return (
    <div>
      <h1>Il est : {new Date().toLocaleTimeString()}</h1>
    </div>
  );
};

export default Clockv2;
