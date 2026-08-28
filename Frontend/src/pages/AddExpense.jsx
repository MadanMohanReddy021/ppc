import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AddExpense.css";

function AddExpense() {
  const navigate = useNavigate();

  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [receipt, setReceipt] = useState(null);


  /*
   * Reference to the receipt HTML
   */
  const receiptRef = useState(null);

  const [receiptElement, setReceiptElement] =
    useState(null);


  /*
   * Format amount
   */
  const formatAmount = (value) => {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  /*
   * Format date
   */
  const formatDate = (date) => {
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };


  /*
   * Create PDF from receipt
   */
  const createPDF = async () => {

    if (!receiptElement) {
      return null;
    }


    const canvas = await html2canvas(
      receiptElement,
      {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fffdf9",
      }
    );


    const imageData =
      canvas.toDataURL("image/png");


    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });


    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();


    const margin = 10;

    const availableWidth =
      pageWidth - margin * 2;


    const imageHeight =
      (canvas.height * availableWidth) /
      canvas.width;


    if (
      imageHeight <=
      pageHeight - margin * 2
    ) {

      pdf.addImage(
        imageData,
        "PNG",
        margin,
        margin,
        availableWidth,
        imageHeight
      );

    } else {

      const scaledHeight =
        pageHeight - margin * 2;

      const scaledWidth =
        (canvas.width * scaledHeight) /
        canvas.height;

      pdf.addImage(
        imageData,
        "PNG",
        (pageWidth - scaledWidth) / 2,
        margin,
        scaledWidth,
        scaledHeight
      );
    }


    return pdf.output("blob");
  };


  /*
   * Download PDF
   */
  const handleDownloadPDF = async () => {

    try {

      const pdfBlob =
        await createPDF();


      if (!pdfBlob) {
        return;
      }


      const url =
        URL.createObjectURL(pdfBlob);


      const link =
        document.createElement("a");


      link.href = url;

      link.download =
        `Parvatiputra-Expense-${receipt.expenseId}.pdf`;


      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);


      URL.revokeObjectURL(url);

    } catch (error) {

      console.error(
        "PDF generation failed:",
        error
      );

      alert(
        "Unable to generate the PDF."
      );
    }
  };


  /*
   * Share actual PDF
   */
  const handleShare = async () => {

    try {

      const pdfBlob =
        await createPDF();


      if (!pdfBlob) {
        return;
      }


      const fileName =
        `Parvatiputra-Expense-${receipt.expenseId}.pdf`;


      const pdfFile =
        new File(
          [pdfBlob],
          fileName,
          {
            type: "application/pdf",
          }
        );


      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [pdfFile],
        })
      ) {

        await navigator.share({

          title:
            "Parvatiputra Expense Receipt",

          text:
            "Expense Receipt",

          files: [pdfFile],

        });

      } else {

        await handleDownloadPDF();

        alert(
          "This browser does not support PDF sharing. The PDF has been downloaded."
        );
      }

    } catch (error) {

      if (
        error.name !== "AbortError"
      ) {

        console.error(
          "Share failed:",
          error
        );

        alert(
          "Unable to share the PDF."
        );
      }
    }
  };


  /*
   * Add expense
   */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setLoading(true);


    try {

      const response =
        await fetch(
          "https://parvatiputra.ct.ws/add_expense.php",
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              expense_name:
                expenseName,

              amount:
                Number(amount),

              description:
                description,

            }),
          }
        );


      const data =
        await response.json();


      if (data.success) {

        setReceipt({

          expenseId:
            data.expense_id,

          transactionId:
            data.transaction_id,

          expenseName:
            expenseName,

          amount:
            Number(amount),

          description:
            description,

          date:
            new Date(),

        });


        setExpenseName("");

        setAmount("");

        setDescription("");

      } else {

        setMessage(
          data.message ||
          "Failed to add expense"
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
   * New expense
   */
  const handleNewExpense = () => {

    setReceipt(null);

    setMessage("");

    setReceiptElement(null);
  };


  /*
   * Receipt page
   */
  if (receipt) {

    return (

      <div className="expense-page">

        <div className="expense-receipt-container">

          <div className="expense-success-icon">
            ✓
          </div>


          <h1>
            Expense Added
          </h1>


          <p className="expense-success-text">
            The expense has been recorded successfully.
          </p>


          {/* Printable Receipt */}

          <div
            className="expense-receipt"
            ref={(element) =>
              setReceiptElement(element)
            }
          >

            <div className="expense-vinayaka">
              ॐ
            </div>

            <div className="expense-hindi">
              श्री गणेशाय नमः
            </div>


            <div className="expense-receipt-header">

              <div className="expense-logo">
                P
              </div>

              <div>

                <h2>
                  Parvatiputra
                </h2>

                <p>
                  Expense Receipt
                </p>

              </div>

            </div>


            <div className="expense-divider"></div>


            <div className="expense-row">

              <span>
                Expense No
              </span>

              <strong>
                #{receipt.expenseId}
              </strong>

            </div>


            <div className="expense-row">

              <span>
                Expense Name
              </span>

              <strong>
                {receipt.expenseName}
              </strong>

            </div>


            <div className="expense-row">

              <span>
                Amount
              </span>

              <strong className="expense-amount">
                ₹{formatAmount(receipt.amount)}
              </strong>

            </div>


            <div className="expense-row">

              <span>
                Date
              </span>

              <strong>
                {formatDate(receipt.date)}
              </strong>

            </div>


            {receipt.description && (

              <div className="expense-description">

                <span>
                  Description
                </span>

                <p>
                  {receipt.description}
                </p>

              </div>

            )}


            <div className="expense-divider"></div>


            <div className="expense-thank-you">
              Expense recorded successfully.
            </div>


            <div className="expense-hindi-bottom">
              ॐ श्री गणेशाय नमः
            </div>

          </div>


          {/* Buttons */}

          <div className="expense-actions">

            <button
              className="expense-share-btn"
              onClick={handleShare}
            >
              ↗ Share PDF Receipt
            </button>


            <button
              className="expense-pdf-btn"
              onClick={handleDownloadPDF}
            >
              ↓ Download PDF
            </button>


            <button
              className="expense-new-btn"
              onClick={handleNewExpense}
            >
              + Add Another Expense
            </button>


            <button
              className="expense-back-btn"
              onClick={() =>
                navigate("/")
              }
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>
    );
  }


  /*
   * Expense form
   */
  return (

    <div className="expense-page">

      <div className="expense-container">

        <div className="expense-header">

          <button
            className="expense-back-link"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back
          </button>


          <div className="expense-title">

            <div className="expense-title-icon">
              ↓
            </div>

            <div>

              <h1>
                Add Expense
              </h1>

              <p>
                Record a committee expense
              </p>

            </div>

          </div>

        </div>


        <div className="expense-vinayaka-header">

          <div>
            ॐ
          </div>

          <span>
            श्री गणेशाय नमः
          </span>

        </div>


        <form
          className="expense-form"
          onSubmit={handleSubmit}
        >

          {/* Expense Name */}

          <div className="expense-input-group">

            <label htmlFor="expenseName">
              Expense Name
            </label>

            <input
              id="expenseName"
              type="text"
              placeholder="e.g. Decoration"
              value={expenseName}
              onChange={(e) =>
                setExpenseName(
                  e.target.value
                )
              }
              required
            />

          </div>


          {/* Amount */}

          <div className="expense-input-group">

            <label htmlFor="expenseAmount">
              Expense Amount
            </label>

            <div className="expense-amount-input">

              <span>
                ₹
              </span>

              <input
                id="expenseAmount"
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </div>


          {/* Description */}

          <div className="expense-input-group">

            <label htmlFor="description">
              Description
              <span className="optional">
                Optional
              </span>
            </label>

            <textarea
              id="description"
              rows="4"
              placeholder="Enter details about the expense..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

          </div>


          {message && (

            <div className="expense-error">
              {message}
            </div>

          )}


          <button
            type="submit"
            className="expense-submit"
            disabled={loading}
          >

            {loading
              ? "Adding Expense..."
              : "Add Expense"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddExpense;