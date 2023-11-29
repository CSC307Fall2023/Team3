// listing sidebar to be displayed 
import React, { useState, useEffect } from 'react';

const ListingsSidebar = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings'); // fetch data using listings api
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      <h2>Listings</h2>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id}>
            <strong>{listing.name}</strong>
            <p>{listing.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListingsSidebar;