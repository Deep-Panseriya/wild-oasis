import Heading from '../ui/Heading'
import Row from '../ui/Row'
import CabinTable from '../features/cabins/CabinTable'
import AddCabin from '../features/cabins/AddCabin'
import CabinTableOpreations from '../features/cabins/CabinTableOpreations'

function Cabins () {
  // useEffect(()=> {
  //     getCabins().then((data)=>console.log(data))
  // },[])
  return (
    <>
      <Row type='horizontal'>
        <Heading as='h1'>All cabins</Heading>
      <CabinTableOpreations/>
      </Row>
      <Row>
        <CabinTable />
      </Row>
        <AddCabin/>
    </>
  )
}

export default Cabins
