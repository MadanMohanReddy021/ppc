import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./AddDonation.css";

function AddDonation() {
  const navigate = useNavigate();
const receiptRef = useRef(null);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [receipt, setReceipt] = useState(null);


  /*
   * Convert ArrayBuffer to binary string
   * required by jsPDF for custom fonts
   */
  const arrayBufferToBinaryString = (buffer) => {
    const bytes = new Uint8Array(buffer);

    let binary = "";

    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(
        ...bytes.subarray(
          i,
          Math.min(i + chunkSize, bytes.length)
        )
      );
    }

    return binary;
  };


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
   * Load Hindi font into jsPDF
   */
  


  /*
   * Convert image URL to Data URL
   */
  const loadImageAsDataURL = async (url) => {

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "Unable to load Vinayaka image"
      );
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);

    });
  };


  /*
   * Create PDF
   */
 const createPDF = async () => {
  if (!receiptRef.current) {
    return null;
  }

  /*
   * Render the HTML receipt.
   *
   * Browser handles:
   * - Hindi
   * - Om
   * - ₹
   * - images
   * - Unicode
   */
  const canvas = await html2canvas(
    receiptRef.current,
    {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fffdf9",
    }
  );

  const imageData =
    canvas.toDataURL("image/png");


  /*
   * A4 PDF
   */
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });


  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();


  /*
   * Keep small margins.
   */
  const margin = 10;

  const availableWidth =
    pageWidth - margin * 2;


  const imageHeight =
    (canvas.height * availableWidth) /
    canvas.width;


  /*
   * If receipt fits on one page.
   */
  if (imageHeight <= pageHeight - margin * 2) {

    pdf.addImage(
      imageData,
      "PNG",
      margin,
      margin,
      availableWidth,
      imageHeight
    );

  } else {

    /*
     * Scale it down if necessary.
     */
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


  /*
   * Return actual PDF Blob.
   */
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
        `Parvatiputra-Donation-${receipt.donationId}.pdf`;


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
        `Parvatiputra-Donation-${receipt.donationId}.pdf`;


      const pdfFile =
        new File(
          [pdfBlob],
          fileName,
          {
            type: "application/pdf",
          }
        );


      /*
       * Browser supports file sharing
       */
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [pdfFile],
        })
      ) {

        await navigator.share({

          title:
            "Parvatiputra Donation Receipt",

          text:
            "Donation Receipt",

          files: [pdfFile],

        });

      } else {

        /*
         * Fallback
         */
        await handleDownloadPDF();

        alert(
          "This browser does not support sharing PDF files. The PDF has been downloaded."
        );
      }

    } catch (error) {

      if (
        error.name !==
        "AbortError"
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
   * Submit donation
   */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    setLoading(true);


    try {

      const response =
        await fetch(
          "http://localhost/ppc/add_donation.php",
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              donor_name:
                donorName,

              amount:
                Number(amount),

              payment_mode:
                paymentMode,

            }),
          }
        );


      const data =
        await response.json();


      if (data.success) {

        setReceipt({

          donationId:
            data.donation_id,

          transactionId:
            data.transaction_id,

          donorName:
            donorName,

          amount:
            Number(amount),

          paymentMode:
            paymentMode,

          date:
            new Date(),

        });


        setDonorName("");

        setAmount("");

        setPaymentMode("");

      } else {

        setMessage(
          data.message ||
          "Failed to add donation"
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
   * New donation
   */
  const handleNewDonation = () => {

    setReceipt(null);

    setMessage("");
  };


  /*
   * RECEIPT PAGE
   */
  if (receipt) {

    return (

      <div className="donation-page">

        <div className="receipt-container">

          <div className="receipt-vinayaka">
            ॐ
          </div>

          <div className="receipt-hindi">
            श्री गणेशाय नमः
          </div>


          <div className="success-icon">
            ✓
          </div>


          <h1>
            Donation Successful
          </h1>


          <p className="success-text">
            Your donation has been recorded successfully.
          </p>


          <div
  className="receipt"
  ref={receiptRef}
><div className="pdf-vinayaka">

  <img
    src="/images/vinayaka.png"
    alt="Lord Ganesha"
  />

</div>

<div className="pdf-hindi-title">
  ॐ श्री गणेशाय नमः
</div>

            <div className="receipt-header">

              <div className="receipt-logo">
                P
              </div>

              <div>

                <h2>
                  Parvatiputra
                </h2>

                <p>
                  Donation Receipt
                </p>

              </div>

            </div>


            <div className="receipt-divider"></div>


            <div className="receipt-row">

              <span>
                Receipt No
              </span>

              <strong>
                #{receipt.donationId}
              </strong>

            </div>


            <div className="receipt-row">

              <span>
                Donor Name
              </span>

              <strong>
                {receipt.donorName}
              </strong>

            </div>


            <div className="receipt-row">

              <span>
                Amount
              </span>

              <strong className="receipt-amount">
                ₹{formatAmount(receipt.amount)}
              </strong>

            </div>


            <div className="receipt-row">

              <span>
                Payment Method
              </span>

              <strong>
                {receipt.paymentMode.replace(
                  "_",
                  " "
                )}
              </strong>

            </div>


            <div className="receipt-row">

              <span>
                Date
              </span>

              <strong>
                {formatDate(receipt.date)}
              </strong>

            </div>


            <div className="receipt-divider"></div>


            <p className="thank-you">
              Thank you for your valuable contribution.
            </p>


            <div className="receipt-hindi-bottom">
              आपके सहयोग के लिए धन्यवाद
            </div>


            <div className="receipt-ganesha">
              ॐ श्री गणेशाय नमः
            </div>

          </div>


          <div className="receipt-actions">

            <button
              className="share-btn"
              onClick={handleShare}
            >
              ↗ Share PDF Receipt
            </button>


            <button
              className="pdf-btn"
              onClick={handleDownloadPDF}
            >
              ↓ Download PDF
            </button>


            <button
              className="new-donation-btn"
              onClick={handleNewDonation}
            >
              + Add Another Donation
            </button>


            <button
              className="back-home-btn"
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
   * DONATION FORM
   */
  return (

    <div className="donation-page">

      <div className="donation-container">

        <div className="donation-header">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back
          </button>


          <div className="donation-title">

            <div className="donation-logo">
              P
            </div>

            <div>

              <h1>
                Add Donation
              </h1>

              <p>
                Record a new contribution
              </p>

            </div>

          </div>

        </div>


        <div className="vinayaka-header">

          <div className="vinayaka-symbol">
            ॐ
          </div>

          <div>
            श्री गणेशाय नमः
          </div>

        </div>


        <form
          className="donation-form"
          onSubmit={handleSubmit}
        >

          <div className="input-group">

            <label htmlFor="donorName">
              Donor Name
            </label>

            <input
              id="donorName"
              type="text"
              placeholder="Enter donor name"
              value={donorName}
              onChange={(e) =>
                setDonorName(
                  e.target.value
                )
              }
              required
            />

          </div>


          <div className="input-group">

            <label htmlFor="amount">
              Donation Amount
            </label>

            <div className="amount-input">

              <span>
                ₹
              </span>

              <input
                id="amount"
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


          <div className="input-group">

            <label htmlFor="paymentMode">
              Payment Method
            </label>

            <select
              id="paymentMode"
              value={paymentMode}
              onChange={(e) =>
                setPaymentMode(
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Select payment method
              </option>

              <option value="cash">
                Cash
              </option>

              <option value="upi">
                UPI
              </option>

              <option value="bank_transfer">
                Bank Transfer
              </option>

              <option value="cheque">
                Cheque
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>


          {message && (

            <div className="donation-error">
              {message}
            </div>

          )}


          <button
            type="submit"
            className="donation-submit"
            disabled={loading}
          >

            {loading
              ? "Adding Donation..."
              : "Add Donation"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddDonation;