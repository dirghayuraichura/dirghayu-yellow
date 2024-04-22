import './/globals.css';
import Navbar from './components/NavigationBar';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}