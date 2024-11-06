import { getUSerName } from "../../../backend/hooks/GetUserName";


const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome back, {getUSerName()}!</p>
    </div>
  )

}

export default Home;