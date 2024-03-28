import React from 'react';
import Footer from '../components/Footer';

const FAQ = () => {
  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <ul>
        <li><strong>What products does Paves Agrovet offer?</strong><br/>Paves Agrovet offers a wide range of agricultural supplies, including animal feed, veterinary medicines, and farming equipment.</li>
        <li><strong>Do you provide delivery services?</strong><br/>Yes, we offer delivery services with a minimum delivery time of 36 hours and a maximum of 5 days.</li>
        <li><strong>How can I contact Paves Agrovet?</strong><br/>You can reach us at the following contact details:<br/>Telephone: 0532041856<br/>Mobile: 0720119620<br/>Email: pavesvetagro@yahoo.com<br/>Address: P.O Box 434-30600</li>
      </ul>
      <Footer/>
    </div>
  );
}

export default FAQ;
