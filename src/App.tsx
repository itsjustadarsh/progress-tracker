import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSubjects } from './hooks/useSubjects'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import SubjectPage from './pages/SubjectPage'
import SchedulePage from './pages/SchedulePage'

export default function App() {
  const subjectsApi = useSubjects()

  return (
    <BrowserRouter>
      <NavBar subjects={subjectsApi.subjects} onImport={subjectsApi.importSubjects} />
      <Routes>
        <Route path="/" element={<HomePage {...subjectsApi} />} />
        <Route path="/subject/:id" element={<SubjectPage {...subjectsApi} />} />
        <Route path="/schedule" element={<SchedulePage subjects={subjectsApi.subjects} />} />
      </Routes>
    </BrowserRouter>
  )
}
