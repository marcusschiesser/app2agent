import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">App2Agent</h3>
            <p className="text-gray-600 text-sm">
              Transform any enterprise web app with AI agents
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <a
              href="mailto:info@schiesser-it.com"
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
            >
              info@schiesser-it.com
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Schiesser IT LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
