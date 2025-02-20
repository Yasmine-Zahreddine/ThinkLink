import "./header.css";
import Card from "../../components/card/Card";

function Header() {
  return (
    <div className="header">
        <div className="header-card">
        <Card title="Learn And Grow" content="Equip yourself with the skills you need for both present and future success. Begin your adventure with us." />
        </div>
    </div>
  )
}

export default Header