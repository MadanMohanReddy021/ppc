import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Games.css";

function Games() {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);


  useEffect(() => {
    loadGames();
    checkSession();
  }, []);


  /*
   * Check login/session
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
   * Load games and winners
   */
  const loadGames = async () => {

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        "http://localhost/ppc/get_games.php"
      );

      const data =
        await response.json();


      if (data.success) {

        setGames(
          data.games || []
        );

      } else {

        setMessage(
          data.message ||
          "Unable to load games."
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

    if (!dateString) {
      return "";
    }

    const date =
      new Date(
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
    (
      role === "admin" ||
      role === "root"
    );


  return (

    <div className="games-page">

      {/* Header */}

      <header className="games-header">

        <button
          className="games-back-btn"
          onClick={() =>
            navigate("/")
          }
        >
          ← Home
        </button>


        <div className="games-header-title">

          <div className="games-logo">
            P
          </div>

          <div>

            <h1>
              Parvatiputra
            </h1>

            <p>
              Games
            </p>

          </div>

        </div>


        {canManage && (

          <button
            className="manage-games-btn"
            onClick={() =>
              navigate("/manage-games")
            }
          >
            ⚙ Manage Games
          </button>

        )}

      </header>


      {/* Main */}

      <main className="games-main">

        <div className="games-intro">

          <div className="games-symbol">
            🏆
          </div>

          <div>

            <p className="games-label">
              PARVATIPUTRA
            </p>

            <h2>
              Games & Winners
            </h2>

            <p className="games-subtitle">
              View committee games,
              schedules and winners.
            </p>

          </div>

        </div>


        {/* Loading */}

        {loading && (

          <div className="games-status">

            <div className="games-spinner"></div>

            <p>
              Loading games...
            </p>

          </div>

        )}


        {/* Error */}

        {!loading &&
          message && (

            <div className="games-status games-error">

              <div className="games-status-icon">
                !
              </div>

              <p>
                {message}
              </p>

              <button
                onClick={loadGames}
              >
                Try Again
              </button>

            </div>

          )}


        {/* Empty */}

        {!loading &&
          !message &&
          games.length === 0 && (

            <div className="games-status">

              <div className="games-empty-icon">
                🏆
              </div>

              <h3>
                No Games Yet
              </h3>

              <p>
                No games have been added yet.
              </p>

              {canManage && (

                <button
                  onClick={() =>
                    navigate(
                      "/manage-games"
                    )
                  }
                >
                  + Add Game
                </button>

              )}

            </div>

          )}


        {/* Games */}

        {!loading &&
          !message &&
          games.length > 0 && (

            <div className="games-list">

              {games.map((game) => (

                <div
                  className="game-card"
                  key={game.game_id}
                >

                  {/* Game header */}

                  <div className="game-card-header">

                    <div className="game-icon">
                      🏆
                    </div>

                    <div className="game-info">

                      <h3>
                        {game.game_name}
                      </h3>

                      <div className="game-meta">

                        <span>
                          📅{" "}
                          {formatDate(
                            game.game_date
                          )}
                        </span>

                        <span>
                          🕐{" "}
                          {formatTime(
                            game.game_time
                          )}
                        </span>

                      </div>

                    </div>

                  </div>


                  {/* Description */}

                  {game.description && (

                    <p className="game-description">
                      {game.description}
                    </p>

                  )}


                  {/* Winners */}

                  <div className="winners-section">

                    <div className="winners-title">
                      <span>
                        🏅
                      </span>

                      Winners
                    </div>


                    {game.winners &&
                    game.winners.length > 0 ? (

                      <div className="winner-list">

                        {game.winners.map(
                          (winner) => (

                            <div
                              className="winner-row"
                              key={
                                winner.winner_id
                              }
                            >

                              <div
                                className={`winner-medal position-${winner.position}`}
                              >
                                {winner.position === "1st"
                                  ? "🥇"
                                  : winner.position === "2nd"
                                    ? "🥈"
                                    : winner.position === "3rd"
                                      ? "🥉"
                                      : "🏅"}
                              </div>


                              <div className="winner-name">

                                <strong>
                                  {
                                    winner.winner_name
                                  }
                                </strong>

                                <span>
                                  {
                                    winner.position
                                  }
                                </span>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <div className="no-winners">
                        Winners will be announced soon.
                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>


      <footer className="games-footer">
        © Parvatiputra Committee
      </footer>

    </div>
  );
}

export default Games;