import React from 'react';
import Footer from '../components/Footer';

const Contact = () => {
    return (
        <div className="contact-container">
            <h1>Contact Information</h1>
            <p>For any inquiries or assistance, please feel free to contact us using the information provided below:</p>
            <ul>
                <li><strong>Telephone:</strong> 0532041856</li>
                <li><strong>Mobile:</strong> 0720119620</li>
                <li><strong>Email:</strong> pavesvetagro@yahoo.com</li>
                <li><strong>Address:</strong> P.O Box 434-30600</li>
            </ul>
            <Footer/>
        </div>
       
    );
}

export default Contact;
