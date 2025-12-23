import React, { useEffect, useState } from "react";
import withAdminAuth from "../../utils/withAdminAuth";
import axios from "axios";
import { getApiUrl } from "../../config/api";
import { Modal, Button, Spinner } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [report, setReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        getApiUrl("api/orders/admin/stats")
      );
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics. Please try again later.");
      setLoading(false);
    }
  };

  const generateAIReport = async () => {
    setGeneratingReport(true);
    setReport(null);
    setShowReportModal(true);

    try {
      console.log("Sending request to generate AI report...");
      const response = await axios.get(
        getApiUrl("api/admin/report")
      );
      console.log("AI report received:", response.data);
      setReport(response.data);
    } catch (err) {
      console.error("Error generating AI report:", err);
      let errorMessage = "Failed to generate report. Please try again.";

      if (err.response) {
        console.error("Error response data:", err.response.data);
        errorMessage = err.response.data.message || errorMessage;
        if (err.response.data.error) {
          errorMessage += " Details: " + err.response.data.error;
        }
      }

      setReport({
        error: errorMessage,
        errorDetails: err.message,
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="container pt-5 text-center text-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container pt-5 text-center text-light">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const shippedOrders = stats?.shippedOrders ?? 0;
  const deliveredOrders = stats?.deliveredOrders ?? 0;
  const totalProducts = stats?.totalProducts ?? 0;

  const totalTracked = deliveredOrders + shippedOrders + pendingOrders;
  const deliveredPercent = totalTracked
    ? Math.round((deliveredOrders / totalTracked) * 100)
    : 0;

  const chartData = [
    { label: "Pending", value: pendingOrders, color: "#ffc107" },
    { label: "Shipped", value: shippedOrders, color: "#0dcaf0" },
    { label: "Delivered", value: deliveredOrders, color: "#198754" },
  ];
  const maxValue = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div
      className="container py-4 text-light"
      style={{ background: "#1f1f1f", minHeight: "100vh" }}
    >
      <div className="row mb-4">
        <div className="col-12 d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={generateAIReport}
            disabled={generatingReport}
          >
            <i className="bi bi-robot me-2"></i>
            Generate AI Report
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card text-white h-100"
            style={{ background: "#1f1f1f" }}
          >
            <div className="card-body">
              <div className="mb-2">
                <i
                  className="bi bi-bar-chart-fill"
                  style={{ fontSize: 24 }}
                ></i>
              </div>
              <h4 className="card-title mb-0">
                ${totalRevenue.toLocaleString()}
              </h4>
              <small className="text-light">Gross Sales</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card text-white h-100"
            style={{ background: "#1f1f1f" }}
          >
            <div className="card-body">
              <div className="mb-2">
                <i className="bi bi-cash-coin" style={{ fontSize: 24 }}></i>
              </div>
              <h4 className="card-title mb-0">{totalOrders}</h4>
              <small className="text-success">Total Orders</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card text-white h-100"
            style={{ background: "#1f1f1f" }}
          >
            <div className="card-body">
              <div className="mb-2">
                <i
                  className="bi bi-bag-check-fill"
                  style={{ fontSize: 24 }}
                ></i>
              </div>
              <h4 className="card-title mb-0">{pendingOrders}</h4>
              <small className="text-light">Pending Orders</small>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div
            className="card text-white h-100"
            style={{ background: "#1f1f1f" }}
          >
            <div className="card-body">
              <div className="mb-2">
                <i className="bi bi-box-seam" style={{ fontSize: 24 }}></i>
              </div>
              <h4 className="card-title mb-0">{totalProducts}</h4>
              <small className="text-light">Available Products</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-12">
          <div className="card h-100" style={{ background: "#1f1f1f" }}>
            <div className="card-body">
              <h6 className="mb-3">Order Status Overview</h6>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  height: 180,
                  gap: 32,
                }}
              >
                {chartData.map((d) => (
                  <div key={d.label} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        height: `${(d.value / maxValue) * 120}px`,
                        background: d.color,
                        borderRadius: 8,
                        marginBottom: 8,
                        transition: "height 0.3s",
                        minHeight: "5px", // Ensure at least a visible line
                      }}
                    ></div>
                    <div style={{ fontWeight: 700 }}>{d.value}</div>
                    <div style={{ color: d.color }}>{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-4 offset-lg-4">
          <div className="card h-100" style={{ background: "#1f1f1f" }}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Tracking Report</h6>
                <span className="badge bg-secondary">All Orders</span>
              </div>
              <div className="d-flex flex-column align-items-center">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="#34354a"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="#00d084"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={339.292}
                    strokeDashoffset={339.292 * (1 - deliveredPercent / 100)}
                    strokeLinecap="round"
                  />
                  <text
                    x="60"
                    y="68"
                    textAnchor="middle"
                    fontSize="22"
                    fill="#fff"
                  >
                    {deliveredPercent}%
                  </text>
                </svg>
                <div className="mt-3">
                  <span className="d-block mb-1">
                    <span className="badge bg-success me-2">&nbsp;</span>
                    Delivered: {deliveredOrders}
                  </span>
                  <span className="d-block mb-1">
                    <span className="badge bg-primary me-2">&nbsp;</span>
                    Shipped: {shippedOrders}
                  </span>
                  <span className="d-block">
                    <span className="badge bg-warning me-2">&nbsp;</span>
                    Pending: {pendingOrders}
                  </span>
                </div>
                <button
                  className="btn btn-outline-light btn-sm mt-3"
                  onClick={() => (window.location.href = "/admin/orders")}
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{ background: "#1f1f1f", color: "white" }}
        >
          <Modal.Title>
            <i className="bi bi-robot me-2"></i>
            AI-Generated Business Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#1f1f1f", color: "white" }}>
          {generatingReport ? (
            <div className="text-center p-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">
                Our AI is analyzing your data and generating insights...
              </p>
            </div>
          ) : report && report.summary ? (
            <>
              <div className="card mb-4" style={{ background: "#2a2a2a" }}>
                <div className="card-body">
                  <h5 className="border-bottom pb-2">Business Summary</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Total Revenue:</strong> $
                        {(report.summary.totalRevenue || 0).toLocaleString()}
                      </p>
                      <p>
                        <strong>Total Orders:</strong>{" "}
                        {report.summary.totalOrders || 0}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Average Order Value:</strong> $
                        {report.summary.averageOrderValue || "0.00"}
                      </p>
                      <p>
                        <strong>Fulfillment Rate:</strong>{" "}
                        {report.summary.fulfillmentRate || "0"}%
                      </p>
                    </div>
                  </div>
                  <p>
                    <strong>Pending Revenue Opportunity:</strong> $
                    {report.summary.pendingRevenue || "0.00"}
                  </p>
                </div>
              </div>

              {report.insights && report.insights.length > 0 && (
                <div className="card mb-4" style={{ background: "#2a2a2a" }}>
                  <div className="card-body">
                    <h5 className="border-bottom pb-2">Key Insights</h5>
                    <ul className="mt-3">
                      {report.insights.map((insight, index) => (
                        <li key={index} className="mb-2">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {report.recommendations && report.recommendations.length > 0 && (
                <div className="card mb-3" style={{ background: "#2a2a2a" }}>
                  <div className="card-body">
                    <h5 className="border-bottom pb-2">AI Recommendations</h5>
                    <ol className="mt-3">
                      {report.recommendations.map((rec, index) => (
                        <li key={index} className="mb-2">
                          {rec}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              <div className="text-muted text-end mt-3">
                <small>
                  Report generated on{" "}
                  {report.dateGenerated || new Date().toLocaleString()}
                </small>
              </div>
            </>
          ) : (
            <div className="alert alert-danger">
              {report && report.error ? (
                <>
                  <p>
                    <strong>Error:</strong> {report.error}
                  </p>
                  {report.errorDetails && (
                    <p className="mt-2 small">
                      <strong>Technical details:</strong> {report.errorDetails}
                    </p>
                  )}
                </>
              ) : (
                "Failed to generate report. Please try again later."
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ background: "#1f1f1f", color: "white" }}>
          {!generatingReport && report && !report.error && (
            <Button
              variant="success"
              onClick={() => {
                const doc = new jsPDF();

                doc.setFontSize(18);
                doc.text("AI-Generated Business Report", 14, 20);

                doc.setFontSize(10);
                doc.text(
                  `Generated on: ${
                    report.dateGenerated || new Date().toISOString()
                  }`,
                  14,
                  30
                );

                doc.setFontSize(14);
                doc.text("Business Summary", 14, 40);
                doc.setFontSize(12);
                doc.text(
                  `Total Revenue: $${(
                    report.summary.totalRevenue || 0
                  ).toLocaleString()}`,
                  14,
                  50
                );
                doc.text(
                  `Total Orders: ${report.summary.totalOrders || 0}`,
                  14,
                  58
                );
                doc.text(
                  `Average Order Value: $${
                    report.summary.averageOrderValue || "0.00"
                  }`,
                  14,
                  66
                );
                doc.text(
                  `Fulfillment Rate: ${report.summary.fulfillmentRate || "0"}%`,
                  14,
                  74
                );
                doc.text(
                  `Pending Revenue Opportunity: $${
                    report.summary.pendingRevenue || "0.00"
                  }`,
                  14,
                  82
                );

                doc.setFontSize(14);
                doc.text("Key Insights", 14, 96);
                doc.setFontSize(12);
                let yPos = 104;
                (report.insights || []).forEach((insight) => {
                  const lines = doc.splitTextToSize(insight, 180);
                  doc.text(`• ${lines[0]}`, 14, yPos);
                  yPos += 8;
                  if (lines.length > 1) {
                    for (let i = 1; i < lines.length; i++) {
                      doc.text(`  ${lines[i]}`, 14, yPos);
                      yPos += 8;
                    }
                  }
                });

                doc.setFontSize(14);
                doc.text("AI Recommendations", 14, yPos + 8);
                doc.setFontSize(12);
                yPos += 16;
                (report.recommendations || []).forEach((rec, index) => {
                  const lines = doc.splitTextToSize(rec, 180);
                  doc.text(`${index + 1}. ${lines[0]}`, 14, yPos);
                  yPos += 8;
                  if (lines.length > 1) {
                    for (let i = 1; i < lines.length; i++) {
                      doc.text(`   ${lines[i]}`, 14, yPos);
                      yPos += 8;
                    }
                  }
                });

                doc.save(
                  `business-report-${
                    new Date().toISOString().split("T")[0]
                  }.pdf`
                );
              }}
            >
              <i className="bi bi-download me-2"></i>
              Export Report
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default withAdminAuth(Dashboard);
