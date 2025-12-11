import { CContainer } from "@coreui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import farmbotIcon from "../assets/img/farmbot_icon.png";
import tractorIcon from "../assets/img/tractor_icon.png";
import { getAllDevices } from "../services/device.services";

function DeviceSelection() {
  const [farmBots, setFarmBots] = useState([]);
  const [tractors, setTractors] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await getAllDevices();
        setFarmBots(devices.filter(device => device.type === 'FarmBot'));
        setTractors(devices.filter(device => device.type === 'Tractor'));
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);
  return (
    <div style={{backgroundColor: "#f9f9f9"}}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "800", marginBottom: "4rem", color: "#2c3e50", letterSpacing: "-1px" }}>
        Select Your Device
      </h2>

      <CContainer className="d-flex justify-content-center align-items-stretch" style={{ gap: "4rem", flexWrap: "wrap" }}>
        
        {/* FarmBot Section */}
        <div style={{ 
            flex: "1", 
            minWidth: "300px", 
            maxWidth: "500px",
            backgroundColor: "#fff", 
            borderRadius: "20px", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)", 
            padding: "2rem",
            transition: "transform 0.3s ease",
            border: "1px solid rgba(76, 175, 80, 0.1)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <Link to="/farmbot" className="text-decoration-none d-flex flex-column align-items-center mb-4">
            <div style={{ 
              padding: "1rem", 
              borderRadius: "50%", 
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              marginBottom: "1.5rem"
            }}>
              <img src={farmbotIcon} alt="FARMBOT" style={{ width: "120px", height: "120px", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2c3e50" }}>FarmBOT</span>
            <span style={{ color: "#7f8c8d", marginTop: "0.5rem" }}>Automated Farming</span>
          </Link>
          
          <div style={{ width: "100%", borderTop: "2px dashed #f0f0f0", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#95a5a6", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", textAlign: "center" }}>
              Available Units
            </h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {farmBots.length > 0 ? farmBots.map(device => (
                <li key={device.id}>
                  <Link to={`/farmbot/${device.id}`} 
                    className="d-block text-decoration-none"
                    style={{ 
                      padding: "1rem", 
                      backgroundColor: "#f8f9fa", 
                      borderRadius: "12px", 
                      color: "#4CAF50", 
                      fontWeight: "600",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                      border: "1px solid transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#4CAF50";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.color = "#4CAF50";
                    }}
                  >
                    {device.name}
                  </Link>
                </li>
              )) : (
                <li style={{ textAlign: "center", color: "#bdc3c7", fontStyle: "italic" }}>No FarmBots found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Divider for Desktop */}
         <div style={{ width: "2px", backgroundColor: "#f0f0f0", borderRadius: "2px" }} className="d-none d-md-block"></div>

        {/* Tractor Section */}
        <div style={{ 
            flex: "1", 
            minWidth: "300px", 
            maxWidth: "500px",
            backgroundColor: "#fff", 
            borderRadius: "20px", 
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)", 
            padding: "2rem",
            transition: "transform 0.3s ease",
            border: "1px solid rgba(255, 235, 59, 0.2)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          <Link to="/tractor" className="text-decoration-none d-flex flex-column align-items-center mb-4">
             <div style={{ 
              padding: "1rem", 
              borderRadius: "50%", 
              backgroundColor: "rgba(255, 235, 59, 0.1)",
              marginBottom: "1.5rem"
            }}>
              <img src={tractorIcon} alt="Tractor" style={{ width: "120px", height: "120px", objectFit: "contain" }} />
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#2c3e50" }}>Tractor</span>
            <span style={{ color: "#7f8c8d", marginTop: "0.5rem" }}>Heavy Machinery</span>
          </Link>
          
          <div style={{ width: "100%", borderTop: "2px dashed #f0f0f0", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#95a5a6", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1rem", textAlign: "center" }}>
              Available Units
            </h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {tractors.length > 0 ? tractors.map(device => (
                <li key={device.id}>
                  <Link to={`/tractor/${device.id}`} 
                     className="d-block text-decoration-none"
                     style={{ 
                       padding: "1rem", 
                       backgroundColor: "#f8f9fa", 
                       borderRadius: "12px", 
                       color: "#fbc02d", // Darker yellow for text visibility
                       fontWeight: "600",
                       textAlign: "center",
                       transition: "all 0.2s ease",
                       border: "1px solid transparent"
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.backgroundColor = "#ffeb3b";
                       e.currentTarget.style.color = "#333";
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.backgroundColor = "#f8f9fa";
                       e.currentTarget.style.color = "#fbc02d";
                     }}
                  >
                    {device.name}
                  </Link>
                </li>
              )) : (
                <li style={{ textAlign: "center", color: "#bdc3c7", fontStyle: "italic" }}>No Tractors found</li>
              )}
            </ul>
          </div>
        </div>
        
      </CContainer>
    </div>
  );
}

export default DeviceSelection;
