import Header from './header'
import Footer from './footer'
import { Analytics } from '@vercel/analytics/react'

export default function Layout({ children }) {
  return (
    <div className="bg-primary">
      <Header />
      <div className="h-auto">{children}</div>
      <Analytics />
      <Footer />
    </div>
  )
}
