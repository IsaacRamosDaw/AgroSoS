import { CContainer } from "@coreui/react";
import { Link } from "react-router-dom";
import farmbotIcon from "../assets/img/farmbot_icon.png";
import tractorIcon from "../assets/img/tractor_icon.png";

function DeviceSelection() {
  return (
    <div style={{ padding: "4rem 2rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "3rem", color: "#333", textDecoration: "underline", textDecorationThickness: "1px", textDecorationColor: "lightgray" }}>Select Device</h1>

      <CContainer className="d-flex justify-content-center gap-5">
        <Link to="/farmbot" className="text-decoration-none text-dark text-center d-flex flex-column align-items-center">
          <img src={farmbotIcon} alt="FARMBOT" style={{ width: "200px", border: "5px solid #4CAF50", borderRadius: "10%", padding: "1rem" }}></img>
          <span style={{ paddingTop: "0.5em", fontSize: "1rem", fontWeight: "bold" }}>FarmBOT</span>
        </Link>
        <Link to="/tractor" className="text-decoration-none text-dark text-center d-flex flex-column align-items-center">
          <img src={tractorIcon} alt="Tractor" style={{ width: "200px", border: "5px solid #FFEB3B", borderRadius: "10%", padding: "1rem" }}></img>
          <span style={{ paddingTop: "0.5em", fontSize: "1rem", fontWeight: "bold" }}>Tractor</span>
        </Link>
      </CContainer>
    </div>
  );
}

export default DeviceSelection;
