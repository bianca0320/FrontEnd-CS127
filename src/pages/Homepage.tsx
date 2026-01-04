import { Link } from 'react-router-dom'
import './Homepage.css'

function Homepage() {
  return (
    <div className="homepage">
      <div className="hero">
        <h1>Welcome to Loan Tracking System</h1>
        <p>Manage your loans, expenses, and payments all in one place</p>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <Link to="/payments" className="action-card">
            <h3>View All Payments</h3>
            <p>See all your financial records</p>
          </Link>
          <Link to="/people" className="action-card">
            <h3>Manage Contacts</h3>
            <p>View and manage people and groups</p>
          </Link>
        </div>
      </div>

      <div className="features">
        <h2>Features</h2>
        <ul>
          <li>Track loans and expenses</li>
          <li>Manage installment payments</li>
          <li>Handle group expenses</li>
          <li>Record partial payments</li>
          <li>Monitor payment status</li>
        </ul>
      </div>
    </div>
  )
}

export default Homepage

