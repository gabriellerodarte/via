# via. 🍸

**via.** is a full-stack travel and trip planning app built with Flask and React. It allows users to create custom trips and build out detailed itineraries by associating places and planned events. Each trip includes a start/end date, a name, and a collection of associated places with events like meals, activities, or travel legs.

The app uses a Flask backend (with SQLAlchemy, Flask-Marshmallow, and Flask-Login) and a React frontend that leverages useContext for global state and useNavigate for routing. The frontend includes modern CSS styling and component-based logic for intuitive trip creation, event editing, and itinerary management.

---

## Backend: Flask Routes & Controllers

Routes are defined using `Flask-Restful` and handled in `app.py`. Authenticated users can create, edit, and delete trips and events. Flask-Login manages sessions, while Flask-Marshmallow handles serialization with custom nesting logic.

---

### 🔐 Auth Routes

#### `POST /signup` — Signup
Registers a new user, saves a hashed password, starts a session by saving the `user_id`, and returns the user (excluding the password).

#### `POST /login` — Login
Authenticates an existing user. Returns the user object with all trips, each with places and their associated events.

#### `GET /check_session` — Check Session
Returns the currently logged-in user's data along with all trips and related places/events, preserving login state across refreshes.

#### `DELETE /logout` — Logout
Clears the session and logs the user out.

---

### Trip Routes

#### `POST /trips`
Creates a new trip with the logged-in user's `user_id` (requires `name`, `start_date`, `end_date`). Requires an authenticated session.

---

### Place Routes

#### `GET /places`
Returns all places in the database. Used for browsing or to select a place when adding an event to a trip.

#### `POST /places`
Creates a new place (name + address). Places are shared across users but only associated with a user's trip if they have events at that location.

 **Note:** The Place model is shared among all users — the app differentiates a user’s personal place list within their trips by `user_id` on the trip.

---

### Event Routes

#### `POST /events`
Creates an event with required fields: `title`, `planning_status`, `location`, `trip_id`, and `place_id`. 
Optional: `start_time`, `end_time`.

#### `PATCH /events/<id>`
Allows the user to edit an event. Only the owner of the event can update it. Validates that the event belongs to the logged-in user.

#### `DELETE /events/<id>`
Deletes an event. If the associated place is no longer tied to any events on the trip, the trip-place association is removed.

---

## Models Overview

All models are defined using SQLAlchemy ORM and include serialization rules for clean API responses. Each model validates its fields and uses relationships to connect data meaningfully.

---

### 👤 User

- `id`: Primary key  
- `username`: Required, unique  
- `_password_hash`: Write-only hashed password field  
- `trips`: One-to-many relationship  
- `events`: Association proxy through trips → events

Includes methods for password hashing and validation via `bcrypt`.

---

### 🌍 Trip

- `id`: Primary key  
- `name`: Required  
- `start_date`, `end_date`: Required  
- `user_id`: Foreign key  
- `places`: Many-to-many via association through events  
- `events`: One-to-many (filtered by `trip_id`)

---

### 📍 Place

- `id`: Primary key  
- `name`: Required  
- `address`: Required, unique 
- `events`: One-to-many  
- `trips`: Many-to-many via events

---

### 📅 Event

- `id`: Primary key  
- `title`: Required  
- `location`: Required  
- `planning_status`: `'confirmed'` or `'tentative'`  
- `start_time`, `end_time`: Optional datetimes  
- `trip_id`, `place_id`: Foreign keys  
- Relationships:
  - Belongs to `trip`  
  - Belongs to `place`  
  - Inherits `user` through trip relationship


---


#### Serialization
- Avoids nesting cocktail and user data for leaner API responses.

---

## Frontend Files

### `App.js`
Sets up routing and conditionally renders the navbar and footer if a user is logged in.

### `UserContext.js`
- Manages `user`, `userTrips`, loading state, and global auth
- Provides fetch logic for CRUD operations and updates

---

### `Home.js`
- Public landing page with login/signup CTA
- Personalized welcome screen if user is logged in

### `Login.js` / `Signup.js`
- Formik forms with Yup validation
- Auth routes hit `/login` and `/signup`, update global user context on success

---

### `Dashboard.js`  
- Displays all user trips  
- Allows creating a new trip  
- Each trip card links to detailed view

### `TripDetails.js`
- Shows trip name, countdown, and date range  
- Lists places visited with all scheduled events  
- Buttons for adding/editing events

---

### `NewEventForm.js` / `EditEventForm.js`
- Used to create or edit events
- Fields: title, planning status, location, optional start/end times
- Includes logic to select or create a new place

---

### `EventCard.js`
- Displays event info (title, status badge, location, optional time)
- Includes Edit/Delete buttons
- Delete confirmation modal appears before deletion

---

### `ErrorPage.js`
- Handles 404s and route errors with user-friendly messages
- Registered via `errorElement` in route config

---

## Styling

**via.** uses vanilla CSS for clean, modern styling with minimal visual clutter. Components use consistent padding, fonts, and hover effects. Modals, badges, and forms follow a light and approachable palette for clarity and usability.

---

## Future Enhancements

- Invite collaborators or share trips
- Export itineraries to PDF or shareable links
- Event categories (e.g., Food, Travel, Activity)
- Add images to events/places
- Auto-suggest places via external API