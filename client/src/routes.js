import App from "./components/App";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Places from "./components/Places";
import MyTrips from "./components/MyTrips";
import NewTripForm from "./components/NewTripForm";
import About from "./components/About";
import TripDetails from "./components/TripDetails";
import NewEventForm from "./components/NewEventForm";
import EditEventForm from "./components/EditEventForm";

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
            },
            {
                path: "/my-trips/:id",
                element: (
                    <PrivateRoute>
                        <TripDetails/>
                    </PrivateRoute>
                )
            },
            {
                path: "/new-trip",
                element: (
                    <PrivateRoute>
                        <NewTripForm/>
                    </PrivateRoute>
                )
            },
            {
                path: "/about",
                element: (
                    <PrivateRoute>
                        <About/>
                    </PrivateRoute>
                )
            },
            {
                path: "/my-trips/:id/new-event",
                element: (
                    <PrivateRoute>
                        <NewEventForm/>
                    </PrivateRoute>
                )
            },
            {
                path: "/my-trips/:tripId/places/:id/new-event",
                element: (
                    <PrivateRoute>
                        <NewEventForm/>
                    </PrivateRoute>
                )
            },
            {
                path: `/my-trips/:tripId/places/:placeId/events/:id/edit`,
                element: (
                    <PrivateRoute>
                        <EditEventForm/>
                    </PrivateRoute>
                )
            }
        ]
    }
]

export default routes