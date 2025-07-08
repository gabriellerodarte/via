import App from "./components/App";
import Home from "./components/Home";

const routes = [
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Home/>
            }
        ]
    }
]

export default routes