'use client'

import Image from 'next/image'
import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: 35.299878,
  lng: -120.662337
};

export default function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_KEY,
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const markers = [
    { 
      id: 1,
      name: "Cal Poly",
      position: { 
        lat: 35.299878,
        lng: -120.662337,
        //place_id: 'ChIJGcFSXYLx7IAReGNxHAG19tU' 
      }
    }
  ]

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { 
          markers.map(({ id, name, position }) => (
            <MarkerF
              key={id}
              position={position}
              //onClick={() => handleActiveMarker(id)}
              // icon={{
              //   url: "",
              //   scaledSize: { width: 50, height: 50 }
              // }}
            >
            </MarkerF>
          ))
        }
        <></>
      </GoogleMap>
  ) : <>Loading...</>
}
