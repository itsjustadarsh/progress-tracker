import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useSubjects } from './hooks/useSubjects'
import HomePage from './pages/HomePage'
import SubjectPage from './pages/SubjectPage'

export default function App() {
  const subjectsApi = useSubjects()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage {...subjectsApi} />} />
        <Route path="/subject/:id" element={<SubjectPage {...subjectsApi} />} />
      </Routes>
    </BrowserRouter>
  )
}
