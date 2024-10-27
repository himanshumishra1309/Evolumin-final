Medicare - University Hostel Healthcare Platform

Project Overview:

Medicare is a university hostel healthcare platform designed to address the essential healthcare needs of students and enable streamlined communication with healthcare providers. Built for a hackathon challenge, this platform provides real-time ambulance tracking, student-doctor interaction, remote medical consultations, easy access to medicine, and real-time monitoring of health services. It ensures accessibility for users with impairments and enhances the healthcare experience within a hostel setting.

Features

Student Portal
1.	Doctor Appointment Booking: Students can book appointments with doctors available on the platform.
2.	Real-time Chat with Doctors: Students can chat with doctors to discuss symptoms, seek advice, and receive online prescriptions.
3.	Medicine Shopping: Direct purchase and prescription-based ordering of medicines.
4.	Monthly Health Reports: Students can access their health reports updated by doctors.
5.	Alerts & Notifications: View alerts from doctors for essential health updates and announcements.

Doctor Portal
1.	Appointment Management: Doctors can view and manage appointments scheduled by students.
2.	Access to Student Medical History: Doctors have access to the student's medical history, including monthly health reports.
3.	Online Prescriptions: Doctors can prescribe medications within the chat and update availability.
4.	Availability Scheduling: Doctors can dynamically set and update their availability on the platform.
5.	Alerts Management: Doctors can send, edit, or delete health alerts for students.

Ambulance Tracking
1.	Web and Mobile Tracking: Provides live ambulance tracking on the web and through a mobile app for enhanced accuracy.

Technologies Used
•	Frontend: React.js, Tailwind CSS
•	Backend: Node.js, Express.js, MongoDB, Mongoose
•	Mobile App: React Native (for ambulance tracking)
•	Real-time Communication: WebSocket (for chat functionality)
•	Authentication: JWT (JSON Web Token)
•	Styling: Tailwind CSS, ShadCN components

Project Setup
To get the project up and running locally, follow these steps:

1.	Clone the repository:
bash
Copy code
git clone “paste http url of our repo”

1] Setup Frontend (VS CODE):
cd frontend
npm install
npm run dev

2] Setup Backend (VS CODE):

--> First Folder
cd backend-js
npm install
npm run dev

--> Chat Server
cd “backend(chat)”
npm install
npm start

For student frontend login with: 
Email: himanshu@gmail.com
Password: 1234

For doctor frontend login with:
Email: maheshjoshi@gmail.com
Password: 1234

2. Environment Variables: All the env files are provided publically

API References
•	Google Maps API: Used for ambulance tracking and route display. Google Maps API Documentation

API Keys
The API Keys are mentioned in the application itself

Demo Video
Watch the demo video to see Medicare in action: YouTube Link

Future Scope
Potential enhancements include:
1.	Integration with IoT Devices: Real-time monitoring using wearable health devices for automated data entry.
2.	Advanced Analytics: Using AI/ML to analyze health trends and give preventive healthcare suggestions.
3.	Appointment Reminders: Automated reminders for students before their scheduled appointments.
4.	Multi-Language Support: Improve accessibility with support for additional languages.
5.	Telemedicine: Implement video consultations for remote diagnosis and better interaction.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your updates.

