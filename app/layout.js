import { Noto_Sans } from 'next/font/google'

const noto = Noto_Sans ({ subsets: ['latin'], weight: ["500"],})

export const metadata = {
  title: 'Test ChatGPT',
  description: 'Test ChatGPT',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={noto.className}>{children}</body>
    </html>
  )
}