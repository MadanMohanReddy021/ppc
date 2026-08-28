import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ManageGames from "./pages/ManageGames";
import Login from "./pages/Login";
import AddDonation from "./pages/AddDonation";
import Games from "./pages/Games";
import "./App.css";
import Events from "./pages/Events";
import ManageEvents from "./pages/ManageEvents";
import Transactions from "./pages/Transactions";
import AddExpense from "./pages/AddExpense";

function Home() {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);


  // Check PHP session when home page loads
  useEffect(() => {

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

        setLoggedIn(data.logged_in);
        setRole(data.role);

      } catch (error) {

        console.error("Session check failed:", error);

        setLoggedIn(false);
        setRole(null);

      } finally {

        setCheckingSession(false);

      }
    };

    checkSession();

  }, []);


  // While checking PHP session
  if (checkingSession) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }


  const canManage = (
    loggedIn &&
    (role === "root" || role === "admin")
  );


  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="logo">

          <div className="logo-mark">
            P
          </div>

          <div className="logo-name">
            Parvatiputra
          </div>

        </div>


        <div className="header-right">

          {loggedIn && (
            <span className="user-role">
              {role}
            </span>
          )}

          {!loggedIn && (
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Admin Login
            </button>
          )}

        </div>

      </header>


      {/* MAIN */}

      <main className="main-content">

        <div className="welcome-label">
          Committee Management
        </div>

        <h2>
          Welcome to Parvatiputra
        </h2>

        <p className="subtitle">
          Manage donations, expenses and transactions
          from one place.
        </p>


        <div className="card-container">


         {/* DONATION */}

{canManage && (
  <div className="action-card">

    <div className="icon-box">
      💰
    </div>

    <h3>
      Add Donation
    </h3>

    <p>
      Record donations received by the committee
      and keep track of every contribution.
    </p>

    <button
      className="action-btn"
      onClick={() => navigate("/add-donation")}
    >
      Add Donation
    </button>

  </div>
)}


{/* EXPENSE */}

{canManage && (
  <div className="action-card">

    <div className="icon-box">
      💳
    </div>

    <h3>
      Add Expense
    </h3>

    <p>
      Record committee expenses and maintain
      an accurate financial history.
    </p>

    <button
      className="action-btn"
      onClick={() => navigate("/add-expense")}
    >
      Add Expense
    </button>

  </div>
)}

          {/* TRANSACTIONS */}

          <div className="action-card">

            <div className="icon-box">
              📊
            </div>

            <h3>
              Transactions
            </h3>

            <p>
              View donation and expense history
              and track the current balance.
            </p>

            <button
              className="action-btn"
              onClick={() => navigate("/transactions")}
            >
              View Transactions
            </button>

          </div>
        <div
  className="action-card"
  onClick={() => navigate("/events")}
  style={{ cursor: "pointer" }}
>
  <div className="icon-box">
    📅
  </div>

  <h3>Events</h3>

  <p>
    View upcoming committee events,
    dates and timings.
  </p>

  <button
    className="action-btn"
    onClick={(e) => {
      e.stopPropagation();
      navigate("/events");
    }}
  >
    View Events
  </button>
</div>
<div className="action-card">
  <div className="icon-box">
    🏆
  </div>

  <h3>Games</h3>

  <p>
    View committee games, schedules and
    winners.
  </p>

  <button
    className="action-btn"
    onClick={() => navigate("/games")}
  >
    View Games
  </button>
</div>
        </div>

      </main>


      <footer className="footer">
        © 2026 Parvatiputra Committee
      </footer>

    </div>
  );
}


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
  path="/add-donation"
  element={<AddDonation />}
/>
<Route
  path="/transactions"
  element={<Transactions />}
/>
<Route
  path="/manage-events"
  element={<ManageEvents />}
/>
<Route
  path="/add-expense"
  element={<AddExpense />}
/>
<Route
  path="/events"
  element={<Events />}
/>
<Route
  path="/games"
  element={<Games />}
/>
<Route
  path="/manage-games"
  element={<ManageGames />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;