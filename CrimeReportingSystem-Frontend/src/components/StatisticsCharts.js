import React from "react";
import styles from "../styles/StatisticsCharts.module.css";
import {
  FiBarChart2,
  FiPieChart,
  FiLineChart,
  FiTrendingUp,
} from "react-icons/fi";

/**
 * Statistics and Charts Component
 * Displays performance metrics and analytics
 */
const StatisticsCharts = ({ statistics }) => {
  if (!statistics) {
    return <div className={styles.container}>Loading statistics...</div>;
  }

  // Calculate resolution rate progress
  const resolutionRate = Math.round((statistics.resolutionRate || 0) * 100) / 100;
  const progressPercentage = Math.min(resolutionRate, 100);

  // Calculate performance rating
  const getPerformanceRating = () => {
    if (resolutionRate >= 80) return "Excellent";
    if (resolutionRate >= 60) return "Good";
    if (resolutionRate >= 40) return "Fair";
    return "Needs Improvement";
  };

  // Calculate case distribution
  const totalCases = (statistics.totalAssignedComplaints || 0) + 
                    (statistics.resolvedComplaints || 0) + 
                    (statistics.pendingComplaints || 0);
  
  const assignedPercent = totalCases > 0 ? Math.round((statistics.totalAssignedComplaints / totalCases) * 100) : 0;
  const resolvedPercent = totalCases > 0 ? Math.round((statistics.resolvedComplaints / totalCases) * 100) : 0;
  const pendingPercent = totalCases > 0 ? Math.round((statistics.pendingComplaints / totalCases) * 100) : 0;

  // Mock data for trend chart (in real implementation, this would come from backend)
  const trendData = generateTrendData();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Performance Analytics</h2>

      {/* Key Metrics Grid */}
      <div className={styles.metricsGrid}>
        {/* Resolution Rate */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3>Resolution Rate</h3>
            <FiTrendingUp className={styles.icon} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.percentage}>{resolutionRate}%</div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className={styles.rating}>{getPerformanceRating()}</div>
          </div>
        </div>

        {/* Average Resolution Time */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3>Avg Resolution Time</h3>
            <FiLineChart className={styles.icon} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.largeValue}>
              {statistics.averageResolutionTime 
                ? Math.round(statistics.averageResolutionTime) 
                : 0}
            </div>
            <div className={styles.unit}>days</div>
          </div>
        </div>

        {/* High Priority Cases */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3>High Priority Cases</h3>
            <FiBarChart2 className={styles.icon} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.largeValue}>
              {statistics.highPriorityComplaints || 0}
            </div>
            <div className={styles.description}>Active cases</div>
          </div>
        </div>

        {/* Case Status */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <h3>Total Cases</h3>
            <FiPieChart className={styles.icon} />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.largeValue}>{totalCases}</div>
            <div className={styles.statusBreakdown}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Assigned:</span>
                <span className={styles.statusValue}>{assignedPercent}%</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Resolved:</span>
                <span className={styles.statusValue}>{resolvedPercent}%</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Pending:</span>
                <span className={styles.statusValue}>{pendingPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className={styles.chartsGrid}>
        {/* Pie Chart - Case Distribution */}
        <div className={styles.chartCard}>
          <h3>Case Distribution</h3>
          <div className={styles.pieChart}>
            <div className={styles.legendItem}>
              <div className={styles.dot} style={{ backgroundColor: "#2196F3" }}></div>
              <span>Assigned: {statistics.totalAssignedComplaints || 0}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.dot} style={{ backgroundColor: "#4CAF50" }}></div>
              <span>Resolved: {statistics.resolvedComplaints || 0}</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.dot} style={{ backgroundColor: "#FF9800" }}></div>
              <span>Pending: {statistics.pendingComplaints || 0}</span>
            </div>
          </div>
        </div>

        {/* Bar Chart - Crime Types */}
        <div className={styles.chartCard}>
          <h3>Performance Metrics</h3>
          <div className={styles.barChart}>
            <div className={styles.bar}>
              <div className={styles.barLabel}>Efficiency</div>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(85, 100)}%`,
                    backgroundColor: "#4CAF50",
                  }}
                ></div>
              </div>
              <div className={styles.barValue}>85%</div>
            </div>
            <div className={styles.bar}>
              <div className={styles.barLabel}>Responsiveness</div>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(72, 100)}%`,
                    backgroundColor: "#2196F3",
                  }}
                ></div>
              </div>
              <div className={styles.barValue}>72%</div>
            </div>
            <div className={styles.bar}>
              <div className={styles.barLabel}>Accuracy</div>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(90, 100)}%`,
                    backgroundColor: "#FF9800",
                  }}
                ></div>
              </div>
              <div className={styles.barValue}>90%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className={styles.trendCard}>
        <h3>30-Day Resolution Trend</h3>
        <div className={styles.trendChart}>
          {trendData.map((data, idx) => (
            <div key={idx} className={styles.trendBar}>
              <div
                className={styles.trendValue}
                style={{ height: `${(data.value / 10) * 100}%` }}
                title={`${data.date}: ${data.value} cases`}
              ></div>
              <div className={styles.trendDate}>{data.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock trend data
function generateTrendData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.floor(Math.random() * 10) + 2,
    });
  }
  return data;
}

export default StatisticsCharts;
