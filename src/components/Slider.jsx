import { collection, getDocs, query, orderBy, limit, doc } from "firebase/firestore"
import { db } from "../firebase.config"
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y} from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Spinner from "./Spinner"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)
      const listings = querySnap.docs.map((doc) => ({id: doc.id, data: doc.data()}))
      setListings(listings)
      setLoading(false)
    }
    fetchListings();
  }, [])

  if(loading) {
    return <Spinner />
  }
  
  if(listings.length === 0) {
    return <></>
  }

  return listings && (
    <>
      <p className="exploreHeading">Recommended</p>
      <Swiper slidesPerView={1} pagination={{clickable: true}}>
        {listings.map(({ data, id }) => (
          <SwiperSlide key={id} onClick={() => {navigate(`/category/${data.type}/${id}`)}}>
            <div className="swiper-container">
              <div 
                className="swiperSlideDiv"
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover'
                }}
              >
                <p className="swiperSlideText">{data.name}</p>
                <p className="swiperSlidePrice">
                  ${data.discountedPrice ?? data.regularPrice}
                  {data.type === 'rent' && ' per month'}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
export default Slider