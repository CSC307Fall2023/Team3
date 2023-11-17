// TODO: make homepage from wireframe

import Image from 'next/image'
import Map from './map'
import Link from 'next/link';


export default function Home() {
  return (
    <Link href="/review">
    
        <h1>Welcome to CSC 307</h1>
        <div>
          <Map></Map>
          Leave a Review!
        </div>
      
    </Link>
  )
}
