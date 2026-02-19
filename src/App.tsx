import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import AllProviders from '@/providers'
import Header from '@/components/header'
import FormBuilder from '@/screens/form-builder'

function PlaygroundLayout() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-250.5px)] px-5 lg:px-0">
        <FormBuilder />
      </div>
    </>
  )
}

export default function App() {
  return (
    <AllProviders>
      <Toaster />
      <main className="min-h-[70vh]">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/playground" replace />} />
            <Route path="/playground" element={<PlaygroundLayout />} />
          </Routes>
        </BrowserRouter>
      </main>
    </AllProviders>
  )
}
