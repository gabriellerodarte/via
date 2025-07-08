import App from "./components/App";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

const routes = [
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/signup",
                element: <Signup/>
            },
            {
                path: "/login",
                element: <Login/>
            }
        ]
    }
]

export default routes