import { CalendarDays, MapPin, Plane, User, Heart } from "lucide-react"
import "../styles/about.css"

function About() {
    
    return (
        <div className="about-page">
            <section className="about-hero">
                <h1>Plan better. Wander smarter.</h1>
                <p>
                    <em>via.</em> is a minimalist trip-planning app for organizing parties, day trips, and adventures — big or small.
                    Create personalized itineraries, add memorable spots, and keep your travel dreams organized in one place.
                </p>
            </section>

            <section className="about-features">
                <h2>Features</h2>
                <ul className="feature-list">
                    <li>
                        <CalendarDays size={18} /> <span>Create Custom<br/> Trips</span>
                    </li>
                    <li>
                        <MapPin size={18} /> <span>Add & Explore<br/> Places</span>
                    </li>
                    <li>
                        <Plane size={18} /> <span>Organize by<br/> Timeline</span>
                    </li>
                    <li>
                        <User size={18} /> <span>Your Plans,<br/> <strong>Your Way</strong></span>
                    </li>
                </ul>
            </section>

            <section className="about-how">
                <h2>How It Works</h2>
                <ol>
                    <li>Start a new trip</li>
                    <li>Add your favorite places</li>
                    <li>Plan fun events</li>
                    <li>Track upcoming, current, and past plans</li>
                </ol>
            </section>

            <section className="about-footer">
                <p>
                    Whether you're planning a birthday weekend, a girls' getaway, or your next solo adventure — <em>via.</em> keeps it all in one place.
                </p>
                <p className="signature">
                    <span style={{ whiteSpace: "nowrap"}}>
                        Built with <Heart size={16} style={{ verticalAlign: "middle" }} /> {" "}
                        by Gabrielle — a traveler, planner, and dev who needed a simpler way to organize adventures.
                    </span>
                </p>            
</section>
        </div>
  );
}

export default About