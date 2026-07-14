export default async function handler(req, res) {
  // Sirf POST requests ko allow karein
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // Frontend se aane wala data receive karein
    const { fullName, email, phone, organization, purpose, message } = req.body;

    // Yahan aap is data ko apne Database (MongoDB, Firebase) mein save kar sakte hain
    // Ya phir kisi service (Nodemailer, Resend) ke zariye email send kar sakte hain.
    console.log("Received Form Data:", { fullName, email, phone, organization, purpose, message });

    // Frontend ko wapas success message bhej dein
    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully!' 
    });
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}