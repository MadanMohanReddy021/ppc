import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";

function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    loadEvents();
    checkSession();
  }, []);


  /*
   * Check logged-in user
   */
  const checkSession = async () => {
    try {
      const response = await fetch(
        "https://parvatiputra.ct.ws/check_session.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.logged_in) {
        setLoggedIn(true);
        setRole(data.role);
      } else {
        setLoggedIn(false);
        setRole(null);
      }

    } catch (error) {
      console.error(
        "Session check failed:",
        error
      );
    }
  };


  /*
   * Get events
   */
  const loadEvents = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://parvatiputra.ct.ws/get_events.php",
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (data.success) {
        setEvents(data.events || []);
      } else {
        setMessage(
          data.message ||
          "Unable to load events."
        );
      }

    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  /*
   * Format date
   */
  const formatDate = (dateString) => {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  /*
   * Format time
   */
  const formatTime = (timeString) => {
    if (!timeString) {
      return "";
    }

    const [hours, minutes] =
      timeString.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };


  const canManage =
    loggedIn &&
    (role === "admin" || role === "root");


  return (
    <div className="events-page">

      {/* Header */}

      <header className="events-header">

        <button
          className="events-back-btn"
          onClick={() => navigate("/")}
        >
          ← Home
        </button>


        <div className="events-header-title">

          <div className="events-logo">
            P
          </div>

          <div>
            <h1>Parvatiputra</h1>
            <p>Events</p>
          </div>

        </div>


        {canManage && (
          <button
            className="manage-events-btn"
            onClick={() =>
              navigate("/manage-events")
            }
          >
            ⚙ Manage Events
          </button>
        )}

      </header>


      {/* Main */}

      <main className="events-main">

        <div className="events-intro">

          <div className="events-symbol">
            ॐ
          </div>

          <div>

            <p className="events-label">
              PARVATIPUTRA
            </p>

            <h2>
              Upcoming Events
            </h2>

            <p className="events-subtitle">
              View upcoming committee events,
              dates and timings.
            </p>

          </div>

        </div>


        {/* Loading */}

        {loading && (

          <div className="events-status">
            <div className="events-spinner"></div>
            <p>Loading events...</p>
          </div>

        )}


        {/* Error */}

        {!loading && message && (

          <div className="events-status events-error">
            <div className="events-status-icon">
              !
            </div>

            <p>{message}</p>

            <button
              onClick={loadEvents}
            >
              Try Again
            </button>
          </div>

        )}


        {/* Empty */}

        {!loading &&
          !message &&
          events.length === 0 && (

            <div className="events-status">

              <div className="events-empty-icon">
                📅
              </div>

              <h3>
                No Events Yet
              </h3>

              <p>
                There are no events scheduled
                at the moment.
              </p>

              {canManage && (
                <button
                  onClick={() =>
                    navigate("/manage-events")
                  }
                >
                  + Add Event
                </button>
              )}

            </div>

          )}


        {/* Event list */}

        {!loading &&
          !message &&
          events.length > 0 && (

            <div className="events-list">

              {events.map((event) => (

                <div
                  className="event-card"
                  key={event.event_id}
                >

                  <div className="event-date-box">

                    <span className="event-day">
                      {new Date(
                        `${event.event_date}T00:00:00`
                      ).getDate()}
                    </span>

                    <span className="event-month">
                      {new Date(
                        `${event.event_date}T00:00:00`
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          month: "short",
                        }
                      )}
                    </span>

                  </div>


                  <div className="event-details">

                    <h3>
                      {event.event_name}
                    </h3>

                    <div className="event-meta">

                      <span>
                        📅{" "}
                        {formatDate(
                          event.event_date
                        )}
                      </span>

                      <span>
                        🕐{" "}
                        {formatTime(
                          event.event_time
                        )}
                      </span>

                    </div>


                    {event.description && (
                      <p className="event-description">
                        {event.description}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>


      <footer className="events-footer">
        © Parvatiputra Committee
      </footer>

    </div>
  );
}

export default Events;