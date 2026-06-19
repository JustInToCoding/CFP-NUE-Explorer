import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import ValueProposition from './pages/ValueProposition/ValueProposition'
import LogicModel from './pages/LogicModel/LogicModel'
import Foundation from './pages/Foundation/Foundation'
import Roadmap from './pages/Roadmap/Roadmap'
import SoilLookup from './pages/SoilLookup/SoilLookup'
import Farms from './pages/Farms/Farms'
import Assessments from './pages/Assessments/Assessments'
import AssessmentDetail from './pages/AssessmentDetail/AssessmentDetail'
import GlobalNContext from './pages/GlobalNContext/GlobalNContext'
import Settings from './pages/Settings/Settings'

export default function App() {
  const [ready, setReady] = useState(() => !!localStorage.getItem('cfp_token'))

  if (!ready) {
    return <Settings isGate onSave={() => setReady(true)} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="value-proposition" element={<ValueProposition />} />
          <Route path="logic-model" element={<LogicModel />} />
          <Route path="foundation" element={<Foundation />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="soil" element={<SoilLookup />} />
          <Route path="farms" element={<Farms />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="assessments/:id" element={<AssessmentDetail />} />
          <Route path="global-n" element={<GlobalNContext />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
