import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l from-[#610C9F] to-[#940B92] text-white flex flex-col">
        {/* Hero Section */}
        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-52 pt-60 bg-transparent">
          <div className="relative z-10">
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              style={{
                fontFamily: "Cinzel, Quattrocento, Ultine Extended Demi",
              }}
            >
              Connect & Learn Together
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Master new languages, meet amazing people, and make friends
              effortlessly.
            </p>
            <button
              className="bg-white text-[#fa546b] font-semibold py-3 px-10 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/chat")}
            >
              Start Chatting
            </button>
          </div>

          <div className="absolute bottom-0 left-0 w-full pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="w-full h-auto"
              style={{ marginBottom: "-1px" }}
            >
              <path
                d="M0,288L30,277.3C60,267,120,245,180,229.3C240,213,300,203,360,218.7C420,235,480,277,540,288C600,299,660,277,720,234.7C780,192,840,128,900,112C960,96,1020,128,1080,138.7C1140,149,1200,139,1260,138.7C1320,139,1380,149,1410,154.7L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
                fill="#FFFFFF"
                fillOpacity="4.5"
              ></path>
            </svg>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-24 px-6 md:px-12 lg:px-24 text-gray-800">
          <h2
            className="text-4xl font-bold text-center mb-10"
            style={{ fontFamily: "Cinzel, Quattrocento, Ultine Extended Demi" }}
          >
            Why Choose Varta?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#fa546b] text-white rounded-full p-5 mb-4">
                <i className="fas fa-language text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">Language Practice</h3>
              <p>
                Connect with people who are learning the same language and
                practice together.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#d53b84] text-white rounded-full p-5 mb-4">
                <i className="fas fa-video text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">Video Chat</h3>
              <p>
                Enjoy high-quality video chats to enhance communication skills.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#f1633d] text-white rounded-full p-5 mb-4">
                <i className="fas fa-globe text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold mb-2">Global Community</h3>
              <p>
                Meet people from all over the world and explore diverse cultures
                and make friends.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="relative text-black bg-white pt-28 pb-12 px-6 md:px-12 lg:px-24">
          <h2
            className="text-4xl font-bold text-center mb-10"
            style={{ fontFamily: "Cinzel, Quattrocento, Ultine Extended Demi" }}
          >
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
            {[
              {
                text: "“Varta has been an amazing tool to practice Spanish. I’ve made so many friends!”",
                author: "Sai",
                color: "text-[#fa546b]",
              },
              {
                text: "“The video chat quality is excellent, and the platform is easy to use.”",
                author: "Satyam T.",
                color: "text-[#d53b84]",
              },
              {
                text: "“A perfect way to meet people and improve language skills.”",
                author: "Abhishek M.",
                color: "text-[#f1633d]",
              },
            ].map((feedback, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#fa546b] opacity-5 rounded-lg"></div>
                <p className="italic mb-4">{feedback.text}</p>
                <h3 className={`text-lg font-semibold ${feedback.color}`}>
                  - {feedback.author}
                </h3>
                <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full animate-pulse opacity-75"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 bg-white rounded-full animate-bounce opacity-50"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border-none w-full p-0 m-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-auto"
            style={{ marginBottom: "-1rem" }}
          >
            <path
              d="M0,288L30,277.3C60,267,120,245,180,229.3C240,213,300,203,360,218.7C420,235,480,277,540,288C600,299,660,277,720,234.7C780,192,840,128,900,112C960,96,1020,128,1080,138.7C1140,149,1200,139,1260,138.7C1320,139,1380,149,1410,154.7L1440,160L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
              fill="#940B92"
            ></path>
          </svg>

          <div className="bg-[#940B92] border-none text-white py-12 text-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{
                fontFamily: "Cinzel, Quattrocento, Ultine Extended Demi",
              }}
            >
              Ready to Connect?
            </h2>
            <p className="text-lg mb-8">
              Join a global community of language learners and start your
              journey today.
            </p>
            <button
              className="bg-white text-[#d53b84] font-semibold py-3 px-10 rounded-lg hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/chat")}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Varta. All rights reserved.</p>
            <p>
              Built with ❤️ to bring people closer through language and culture.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
