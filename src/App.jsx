import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import SoilLookup from './pages/SoilLookup/SoilLookup'
import Farms from './pages/Farms/Farms'
import Assessments from './pages/Assessments/Assessments'
import AssessmentDetail from './pages/AssessmentDetail/AssessmentDetail'
import GlobalNContext from './pages/GlobalNContext/GlobalNContext'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="soil" element={<SoilLookup />} />
          <Route path="farms" element={<Farms />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assessments/:id" element={<AssessmentDetail />} />
          <Route path="global-n" element={<GlobalNContext />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
