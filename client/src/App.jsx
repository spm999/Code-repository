// // src/App.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Header from "./components/Layout/Header";
// import Home from "./components/Home";
// import Register from "./components/User/Register";
// import Login from "./components/User/Login";
// import Profile from "./components/User/Profile";
// import AdminLogin from "./components/Admin/AdminLogin";
// import UserManagement from "./components/Admin/UserManagement";
// import CreateCodeFile from "./components/Code/CreateCodeFile";
// import CodeFileList from "./components/Code/CodeFileList";
// import "./index.css";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="flex flex-col min-h-screen">
//           {/* Common Header */}
//           <Header />

//           {/* App Routes */}
//           <main className="flex-grow">
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<Home />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/admin/login" element={<AdminLogin />} />

//               {/* Protected User Routes */}
//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/code"
//                 element={
//                   <ProtectedRoute>
//                     <CodeFileList />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/code/new"
//                 element={
//                   <ProtectedRoute>
//                     <CreateCodeFile />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Admin Routes */}
//               <Route
//                 path="/admin/users"
//                 element={
//                   <ProtectedRoute adminOnly={true}>
//                     <UserManagement />
//                   </ProtectedRoute>
//                 }
//               />
//             </Routes>
//           </main>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "./contexts/AuthContext";

// export default function Header() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <header className="bg-gray-900 text-gray-100 shadow-md">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//         {/* Logo / App name */}
//         <Link to="/" className="text-2xl font-bold text-indigo-400">
//           Code Repository
//         </Link>

//         {/* Navigation Links */}
//         <nav className="flex space-x-6">
//           <Link to="/" className="hover:text-indigo-400 transition">
//             Home
//           </Link>

//           {user ? (
//             <>
//               {/* If logged in */}
//               <Link to="/profile" className="hover:text-indigo-400 transition">
//                 Profile
//               </Link>
//               <Link to="/code" className="hover:text-indigo-400 transition">
//                 My Codes
//               </Link>

//               {/* If admin role */}
//               {user.role === "admin" && (
//                 <Link
//                   to="/admin/users"
//                   className="hover:text-indigo-400 transition"
//                 >
//                   User Management
//                 </Link>
//               )}

//               <button
//                 onClick={handleLogout}
//                 className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               {/* If NOT logged in */}
//               <Link to="/login" className="hover:text-indigo-400 transition">
//                 Login
//               </Link>
//               <Link to="/register" className="hover:text-indigo-400 transition">
//                 Register
//               </Link>
//               <Link
//                 to="/admin/login"
//                 className="hover:text-indigo-400 transition"
//               >
//                 Admin
//               </Link>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Layout/Header";
import Home from "./Home";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import Profile from "./components/User/Profile";
import AdminLogin from "./components/Admin/AdminLogin";
import UserManagement from "./components/Admin/UserManagement";
import CreateCodeFile from "./components/Code/CreateCodeFile";
import CodeFileList from "./components/Code/CodeFileList";


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/code"
                element={
                  <ProtectedRoute>
                    <CodeFileList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/code/new"
                element={
                  <ProtectedRoute>
                    <CreateCodeFile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
