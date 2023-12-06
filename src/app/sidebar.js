import React, { useState, useEffect } from 'react';

const Sidebar = ({ listings }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [listingAddresses, setListingAddresses] = useState([]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // Fetch addresses based on latitude and longitude
    const fetchListingAddresses = async () => {
      try {
        const addresses = await Promise.all(
          listings.map(async (listing) => {
            try {
              // Create a geocoder object
              const geocoder = new window.google.maps.Geocoder();
              
              // Turn coordinates into an object
              const location = new window.google.maps.LatLng(listing.latitude, listing.longitude);

              // Geocode the coordinates to get the address
              const geocodeResult = await new Promise((resolve, reject) => {
                geocoder.geocode({ 'latLng': location }, (results, status) => {
                  if (status === window.google.maps.GeocoderStatus.OK) {
                    resolve(results[0].formatted_address);
                  } else {
                    reject('Address not found');
                  }
                });
              });

              return geocodeResult;
            } catch (error) {
              console.error("Error fetching address:", error);
              return "Address not found";
            }
          })
        );

        // Update the state with the fetched addresses
        setListingAddresses(addresses);
      } catch (error) {
        console.error("Error fetching listing addresses:", error);
      }
    };

    fetchListingAddresses();
  }, [listings]); // Dependency array to run the effect when listings change

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleSidebar}>{collapsed ? 'Open' : 'Hide Listings'}</button>
      {!collapsed && listings && (
        <div>
          {listings.map((listing, index) => (
            <div key={index} className="box">
              {listingAddresses[index]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
