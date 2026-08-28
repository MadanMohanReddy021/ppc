import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageEvents.css";

function ManageEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [role, setRole] = useState(null);
  const [authorized, setAuthorized] = useState(false);


  /*
   * Initial load
   */
  useEffect(() => {
    checkSession();
    loadEvents();
  }, []);


  /*
   * Check user session
   */
  const checkSession = async () => {

    try {

      const response = await fetch(
        "http://localhost/ppc/check_session.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data =
        await response.json();


      if (
        data.logged_in &&
        (
          data.role === "admin" ||
          data.role === "root"
        )
      ) {

        setRole(data.role);
        setAuthorized(true);

      } else {

        setAuthorized(false);

      }

    } catch (error) {

      console.error(error);

      setAuthorized(false);
    }
  };


  /*
   * Load events
   */
  const loadEvents = async () => {

    setLoadingEvents(true);

    try {

      const response = await fetch(
        "http://localhost/ppc/get_events.php"
      );

      const data =
        await response.json();


      if (data.success) {

        setEvents(
          data.events || []
        );

      } else {

        showMessage(
          data.message ||
          "Failed to load events.",
          "error"
        );
      }

    } catch (error) {

      console.error(error);

      showMessage(
        "Unable to connect to the server.",
        "error"
      );

    } finally {

      setLoadingEvents(false);
    }
  };


  /*
   * Show message
   */
  const showMessage = (
    text,
    type
  ) => {

    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };


  /*
   * Reset form
   */
  const resetForm = () => {

    setEventName("");
    setEventDate("");
    setEventTime("");
    setDescription("");

    setEditingId(null);
  };


  /*
   * Add / Update
   */
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!authorized) {
      return;
    }


    setLoading(true);


    const isEditing =
      editingId !== null;


    const url = isEditing
      ? "http://localhost/ppc/update_event.php"
      : "http://localhost/ppc/add_event.php";


    try {

      const response =
        await fetch(url, {

          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            ...(isEditing && {
              event_id: editingId,
            }),

            event_name:
              eventName,

            event_date:
              eventDate,

            event_time:
              eventTime,

            description:
              description,

          }),

        });


      const data =
        await response.json();


      if (data.success) {

        showMessage(
          isEditing
            ? "Event updated successfully."
            : "Event added successfully.",
          "success"
        );


        resetForm();

        loadEvents();

      } else {

        showMessage(
          data.message ||
          "Operation failed.",
          "error"
        );
      }

    } catch (error) {

      console.error(error);

      showMessage(
        "Unable to connect to the server.",
        "error"
      );

    } finally {

      setLoading(false);
    }
  };


  /*
   * Edit event
   */
  const handleEdit = (event) => {

    setEditingId(
      event.event_id
    );

    setEventName(
      event.event_name
    );

    setEventDate(
      event.event_date
    );

    setEventTime(
      event.event_time
    );

    setDescription(
      event.description || ""
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /*
   * Delete event
   */
  const handleDelete = async (
    eventId
  ) => {

    if (!authorized) {
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to delete this event?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          "http://localhost/ppc/delete_event.php",
          {

            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              event_id: eventId,
            }),

          }
        );


      const data =
        await response.json();


      if (data.success) {

        showMessage(
          "Event deleted successfully.",
          "success"
        );

        loadEvents();

      } else {

        showMessage(
          data.message ||
          "Failed to delete event.",
          "error"
        );
      }

    } catch (error) {

      console.error(error);

      showMessage(
        "Unable to connect to the server.",
        "error"
      );
    }
  };


  /*
   * Unauthorized
   */
  if (!authorized && role !== null) {

    return (

      <div className="manage-events-page">

        <div className="unauthorized-box">

          <div className="unauthorized-icon">
            !
          </div>

          <h1>
            Access Denied
          </h1>

          <p>
            Only administrators can manage events.
          </p>

          <button
            onClick={() =>
              navigate("/events")
            }
          >
            Back to Events
          </button>

        </div>

      </div>
    );
  }


  return (

    <div className="manage-events-page">

      {/* Header */}

      <header className="manage-events-header">

        <button
          className="manage-back-btn"
          onClick={() =>
            navigate("/events")
          }
        >
          ← Events
        </button>


        <div className="manage-title">

          <div className="manage-logo">
            P
          </div>

          <div>

            <h1>
              Manage Events
            </h1>

            <p>
              Add, edit and delete committee events
            </p>

          </div>

        </div>


        <div className="role-badge">
          {role || "Checking..."}
        </div>

      </header>


      <main className="manage-events-content">


        {/* Message */}

        {message && (

          <div
            className={`manage-message ${messageType}`}
          >
            {message}
          </div>

        )}


        {/* Add/Edit Form */}

        <section className="event-form-card">

          <div className="form-heading">

            <div className="form-heading-icon">
              {editingId ? "✎" : "+"}
            </div>

            <div>

              <h2>
                {editingId
                  ? "Edit Event"
                  : "Add New Event"}
              </h2>

              <p>
                {editingId
                  ? "Update the event details"
                  : "Create a new committee event"}
              </p>

            </div>

          </div>


          <form
            onSubmit={handleSubmit}
            className="event-form"
          >

            <div className="form-row">

              <div className="manage-input-group">

                <label>
                  Event Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Ganesh Chaturthi"
                  value={eventName}
                  onChange={(e) =>
                    setEventName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>


            <div className="form-row two-columns">

              <div className="manage-input-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) =>
                    setEventDate(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="manage-input-group">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) =>
                    setEventTime(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>


            <div className="manage-input-group">

              <label>
                Description
                <span>
                  Optional
                </span>
              </label>

              <textarea
                rows="4"
                placeholder="Enter event details..."
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="form-actions">

              <button
                type="submit"
                className="save-event-btn"
                disabled={loading}
              >

                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Event"
                    : "Add Event"}

              </button>


              {editingId && (

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>


        {/* Existing Events */}

        <section className="existing-events">

          <div className="existing-heading">

            <div>

              <h2>
                Existing Events
              </h2>

              <p>
                {events.length} event
                {events.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>


            <button
              className="refresh-events-btn"
              onClick={loadEvents}
            >
              ↻ Refresh
            </button>

          </div>


          {loadingEvents ? (

            <div className="manage-loading">
              Loading events...
            </div>

          ) : events.length === 0 ? (

            <div className="no-events">
              No events available.
            </div>

          ) : (

            <div className="manage-event-list">

              {events.map((event) => (

                <div
                  className="manage-event-card"
                  key={event.event_id}
                >

                  <div className="manage-event-date">

                    <strong>
                      {new Date(
                        `${event.event_date}T00:00:00`
                      ).getDate()}
                    </strong>

                    <span>
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


                  <div className="manage-event-info">

                    <h3>
                      {event.event_name}
                    </h3>

                    <p>
                      📅 {event.event_date}
                      {"  "}
                      🕐 {event.event_time}
                    </p>

                    {event.description && (

                      <small>
                        {event.description}
                      </small>

                    )}

                  </div>


                  <div className="event-actions">

                    <button
                      className="edit-event-btn"
                      onClick={() =>
                        handleEdit(event)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-event-btn"
                      onClick={() =>
                        handleDelete(
                          event.event_id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default ManageEvents;