export default function PrivacyPolicy() {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy explains how our application (“we”, “our”, or “us”) 
          handles information when you use Google Sign-In.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <p className="mb-4">
          When you sign in with Google, we collect your basic profile information 
          (such as your name, email address, and profile picture). We also ask for
          consent to view and edit your Google Calendar, in order to push syllabus
          assignment dates to your calendar. We do not collect any other personal 
          data without your consent.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Information</h2>
        <p className="mb-4">
          The information we collect is used only to authenticate your identity 
          and provide access to our application’s features. We do not sell, rent, 
          or share your personal information with third parties.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Data Retention</h2>
        <p className="mb-4">
          We retain your basic profile information only as long as necessary to 
          provide our service. You may request removal of your data at any time.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
        <p className="mb-4">
          Our app uses Google OAuth for authentication. Please refer to Google’s 
          <a 
            href="https://policies.google.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline ml-1"
          >
            Privacy Policy
          </a> 
          for more details on how Google handles your information.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy, 
          please contact us at: <strong>khtcodes@gmail.com</strong>.
        </p>
      </div>
    );
  }
  