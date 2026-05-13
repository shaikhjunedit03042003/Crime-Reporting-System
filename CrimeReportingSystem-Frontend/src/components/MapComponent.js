import React, { useEffect, useRef } from "react";
import styles from "../styles/MapComponent.module.css";

/**
 * Interactive Map Component
 * Displays complaints with clickable markers
 * Uses Leaflet library (make sure to install: npm install leaflet)
 */
const MapComponent = ({ complaints, onSelectMarker }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map (simplified version - full implementation would use Leaflet)
    // For now, showing a grid layout of complaint locations
    renderComplaintGrid();
  }, [complaints]);

  const renderComplaintGrid = () => {
    if (!mapContainer.current) return;

    mapContainer.current.innerHTML = "";
    const width = mapContainer.current.clientWidth;
    const height = mapContainer.current.clientHeight;

    // Create grid to display complaints
    const gridContainer = document.createElement("div");
    gridContainer.className = styles.gridContainer;

    if (!complaints || complaints.length === 0) {
      gridContainer.innerHTML = "<p>No complaints to display on map</p>";
      mapContainer.current.appendChild(gridContainer);
      return;
    }

    // Group complaints by location
    const locationMap = {};
    complaints.forEach((complaint) => {
      const location = complaint.incidentLocation || "Unknown";
      if (!locationMap[location]) {
        locationMap[location] = [];
      }
      locationMap[location].push(complaint);
    });

    // Create markers
    Object.entries(locationMap).forEach(([location, complaintList], index) => {
      const marker = document.createElement("div");
      marker.className = styles.marker;
      
      const priority = complaintList[0].priority || "MEDIUM";
      const priorityClass = `priority-${priority.toLowerCase()}`;
      marker.classList.add(priorityClass);

      marker.innerHTML = `
        <div class="${styles.markerContent}">
          <div class="${styles.markerCount}">
            ${complaintList.length} ${complaintList.length === 1 ? "case" : "cases"}
          </div>
          <div class="${styles.markerLocation}">${location.substring(0, 15)}</div>
        </div>
      `;

      marker.style.left = `${Math.random() * 80 + 10}%`;
      marker.style.top = `${Math.random() * 80 + 10}%`;

      marker.addEventListener("click", () => {
        if (complaintList.length === 1) {
          onSelectMarker(complaintList[0]);
        } else {
          // Show popup with all complaints at this location
          showLocationPopup(location, complaintList);
        }
      });

      gridContainer.appendChild(marker);
    });

    // Add legend
    const legend = document.createElement("div");
    legend.className = styles.legend;
    legend.innerHTML = `
      <div class="${styles.legendTitle}">Priority Levels</div>
      <div class="${styles.legendItem}">
        <span class="${styles.legendColor}" style="background-color: #FF4444;"></span> High
      </div>
      <div class="${styles.legendItem}">
        <span class="${styles.legendColor}" style="background-color: #FFA500;"></span> Medium
      </div>
      <div class="${styles.legendItem}">
        <span class="${styles.legendColor}" style="background-color: #4CAF50;"></span> Low
      </div>
    `;
    gridContainer.appendChild(legend);

    mapContainer.current.appendChild(gridContainer);
  };

  const showLocationPopup = (location, complaintList) => {
    // Create and show popup with scroll
    const popup = document.createElement("div");
    popup.className = styles.popup;
    popup.innerHTML = `
      <div class="${styles.popupContent}">
        <div class="${styles.popupHeader}">
          <h3>${location}</h3>
          <button class="${styles.closeBtn}">✕</button>
        </div>
        <div class="${styles.popupList}">
          ${complaintList
            .map(
              (c) => `
            <div class="${styles.popupItem}">
              <div class="${styles.complaintId}">${c.complaintId}</div>
              <div class="${styles.crimeType}">${c.crimeType}</div>
              <button class="${styles.selectBtn}" data-id="${c.id}">Select</button>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `;

    mapContainer.current.appendChild(popup);

    // Add event listeners
    popup.querySelector(`.${styles.closeBtn}`).addEventListener("click", () => {
      popup.remove();
    });

    popup.querySelectorAll(`.${styles.selectBtn}`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const complaintId = btn.getAttribute("data-id");
        const selected = complaintList.find((c) => c.id === parseInt(complaintId));
        if (selected) {
          onSelectMarker(selected);
          popup.remove();
        }
      });
    });
  };

  return <div className={styles.mapContainer} ref={mapContainer} />;
};

export default MapComponent;
