import React from 'react';
import Snowfall from 'react-snowfall';

const ChristmasSnowfall = () => {
  return (
    <Snowfall
      snowflakeCount={100}
      style={{ zIndex: 9999, pointerEvents: 'none', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
};

export default ChristmasSnowfall;
