import React from 'react'
import './globals.css'

export const metadata = {
  title: 'ah-admin',
  description: 'admin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head><link rel="stylesheet" href="/static/aws/css/all.css" /></head>
      <body>{children}</body>
    </html>
  )
}
