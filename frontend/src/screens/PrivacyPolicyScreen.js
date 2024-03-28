import React from 'react';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy for Paves Agrovet</h1>
      <p>
        At Paves Agrovet, we are committed to protecting your privacy and ensuring the security of your personal information.
        This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our services.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We may collect personal information such as your name, contact details, and preferences to provide you with our agrovet services.
        Rest assured that we only use this information for the intended purposes and do not share it with third parties without consent.
      </p>
      <h2>How We Use Your Information</h2>
      <p>
        Your information is used to personalize your experience with Paves Agrovet, improve our services, and communicate with you effectively.
        We may also use it for internal record keeping and to comply with legal requirements.
      </p>
      <h2>Security of Your Information</h2>
      <p>
        We implement stringent security measures to protect your data from unauthorized access or disclosure.
        Our systems are regularly monitored and updated to ensure the confidentiality and integrity of your information.
      </p>
      <Footer/>
    </div>
  );
}

export default PrivacyPolicy;
