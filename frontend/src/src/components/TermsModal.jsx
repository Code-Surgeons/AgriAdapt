// TermsModal.js
import React from "react";

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Function to handle clicks outside the modal content
  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };

  return (
    <div 
    id="modal-background" 
    className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
    onClick={handleOutsideClick}>
      <div id="modal-bg" className="w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>

        <p className="text-sm leading-relaxed">
          <strong>1. Acceptance of Terms</strong><br />
          By accessing and using AgriAdapt, you agree to comply with and be bound by the following terms and conditions, along with any other guidelines or rules applicable to this platform. If you do not agree with these terms, please refrain from using the service.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>2. Description of Services</strong><br />
          AgriAdapt provides agricultural insights powered by AI to help users make informed decisions related to crop selection and farming practices. The insights and recommendations are based on publicly available data, user inputs, and environmental factors.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>3. User Eligibility</strong><br />
          Users must be of legal age in their jurisdiction to use this service. By using AgriAdapt, you represent that you meet these eligibility requirements.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>4. Data Privacy and Security</strong><br />
          <strong>Image Privacy:</strong> Uploaded images are not stored on our servers; they are processed temporarily for analysis and then discarded.<br />
          <strong>Location Access:</strong> Location data is accessed only with your explicit consent. This information is used solely to improve the accuracy of AI-driven recommendations based on local conditions.<br />
          <strong>Data Protection:</strong> We implement reasonable security measures to protect data; however, AgriAdapt cannot guarantee the complete security of data transmitted over the internet.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>5. License and Intellectual Property</strong><br />
          All content, features, and functionalities on AgriAdapt, including design, text, graphics, and software, are the exclusive property of AgriAdapt. Users are granted a limited, non-transferable, and non-exclusive license to access and use the platform’s content for personal, non-commercial purposes.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>6. Usage Guidelines</strong><br />
          Users agree to use AgriAdapt for lawful purposes only and to respect the rights and dignity of others.<br />
          Users must not use the platform to transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.<br />
          Users agree not to tamper with, hack, modify, or reverse engineer any part of the platform.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>7. Disclaimer of Warranties</strong><br />
          AgriAdapt is provided on an "as-is" and "as-available" basis. The company makes no warranties, either express or implied, regarding the accuracy, reliability, or availability of the platform.<br />
          <strong>Agricultural Recommendations:</strong> The insights provided are based on AI predictions and should not be seen as definitive guidance. Users are advised to consult agricultural professionals before making critical decisions.<br />
          <strong>Location and Environmental Data:</strong> Recommendations may vary based on data availability, seasonal factors, and user inputs. AgriAdapt cannot guarantee results or outcomes.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>8. Limitation of Liability</strong><br />
          <strong>General Liability:</strong> Under no circumstances will AgriAdapt be liable for any indirect, incidental, or consequential damages resulting from the use of or inability to use the service.<br />
          <strong>Agricultural and Environmental Decisions:</strong> AgriAdapt is not liable for any decisions users make based on the insights provided. Users assume full responsibility for any agricultural practices or investments made as a result of using the platform.<br />
          <strong>Third-Party Links:</strong> AgriAdapt may contain links to third-party websites or services that are not owned or controlled by the platform. AgriAdapt assumes no responsibility for the content or practices of any third-party sites.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>9. Modifications to the Service</strong><br />
          AgriAdapt reserves the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice. Users are encouraged to check these terms periodically for updates.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>10. Governing Law</strong><br />
          These Terms and Conditions are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
        </p>

        <p className="text-sm leading-relaxed mt-4">
          <strong>11. Contact Information</strong><br />
          For any questions about these Terms and Conditions, please contact us at <a href="mailto:saikatsahana91@gmail.com" className="text-blue-500">saikatsahana91@gmail.com</a> or <a href="mailto:spurthibhat7@gmail.com" className="text-blue-500">spurthibhat7@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsModal;
