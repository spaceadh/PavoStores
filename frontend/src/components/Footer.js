import React from 'react'
import {  Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
    <div>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row align-items-center">
          <div className="col-3">
    {/* Content in the first column */}
    <div className="footer-top-data d-flex gap-30 align-items-center">
      
      <h1 className="mb-0 text-white">QUICK LINKS</h1>
    </div>
    </div>
        </div>
    </div>
      </footer>
      <footer className="py-4">
      <div className="container-xxl">
        <div className="row">
          <div className="col-4">
          <h4 className="text-white mb-4">Contact Us</h4>
          <div>
            <address className="text-white fs-6">Paves Tower 
            <br/>Kapenguria town<br/> P.O box:434<br/>30600
            </address>
            
            <a href='pavesvetagro@yahoo.com'
            className='mt-4 d-block mb-3 text-white'>
             pavesvetagro@yahoo.com
            </a>
          </div>
          </div>
          <div className="col-3">
          <h4 className="text-white mb-4">Information</h4>
          
            <div className="footer-links d-flex flex-column">
            <Link to="/privacy-policy" className="text-white py-2 mb-1"> Privacy Policy</Link>
            <Link to="/refund-policy" className="text-white py-2 mb-1">Refund Policy</Link>
            <Link to="/shipping-policy"className="text-white py-2 mb-1">Shipping Policy</Link>
            
            
            </div>
          
          </div>
            <div className="col-3">
            <h4 className="text-white mb-4">Account</h4>
            <div className="footer-links d-flex flex-column">
        
            <Link to="/About" className="text-white py-2 mb-1">About Us</Link>
            <Link to="/FAQ" className="text-white py-2 mb-1">Faq</Link>
            <Link to="/Contact"className="text-white py-2 mb-1">Contact</Link>
            </div> 
          
           </div>
           
          
          
         </div> 
      </div>
      </footer>
      <footer className="py-4">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
            <p className="text-center mb-0 text-white">&copy; {new Date().getFullYear()};Paves Vetagro Limited</p>
            </div>
          </div>
        </div>
      </footer>     
    </div>
    </>
  );
};

export default Footer;
