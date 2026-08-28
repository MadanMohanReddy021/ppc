import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageGames.css";

function ManageGames() {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);

  const [gameName, setGameName] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [winnerGameId, setWinnerGameId] = useState(null);
  const [winnerName, setWinnerName] = useState("");
  const [winnerPosition, setWinnerPosition] =
    useState("1st");

  const [loading, setLoading] = useState(false);
  const [loadingGames, setLoadingGames] =
    useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("");

  const [role, setRole] = useState(null);
  const [authorized, setAuthorized] =
    useState(null);


  /*
   * Initial load
   */
  useEffect(() => {
    checkSession();
    loadGames();
  }, []);


  /*
   * Check session
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
   * Load games
   */
  const loadGames = async () => {

    setLoadingGames(true);

    try {

      const response = await fetch(
        "https://parvatiputra.ct.ws/get_games.php"
      );

      const data =
        await response.json();


      if (data.success) {

        setGames(
          data.games || []
        );

      } else {

        showMessage(
          data.message ||
            "Failed to load games.",
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

      setLoadingGames(false);
    }
  };


  /*
   * Message
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
   * Reset game form
   */
  const resetGameForm = () => {

    setGameName("");
    setGameDate("");
    setGameTime("");
    setDescription("");

    setEditingId(null);
  };


  /*
   * Add / Update game
   */
  const handleGameSubmit = async (e) => {

    e.preventDefault();

    if (!authorized) {
      return;
    }


    setLoading(true);


    const isEditing =
      editingId !== null;


    const url = isEditing
      ? "https://parvatiputra.ct.ws/update_game.php"
      : "https://parvatiputra.ct.ws/add_game.php";


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
              game_id: editingId,
            }),

            game_name:
              gameName,

            game_date:
              gameDate,

            game_time:
              gameTime,

            description:
              description,

          }),

        });


      const data =
        await response.json();


      if (data.success) {

        showMessage(
          isEditing
            ? "Game updated successfully."
            : "Game added successfully.",
          "success"
        );


        resetGameForm();

        loadGames();

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
   * Edit game
   */
  const handleEditGame = (game) => {

    setEditingId(
      game.game_id
    );

    setGameName(
      game.game_name
    );

    setGameDate(
      game.game_date
    );

    setGameTime(
      game.game_time
    );

    setDescription(
      game.description || ""
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /*
   * Delete game
   */
  const handleDeleteGame = async (
    gameId
  ) => {

    if (!authorized) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this game? All winners associated with this game will also be deleted."
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          "https://parvatiputra.ct.ws/delete_game.php",
          {

            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              game_id: gameId,
            }),

          }
        );


      const data =
        await response.json();


      if (data.success) {

        showMessage(
          "Game deleted successfully.",
          "success"
        );

        loadGames();

      } else {

        showMessage(
          data.message ||
            "Failed to delete game.",
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
   * Open winner form
   */
  const openWinnerForm = (gameId) => {

    setWinnerGameId(gameId);

    setWinnerName("");

    setWinnerPosition("1st");
  };


  /*
   * Cancel winner form
   */
  const closeWinnerForm = () => {

    setWinnerGameId(null);

    setWinnerName("");

    setWinnerPosition("1st");
  };


  /*
   * Add winner
   */
  const handleAddWinner = async (e) => {

    e.preventDefault();

    if (!authorized) {
      return;
    }


    if (!winnerName.trim()) {

      showMessage(
        "Winner name is required.",
        "error"
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          "https://parvatiputra.ct.ws/add_game_winner.php",
          {

            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              game_id:
                winnerGameId,

              winner_name:
                winnerName.trim(),

              position:
                winnerPosition,

            }),

          }
        );


      const data =
        await response.json();


      if (data.success) {

        showMessage(
          "Winner added successfully.",
          "success"
        );


        closeWinnerForm();

        loadGames();

      } else {

        showMessage(
          data.message ||
            "Failed to add winner.",
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
   * Delete winner
   */
  const handleDeleteWinner = async (
    winnerId
  ) => {

    if (!authorized) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this winner?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          "https://parvatiputra.ct.ws/delete_game_winner.php",
          {

            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              winner_id: winnerId,
            }),

          }
        );


      const data =
        await response.json();


      if (data.success) {

        showMessage(
          "Winner deleted successfully.",
          "success"
        );

        loadGames();

      } else {

        showMessage(
          data.message ||
            "Failed to delete winner.",
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
   * Waiting for session check
   */
  if (authorized === null) {

    return (

      <div className="manage-games-page">

        <div className="manage-games-loading">
          Checking authorization...
        </div>

      </div>
    );
  }


  /*
   * Access denied
   */
  if (!authorized) {

    return (

      <div className="manage-games-page">

        <div className="games-unauthorized">

          <div className="games-unauthorized-icon">
            !
          </div>

          <h1>
            Access Denied
          </h1>

          <p>
            Only admin and root users can
            manage games.
          </p>

          <button
            onClick={() =>
              navigate("/games")
            }
          >
            Back to Games
          </button>

        </div>

      </div>
    );
  }


  return (

    <div className="manage-games-page">

      {/* Header */}

      <header className="manage-games-header">

        <button
          className="manage-games-back"
          onClick={() =>
            navigate("/games")
          }
        >
          ← Games
        </button>


        <div className="manage-games-title">

          <div className="manage-games-logo">
            P
          </div>

          <div>

            <h1>
              Manage Games
            </h1>

            <p>
              Add games and manage winners
            </p>

          </div>

        </div>


        <div className="games-role-badge">
          {role}
        </div>

      </header>


      <main className="manage-games-main">


        {/* Message */}

        {message && (

          <div
            className={`games-message ${messageType}`}
          >
            {message}
          </div>

        )}


        {/* Add / Edit Game */}

        <section className="game-form-card">

          <div className="game-form-heading">

            <div className="game-form-icon">
              {editingId ? "✎" : "+"}
            </div>

            <div>

              <h2>
                {editingId
                  ? "Edit Game"
                  : "Add New Game"}
              </h2>

              <p>
                {editingId
                  ? "Update game details"
                  : "Create a new committee game"}
              </p>

            </div>

          </div>


          <form
            className="manage-game-form"
            onSubmit={handleGameSubmit}
          >

            <div className="manage-game-input">

              <label>
                Game Name
              </label>

              <input
                type="text"
                placeholder="e.g. Cricket"
                value={gameName}
                onChange={(e) =>
                  setGameName(
                    e.target.value
                  )
                }
                required
              />

            </div>


            <div className="game-form-columns">

              <div className="manage-game-input">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={gameDate}
                  onChange={(e) =>
                    setGameDate(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="manage-game-input">

                <label>
                  Time
                </label>

                <input
                  type="time"
                  value={gameTime}
                  onChange={(e) =>
                    setGameTime(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>


            <div className="manage-game-input">

              <label>
                Description
                <span>
                  Optional
                </span>
              </label>

              <textarea
                rows="3"
                placeholder="Enter game details..."
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="game-form-actions">

              <button
                type="submit"
                className="save-game-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Game"
                    : "Add Game"}
              </button>


              {editingId && (

                <button
                  type="button"
                  className="cancel-game-btn"
                  onClick={resetGameForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>


        {/* Existing Games */}

        <section className="existing-games">

          <div className="existing-games-heading">

            <div>

              <h2>
                Existing Games
              </h2>

              <p>
                {games.length} game
                {games.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>


            <button
              className="refresh-games-btn"
              onClick={loadGames}
            >
              ↻ Refresh
            </button>

          </div>


          {loadingGames ? (

            <div className="games-list-status">
              Loading games...
            </div>

          ) : games.length === 0 ? (

            <div className="games-list-status">
              No games available.
            </div>

          ) : (

            <div className="manage-games-list">

              {games.map((game) => (

                <div
                  className="manage-game-card"
                  key={game.game_id}
                >

                  {/* Game information */}

                  <div className="manage-game-top">

                    <div className="manage-game-icon">
                      🏆
                    </div>

                    <div className="manage-game-info">

                      <h3>
                        {game.game_name}
                      </h3>

                      <p>
                        📅 {game.game_date}
                        {" • "}
                        🕐 {game.game_time}
                      </p>

                      {game.description && (
                        <small>
                          {game.description}
                        </small>
                      )}

                    </div>

                  </div>


                  {/* Game buttons */}

                  <div className="manage-game-buttons">

                    <button
                      className="edit-game-btn"
                      onClick={() =>
                        handleEditGame(game)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="winner-game-btn"
                      onClick={() =>
                        openWinnerForm(
                          game.game_id
                        )
                      }
                    >
                      + Winner
                    </button>


                    <button
                      className="delete-game-btn"
                      onClick={() =>
                        handleDeleteGame(
                          game.game_id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>


                  {/* Add winner */}

                  {winnerGameId ===
                    game.game_id && (

                    <form
                      className="winner-form"
                      onSubmit={
                        handleAddWinner
                      }
                    >

                      <div className="winner-form-title">
                        Add Winner
                      </div>


                      <div className="winner-form-fields">

                        <input
                          type="text"
                          placeholder="Winner name"
                          value={winnerName}
                          onChange={(e) =>
                            setWinnerName(
                              e.target.value
                            )
                          }
                          required
                        />


                        <select
                          value={
                            winnerPosition
                          }
                          onChange={(e) =>
                            setWinnerPosition(
                              e.target.value
                            )
                          }
                        >

                          <option value="1st">
                            🥇 1st
                          </option>

                          <option value="2nd">
                            🥈 2nd
                          </option>

                          <option value="3rd">
                            🥉 3rd
                          </option>

                          <option value="Participant">
                            🏅 Participant
                          </option>

                        </select>


                        <button
                          type="submit"
                          disabled={loading}
                        >
                          Add
                        </button>


                        <button
                          type="button"
                          className="cancel-winner-btn"
                          onClick={
                            closeWinnerForm
                          }
                        >
                          Cancel
                        </button>

                      </div>

                    </form>

                  )}


                  {/* Winners */}

                  <div className="manage-winners">

                    <div className="manage-winners-title">
                      🏅 Winners
                    </div>


                    {game.winners &&
                    game.winners.length > 0 ? (

                      <div className="manage-winner-list">

                        {game.winners.map(
                          (winner) => (

                            <div
                              className="manage-winner-row"
                              key={
                                winner.winner_id
                              }
                            >

                              <div className="manage-winner-medal">

                                {winner.position ===
                                "1st"
                                  ? "🥇"
                                  : winner.position ===
                                      "2nd"
                                    ? "🥈"
                                    : winner.position ===
                                        "3rd"
                                      ? "🥉"
                                      : "🏅"}

                              </div>


                              <div className="manage-winner-info">

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


                              <button
                                className="delete-winner-btn"
                                onClick={() =>
                                  handleDeleteWinner(
                                    winner.winner_id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="no-game-winners">
                        No winners added yet.
                      </p>

                    )}

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

export default ManageGames;