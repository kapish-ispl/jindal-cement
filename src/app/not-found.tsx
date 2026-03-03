import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Page Not Found</h2>
      <p className="notfound-text">
        Sorry, the page you&apos;re looking for does not exist or has been moved.
      </p>

      <Link href="/" className="notfound-button">
        Go Back Home
      </Link>
    </div>
  );
}
