import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter, doc } 
from "firebase/firestore"
import { db } from "../firebase.config"
import Spinner from "../components/Spinner"
import { toast } from "react-toastify"
import ListingItem from "../components/ListingItem"

function Offers() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, "listings")

        // Create a query
        const q = query(
          listingsRef, 
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        )

        // Execute query
        const querySnap = await getDocs(q)
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)
          
        const listings = querySnap.docs.map(doc => ({id: doc.id, data: doc.data()}));
        
        setListings(listings)
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error('Could not fetch listings.')
      }
    }
    fetchListings()
  }, [])

  
  // Fetch more listings (pagination)
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(db, "listings")

      // Create a query
      const q = query(
        listingsRef, 
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(2)
      )

      // Execute query
      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
        
      const listings = querySnap.docs.map(doc => ({id: doc.id, data: doc.data()}));
      
      setListings((prevState) => ([...prevState, ...listings]))
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error('Could not fetch listings.')
    }
  }

  return (
    <div className="category">
      <header>
        <div className="pageHeader">
          Offers
        </div>
      </header>
      {
        loading ? <Spinner /> : listings && listings.length > 0 ?
        <>
          <main>
            <ul className="categoryListings">
              {listings.map(listing => (
                <ListingItem key={listing.id} id={listing.id} listing={listing?.data} />
              ))}
            </ul>
          </main>

          <br />
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
          )}
        </> 
        : <p>There are no current offers</p>
      }
    </div>
  )
}
export default Offers