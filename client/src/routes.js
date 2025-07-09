import App from "./components/App";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Places from "./components/Places";
import MyTrips from "./components/MyTrips";

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
                element: (
                    <PublicRoute>
                        <Signup/>
                    </PublicRoute>
                )
            },
            {
                path: "/login",
                element: (
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                )
            },
            {
                path: "/places",
                element: (
                    <PrivateRoute>
                        <Places/>
                    </PrivateRoute>
                )
            },
            {
                path: "/my-trips",
                element: (
                    <PrivateRoute>
                        <MyTrips/>
                    </PrivateRoute>
                )
            }
        ]
    }
]

export default routes