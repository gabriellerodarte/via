import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { UserProvider } from "./context/UserContext";
import { PlaceProvider } from "./context/PlaceContext";
import "./index.css";

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <UserProvider>
        <PlaceProvider>
            <RouterProvider router={router}/>
        </PlaceProvider>
    </UserProvider>
);