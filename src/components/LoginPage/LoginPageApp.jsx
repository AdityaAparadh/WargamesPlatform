// import Scene from './components/Scene'
import DockerWhale from "./components/DockerWhale";
import Login from "./components/Login";
import "./styles.css";
import "./pmndrs.css";

export default function LoginPageApp() {
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  const bgImagePath =
    process.env.NODE_ENV === "production" ? "bg.png" : "/public/bg.png";
  return (
    <>
      <div className="main">
        {/* <Scene /> */}
        <img src={bgImagePath} className="w-screen h-screen "></img>
        {/* <DockerWhale /> */}
        <div className="code">
          <div className="code-container">
            <Login />
          </div>
        </div>
      </div>
    </>
  );
}
