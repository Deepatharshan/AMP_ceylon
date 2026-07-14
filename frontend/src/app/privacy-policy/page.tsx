import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-900 selection:bg-[#3a081a] selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-48 md:pt-56 pb-24 px-6">
        <div className="container mx-auto max-w-4xl bg-white p-10 md:p-16 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              We are committed to safeguarding the personal information you share with us when browsing our website or placing an order.
            </p>

            <p>
              We collect only the information necessary to process your purchases, personalise your experience, and provide exceptional customer service. This includes details like your name, contact information, delivery address, and payment preferences.
            </p>

            <p>
              Your data is stored securely and never shared with third parties for marketing purposes.
            </p>

            <p>
              We may use trusted service providers to help fulfil your order, but only with strict confidentiality agreements in place.
            </p>

            <p>
              You are in control of your information. To request access, correction, or deletion of your personal data, please send us an email request. Please note that data deletion cannot be done automatically on the website. Once our administration team processes your email request and deletes your personal details from our database, you will receive an official approval report confirming that your data has been successfully removed.
            </p>

            <p>
              By using our website, you consent to our privacy practices as outlined. We may update this policy from time to time to reflect changes in our services or legal requirements.
            </p>

            <div className="mt-10 p-6 bg-[#f4e6ea] rounded-lg border border-[#8a385a]/20">
              <h2 className="text-xl font-bold mb-3 text-[#3a081a]" style={{ fontFamily: 'var(--font-playfair)' }}>
                Contact Us
              </h2>
              <p>
                For any questions or requests regarding your personal data, please contact us at <a href="mailto:info@amp-flora.com" className="font-semibold text-[#8a385a] hover:underline">info@amp-flora.com</a> or call <a href="tel:+94771234567" className="font-semibold text-[#8a385a] hover:underline">+94 77 123 4567</a>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
