// import React from "react";
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
//       {/* Hero Section */}
//       <header className="flex flex-col items-center justify-center text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4">
//           Centralized Code Repository
//         </h1>
//         <p className="max-w-2xl text-lg md:text-xl mb-6">
//           A secure platform to store, manage, and share automation scripts,
//           utilities, and code modules across departments — with AI-powered
//           discovery and collaboration.
//         </p>
//         <div className="space-x-4">
//           <Link
//             to="/login"
//             className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
//           >
//             User Login
//           </Link>
//           <Link
//             to="/admin/login"
//             className="px-6 py-3 bg-transparent border border-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition"
//           >
//             Admin Login
//           </Link>
//         </div>
//       </header>

//       {/* Project Details Section */}
//       <main className="flex-grow px-6 md:px-16 py-12">
//         <h2 className="text-2xl font-bold mb-6 text-center">
//           Why This Project?
//         </h2>
//         <div className="grid md:grid-cols-3 gap-8 text-center">
//           <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
//             <h3 className="text-xl font-semibold mb-3">Centralized Storage</h3>
//             <p>
//               Keep all scripts, utilities, and code modules in one place with
//               proper version control and access rights.
//             </p>
//           </div>
//           <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
//             <h3 className="text-xl font-semibold mb-3">Metadata & Tagging</h3>
//             <p>
//               Easily find and reuse code with rich metadata, tagging, and
//               advanced search filters.
//             </p>
//           </div>
//           <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
//             <h3 className="text-xl font-semibold mb-3">AI Assistance</h3>
//             <p>
//               Use the built-in AI assistant to explain code, suggest
//               optimizations, and guide best practices.
//             </p>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-200 py-6 mt-auto">
//         <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
//           <p className="text-sm">&copy; {new Date().getFullYear()} PNB Code Repository. All rights reserved.</p>
//           <div className="flex space-x-4 mt-4 md:mt-0">
//             <Link to="/login" className="hover:underline">
//               Login
//             </Link>
//             <Link to="/register" className="hover:underline">
//               Register
//             </Link>
//             <Link to="/admin/login" className="hover:underline">
//               Admin
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CR</span>
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CodeRepository
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Register
              </Link>
              <Link 
                to="/admin/login" 
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block text-gray-900">Centralized</span>
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Code Repository
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
            A secure platform to store, manage, and share automation scripts, 
            utilities, and code modules across departments with AI-powered discovery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              User Login
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Code Files" },
              { number: "5K+", label: "Active Users" },
              { number: "98%", label: "Satisfaction" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed for developers, by developers. Experience the future of code management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔒",
                title: "Secure Storage",
                description: "Enterprise-grade security with encrypted storage and role-based access control."
              },
              {
                icon: "🏷️",
                title: "Smart Tagging",
                description: "AI-powered metadata extraction and intelligent tagging for easy discovery."
              },
              {
                icon: "🤖",
                title: "AI Assistant",
                description: "Built-in AI that explains code, suggests optimizations, and guides best practices."
              },
              {
                icon: "🔄",
                title: "Version Control",
                description: "Complete version history with diff viewing and rollback capabilities."
              },
              {
                icon: "👥",
                title: "Collaboration",
                description: "Real-time collaboration features with comments and code reviews."
              },
              {
                icon: "🚀",
                title: "Fast Search",
                description: "Lightning-fast search across millions of lines of code with advanced filters."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Code Management?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            Join thousands of developers who trust our platform to streamline their workflow and boost productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-2xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
            >
              Request Demo
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-indigo-200">
            <span>⭐</span>
            <span>No credit card required • Free 14-day trial</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">CR</span>
                </div>
                <span className="text-xl font-bold text-white">CodeRepository</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for code storage, management, and collaboration.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Demo", "API"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Support", "Community", "Status"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} CodeRepository. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
              <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
