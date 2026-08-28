import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  const [balance, setBalance] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");


  /*
   * Load transactions
   */
  const fetchTransactions = async () => {

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        "https://parvatiputra.ct.ws/get_transactions.php",
        {
          method: "GET",
          credentials: "include",
        }
      );


      const data = await response.json();


      if (data.success) {

        setTransactions(
          data.transactions || []
        );

        setBalance(
          Number(data.current_balance || 0)
        );

        setTotalDonations(
          Number(data.total_donations || 0)
        );

        setTotalExpenses(
          Number(data.total_expenses || 0)
        );

      } else {

        setMessage(
          data.message ||
          "Unable to load transactions."
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


  useEffect(() => {
    fetchTransactions();
  }, []);


  /*
   * Format amount
   */
  const formatAmount = (amount) => {

    return Number(amount).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };


  /*
   * Format date
   */
  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };


  /*
   * Filter transactions
   */
  const filteredTransactions =
    transactions.filter((transaction) => {

      /*
       * Type filter
       */
      if (
        filter !== "all" &&
        transaction.type !== filter
      ) {
        return false;
      }


      /*
       * Search filter
       */
      if (search.trim() !== "") {

        const searchText =
          search.toLowerCase();

        const searchableText = `
          ${transaction.description || ""}
          ${transaction.type || ""}
          ${transaction.payment_mode || ""}
          ${transaction.reference_id || ""}
        `.toLowerCase();

        if (
          !searchableText.includes(
            searchText
          )
        ) {
          return false;
        }
      }


      /*
       * From date
       */
      if (fromDate) {

        const transactionDate =
          new Date(
            transaction.created_at
          );

        const startDate =
          new Date(fromDate);

        startDate.setHours(
          0,
          0,
          0,
          0
        );

        if (transactionDate < startDate) {
          return false;
        }
      }


      /*
       * To date
       */
      if (toDate) {

        const transactionDate =
          new Date(
            transaction.created_at
          );

        const endDate =
          new Date(toDate);

        endDate.setHours(
          23,
          59,
          59,
          999
        );

        if (transactionDate > endDate) {
          return false;
        }
      }


      return true;
    });


  /*
   * Clear filters
   */
  const clearFilters = () => {

    setFilter("all");
    setSearch("");
    setFromDate("");
    setToDate("");
  };


  return (
    <div className="transactions-page">

      {/* Header */}

      <header className="transactions-header">

        <button
          className="transactions-back"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>


        <div className="transactions-title">

          <div className="transactions-icon">
            ₹
          </div>

          <div>
            <h1>
              Transactions
            </h1>

            <p>
              View donations, expenses and balance
            </p>
          </div>

        </div>


        <button
          className="refresh-btn"
          onClick={fetchTransactions}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </header>


      <main className="transactions-content">


        {/* Summary Cards */}

        <div className="summary-grid">

          <div className="summary-card balance-card">

            <div className="summary-icon">
              ₹
            </div>

            <div>

              <span>
                Available Balance
              </span>

              <strong>
                ₹{formatAmount(balance)}
              </strong>

            </div>

          </div>


          <div className="summary-card donation-summary">

            <div className="summary-icon">
              ↑
            </div>

            <div>

              <span>
                Total Donations
              </span>

              <strong>
                ₹{formatAmount(totalDonations)}
              </strong>

            </div>

          </div>


          <div className="summary-card expense-summary">

            <div className="summary-icon">
              ↓
            </div>

            <div>

              <span>
                Total Expenses
              </span>

              <strong>
                ₹{formatAmount(totalExpenses)}
              </strong>

            </div>

          </div>

        </div>


        {/* Filters */}

        <div className="filter-card">

          <div className="filter-top">

            <div>

              <h2>
                Recent Transactions
              </h2>

              <p>
                {filteredTransactions.length} transaction
                {filteredTransactions.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>


            <button
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>


          <div className="filter-controls">


            {/* Type */}

            <div className="filter-group">

              <label>
                Type
              </label>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
              >

                <option value="all">
                  All Transactions
                </option>

                <option value="donation">
                  Donations
                </option>

                <option value="expense">
                  Expenses
                </option>

              </select>

            </div>


            {/* Search */}

            <div className="filter-group search-group">

              <label>
                Search
              </label>

              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            {/* From */}

            <div className="filter-group">

              <label>
                From
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
              />

            </div>


            {/* To */}

            <div className="filter-group">

              <label>
                To
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
              />

            </div>

          </div>

        </div>


        {/* Error */}

        {message && (

          <div className="transaction-message">
            {message}
          </div>

        )}


        {/* Loading */}

        {loading ? (

          <div className="transactions-loading">

            <div className="transaction-loader"></div>

            <p>
              Loading transactions...
            </p>

          </div>

        ) : filteredTransactions.length === 0 ? (

          /* Empty */

          <div className="empty-transactions">

            <div className="empty-icon">
              ₹
            </div>

            <h3>
              No transactions found
            </h3>

            <p>
              Try changing your filters.
            </p>

          </div>

        ) : (

          /* Transaction List */

          <div className="transaction-list">

            {filteredTransactions.map(
              (transaction) => (

                <div
                  className="transaction-item"
                  key={transaction.id}
                >

                  <div
                    className={`transaction-type-icon ${
                      transaction.type ===
                      "donation"
                        ? "donation-icon"
                        : "expense-icon"
                    }`}
                  >

                    {transaction.type ===
                    "donation"
                      ? "↑"
                      : "↓"}

                  </div>


                  <div className="transaction-details">

                    <h3>
                      {transaction.description ||
                        (transaction.type ===
                        "donation"
                          ? "Donation"
                          : "Expense")}
                    </h3>

                    <div className="transaction-meta">

                      <span>
                        {formatDate(
                          transaction.created_at
                        )}
                      </span>

                      {transaction.payment_mode && (
                        <>
                          <span className="dot">
                            •
                          </span>

                          <span>
                            {transaction.payment_mode.replace(
                              "_",
                              " "
                            )}
                          </span>
                        </>
                      )}

                    </div>

                  </div>


                  <div className="transaction-right">

                    <strong
                      className={
                        transaction.type ===
                        "donation"
                          ? "income"
                          : "expense"
                      }
                    >
                      {transaction.type ===
                      "donation"
                        ? "+"
                        : "-"}
                      ₹
                      {formatAmount(
                        transaction.amount
                      )}
                    </strong>


                    <span>
                      Balance: ₹
                      {formatAmount(
                        transaction.current_balance
                      )}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>


      <footer className="transactions-footer">
        Parvatiputra Committee Management System
      </footer>

    </div>
  );
}

export default Transactions;