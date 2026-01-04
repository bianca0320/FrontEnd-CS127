import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <h1>Loan Tracker</h1>
          </Link>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/payments" 
                className={isActive('/payments') ? 'active' : ''}
              >
                All Payments
              </Link>
            </li>
            <li>
              <Link 
                to="/people" 
                className={isActive('/people') ? 'active' : ''}
              >
                People & Groups
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout

