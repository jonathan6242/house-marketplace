import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth, db } from "../firebase.config"
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem"

function Profile() {
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const {name, email} = formData;

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), 
      orderBy("timestamp", "desc"))
      const querySnap = await getDocs(q)
      const listings = querySnap.docs.map((doc) => ({id: doc.id, data: doc.data()}))
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings();
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name) {
        // Update display name in Firebase Authentication
        updateProfile(auth.currentUser, {
          displayName: name
        })

        // Update display name in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast.error('Could not update profile details.');
    }
  }

  const onChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const onDelete = async (listingId) => {
    if(window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter(listing => listing.id !== listingId)
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">
            Personal Details
          </p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails(!changeDetails);
          }}>
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input 
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input 
              type="email"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to='/create-listing' className="createListing">
          <img src={homeIcon} alt="Home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="Arrow right" />
        </Link>
        {
          !loading && listings?.length > 0 && (
            <>
              <p className="listingText">Your Listings</p>
              <ul className="listingsList">
                {
                  listings.map((listing) => (
                    <ListingItem 
                      key={listing.id}
                      listing={listing.data}
                      id={listing.id}
                      onDelete={() => {onDelete(listing.id)}}
                      onEdit={() => {onEdit(listing.id)}}
                    />
                  ))
                }
              </ul>
            </>
          )
        }
      </main> 
    </div>
  )
}
export default Profile