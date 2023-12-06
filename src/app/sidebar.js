import React, { useState, useEffect } from 'react';

const Sidebar = ({ listings }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [listingData, setListingData] = useState([]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // Fetch addresses and avgScores based on latitude and longitude
    const fetchListingData = async () => {
      try {
        const data = await Promise.all(
          listings.map(async (listing) => {
            try {
              // Create a geocoder object
              const geocoder = new window.google.maps.Geocoder();

              // Turn coordinates into an object
              const location = new window.google.maps.LatLng(listing.latitude, listing.longitude);

              // Geocode the coordinates to get the address
              const address = await new Promise((resolve, reject) => {
                geocoder.geocode({ 'latLng': location }, (results, status) => {
                  if (status === window.google.maps.GeocoderStatus.OK) {
                    resolve(results[0].formatted_address);
                  } else {
                    reject('Address not found');
                  }
                });
              });

              return { address, avgScore: listing.avgScore };
            } catch (error) {
              console.error("Error fetching address:", error);
              return { address: "Address not found", avgScore: listing.avgScore };
            }
          })
        );

        // Update the state with the fetched addresses and avgScores
        setListingData(data);
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    };

    fetchListingData();
  }, [listings]); // Dependency array to run the effect when listings change

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleSidebar}>{collapsed ? 'Open' : 'Hide Listings'}</button>
      {!collapsed && listings && (
        <div>
          {listingData.map((data, index) => (
            <div key={index} className="box">
              <p>Address: {data.address}</p>
              <p>Average Score: {data.avgScore}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
