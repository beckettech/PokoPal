import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - PokoPal",
  description: "Privacy policy for the PokoPal app.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-600 to-purple-700 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: March 27, 2026</p>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              <strong>Account Information:</strong> When you create an account, we collect your email address,
              username, and password. Your password is stored securely and never shared.
            </p>
            <p>
              <strong>Usage Data:</strong> We collect anonymous usage data including pages visited, features used,
              and chat queries to improve the app. This data cannot be used to identify you personally.
            </p>
            <p>
              <strong>Device Information:</strong> We collect basic device information (device type, OS version)
              for debugging and performance optimization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To provide and maintain the PokoPal app</li>
              <li>To process your account and provide customer support</li>
              <li>To improve the app through anonymous usage analytics</li>
              <li>To send you important updates about the app (rarely, and only if necessary)</li>
              <li>To detect and prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">3. Data Sharing</h2>
            <p>
              We do <strong>not</strong> sell, trade, or rent your personal information to third parties.
              We may share anonymized, aggregated data for analytics purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">4. Third-Party Services</h2>
            <p>
              <strong>AI Chat:</strong> Chat queries are sent to OpenRouter to generate responses.
              Queries and responses are not stored by us beyond your current session.
            </p>
            <p>
              <strong>Advertising:</strong> We use Google AdMob to display ads. AdMob may collect device
              identifiers for ad targeting. You can opt out of personalized ads in your device settings.
            </p>
            <p>
              <strong>Payments:</strong> Coin purchases are processed through RevenueCat. We do not store
              your payment information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">5. Data Storage</h2>
            <p>
              Your account data is stored locally on your device using secure browser storage.
              We do not maintain a central database of user accounts. If you delete the app or clear
              your browser data, your account information will be permanently lost.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">6. Children's Privacy</h2>
            <p>
              This app is rated 4+ and is suitable for all ages. We do not knowingly collect personal
              information from children under 13. If you believe we have collected information from a
              child under 13, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of personalized advertising</li>
              <li>Report issues or request support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. Changes will be posted on this page
              with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">9. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at:<br />
              📧 <a href="mailto:becketthoefling@gmail.com" className="text-purple-600 underline">becketthoefling@gmail.com</a><br />
              🌐 <a href="https://pokopal.com" className="text-purple-600 underline">pokopal.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
