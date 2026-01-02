export default function Footer() {
  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Powered by <span className="font-semibold text-primary-600">J-erif</span> {new Date().getFullYear()}
          </p>
          <div className="flex space-x-6">
            <a
              href="/privacy"
              className="text-sm text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/help"
              className="text-sm text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
