import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { PAGE_SIZE } from '../../utils/constant';
//NOTE - READ ALL DATA FROM THE DATABASE 
//ANCHOR - useQuery is a hook that is used to fetch data from the database
//ANCHOR - queryKey is the key that is used to fetch the data from the database
//ANCHOR - queryFn is the function that is used to fetch the data from the database

//ANCHOR - Pagination logic for the bookings table client side
// export default function useBookings({offset = 0 , limit = PAGE_SIZE} = {}) {
//       const {isLoading,data: bookings,error} = useQuery({
//         queryKey: ["bookings" , offset, limit],
//         queryFn: () => getBookings({offset , limit}),
//       });
//   return {isLoading,bookings,error}
// }

export default function useBookings() {
  const { isLoading, data: bookings, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });  
  return {isLoading,bookings,error}
}


