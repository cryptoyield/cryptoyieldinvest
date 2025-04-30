import React from 'react';
import { FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

function Legal() {
  return (
    <div className="py-24">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Terms of Service */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <FaShieldAlt className="w-8 h-8 text-primary-600 dark:text-primary-500 mr-3" />
              <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
                  <p>
                    By accessing and using CryptoYield's investment platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. The platform operates exclusively on the Arbitrum One network, and users must ensure they are using the correct network for all transactions.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Investment Risks</h2>
                  <p>
                    All investments carry risk, and past performance is not indicative of future results. Users should carefully consider their investment objectives and risks before investing. The platform does not guarantee any returns on investment.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maintain the security of your wallet and private keys</li>
                    <li>Ensure transactions are conducted on the Arbitrum One network</li>
                    <li>Provide accurate and up-to-date information</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Report any unauthorized access or security breaches</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Platform Rules</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All transactions must be conducted on the Arbitrum One network</li>
                    <li>Minimum investment amounts must be respected</li>
                    <li>Investments are locked for the duration of the chosen plan</li>
                    <li>Early withdrawals are not permitted</li>
                    <li>Users must complete KYC verification when required</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Fees and Charges</h2>
                  <p>
                    Users are responsible for all transaction fees (gas fees) on the Arbitrum One network. The platform does not charge additional fees for investments or withdrawals. Gas fees on Arbitrum One are typically lower than on the Ethereum mainnet.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Network Requirements</h2>
                  <p>
                    The platform exclusively operates on the Arbitrum One network. Users must:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Configure their wallet to use the Arbitrum One network</li>
                    <li>Hold sufficient ETH on Arbitrum One for gas fees</li>
                    <li>Use USDT tokens that are native to the Arbitrum One network</li>
                    <li>Bridge assets to Arbitrum One if necessary</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
                  <p>
                    We reserve the right to terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including breach of the Terms.
                  </p>
                </section>
              </div>
            </div>
          </section>

          {/* Risk Disclaimer */}
          <section className="bg-warning-50 dark:bg-warning-900/20 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <FaExclamationTriangle className="w-8 h-8 text-warning-600 dark:text-warning-500 mr-3" />
              <h2 className="text-2xl font-bold text-warning-800 dark:text-warning-200">Risk Disclaimer</h2>
            </div>

            <div className="space-y-4 text-warning-800 dark:text-warning-200">
              <p className="font-semibold">
                IMPORTANT: Please read this disclaimer carefully before using CryptoYield's investment platform.
              </p>

              <div className="space-y-4">
                <section>
                  <h3 className="font-semibold mb-2">Network Specification</h3>
                  <p>
                    All transactions on CryptoYield occur exclusively on the Arbitrum One network. Users must ensure they are properly configured to use this network and understand the implications of cross-chain transactions if bridging assets from other networks.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Investment Risks</h3>
                  <p>
                    Cryptocurrency investments involve substantial risk and are not suitable for all investors. The value of investments can go down as well as up, and investors may lose all or a substantial portion of their investment.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">No Guaranteed Returns</h3>
                  <p>
                    Past performance is not indicative of future results. Any rates of return shown on the platform are projections and are not guaranteed. Actual returns may vary significantly.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Technical Risks</h3>
                  <p>
                    Smart contract technology and the Arbitrum One network are relatively new and may contain bugs or vulnerabilities. Users should be aware of the technical risks associated with blockchain technology and layer 2 solutions.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Regulatory Compliance</h3>
                  <p>
                    Users are responsible for ensuring their use of the platform complies with all applicable laws and regulations in their jurisdiction. The platform may not be available in all jurisdictions.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">Security</h3>
                  <p>
                    While we implement strong security measures, no system is completely secure. Users are responsible for maintaining the security of their wallets and private keys, and ensuring they are interacting with the correct network (Arbitrum One) for all transactions.
                  </p>
                </section>

                <div className="mt-6 p-4 bg-warning-100 dark:bg-warning-900/40 rounded-lg">
                  <p className="font-bold text-warning-900 dark:text-warning-100">
                    By using CryptoYield's platform, you acknowledge that you have read, understood, and agree to accept all risks associated with cryptocurrency investments and the use of the Arbitrum One network.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Legal;