import { Routes, Route } from 'react-router-dom'

function FAQ()      { return <div className="p-8"><h2 className="text-2xl font-black">FAQ</h2></div> }
function Contact()  { return <div className="p-8"><h2 className="text-2xl font-black">Contact Us</h2></div> }
function Returns()  { return <div className="p-8"><h2 className="text-2xl font-black">Returns</h2></div> }
function TrackOrder() { return <div className="p-8"><h2 className="text-2xl font-black">Track Order</h2></div> }

export default function SupportPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-black mb-6">Support</h1>
      <Routes>
        <Route index         element={<FAQ />} />
        <Route path="faq"    element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="returns" element={<Returns />} />
        <Route path="track"  element={<TrackOrder />} />
      </Routes>
    </div>
  )
}
