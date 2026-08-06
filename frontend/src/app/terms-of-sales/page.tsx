import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfSalesPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 selection:bg-[#3a081a] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-48 md:pt-56 pb-24 px-6">
        <div className="container mx-auto max-w-4xl bg-white p-10 md:p-16 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Terms of Sales
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              These Terms of Sales ("Terms") govern the purchase of floral arrangements, botanical products, and related services from AMP Ceylon ("we," "us," or "our"). By placing an order with us, you ("Customer" or "you") agree to be bound by these Terms.
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">1. Orders and Acceptance</h2>
              <p>
                All orders are subject to acceptance and availability. Once you place an order, you will receive an acknowledgment email confirming receipt of your order. This email is only an acknowledgment and will not constitute acceptance of your order. A contract between us will not be formed until we send you confirmation by email that the goods which you ordered have been dispatched to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">2. Pricing and Payment</h2>
              <p>
                All prices are stated on our website and are subject to change without notice. We make every effort to ensure prices are accurate; however, if an error is found, we will inform you as soon as possible and offer you the option of reconfirming your order at the correct price or cancelling it. Payment must be received in full before orders are processed and dispatched.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">3. Products and Substitutions</h2>
              <p>
                Because our floral arrangements and botanicals are natural, perishable products, variations in color, size, and appearance may occur. In the event of supply difficulties, we reserve the right to substitute flowers or foliage with equal or greater value and quality, ensuring the overall aesthetic of the arrangement is preserved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">4. Delivery and Export</h2>
              <p>
                As an export company, we handle shipments to various international destinations. Delivery dates are estimates only. We are not liable for delays caused by customs, carriers, or unforeseeable events. It is the Customer's responsibility to provide accurate delivery information and ensure that the importation of our botanical products complies with their local regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">5. Cancellations and Returns</h2>
              <p>
                Due to the perishable nature of our products, orders cannot be cancelled once they have been processed or dispatched. We do not accept returns on fresh floral items. If your order arrives damaged or fails to meet our quality standards, please contact our customer service team within 24 hours of delivery with photographic evidence, and we will assess the situation for a potential replacement or refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">6. Limitation of Liability</h2>
              <p>
                AMP Ceylon shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services, including but not limited to damages for loss of profits, goodwill, or data. Our maximum liability to you for any breach of these Terms shall be limited to the value of the goods ordered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">7. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#3a081a]">8. Contact Us</h2>
              <p>
                If you have any questions or concerns regarding these Terms of Sales, please reach out to us at udeshjv.ampsl@gmail.com or via our Contact page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
