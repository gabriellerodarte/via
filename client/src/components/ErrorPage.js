import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import "../styles/error-page.css";

function ErrorPage() {
  const error = useRouteError()

  const status = isRouteErrorResponse(error) ? error.status : 500

  const messageMap = {
    404: {
      title: "Page Not Found",
      description: "We couldn’t find the page you were looking for.",
    },
    401: {
      title: "Unauthorized",
      description: "You don’t have permission to view this page.",
    },
    500: {
      title: "Something Went Wrong",
      description: "Oops! Something broke on our end.",
    },
  };

  const { title, description } = messageMap[status] || {
    title: "Unexpected Error",
    description: "Something went wrong, but we're not sure what.",
  };

  return (
    <div className="error-container">
      <div className="error-box">
        <h1 className="error-emoji">🚧</h1>
        <h2 className="error-title">{title}</h2>
        <p className="error-description">{description}</p>
        <Link to="/my-trips" className="error-link">
          ← Back to My Trips
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage

