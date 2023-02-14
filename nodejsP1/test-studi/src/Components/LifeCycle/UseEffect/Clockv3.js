import React, {useState, useEffect} from 'react';
 
const Clockv3 = () => {
  const [date, setdate] = useState(new Date());

  useEffect(() => {
    console.log(("mise à jour"));
    const interval = setInterval(() => setdate(new Date()));
    return function () {
      console.log("nettoyage");
      clearInterval(interval);
    }
  }, [date]);

  console.log("render")
  return (
    <h1>Il est : {date.toLocaleTimeString()}</h1>
  );
}
 
export default Clockv3;