import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Homepage from './pages/Homepage'
import AllPaymentsRecord from './pages/AllPaymentsRecord'
import PeopleAndGroups from './pages/PeopleAndGroups'
import EntryDetails from './pages/EntryDetails'
import './App.css'

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/payments" element={<AllPaymentsRecord />} />
            <Route path="/people" element={<PeopleAndGroups />} />
            <Route path="/entry/:id" element={<EntryDetails />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  )
}

export default App

