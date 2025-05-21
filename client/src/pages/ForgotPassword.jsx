// import { useState } from "react";
// import { Link } from "react-router";
// import { useAuth } from "../hooks/useAuth";

// const ForgotPassword = () => {
//   const {
//     forgotPassword,
//     resetPassword,
//     isForgotPasswordLoading,
//     isResettingPassword,
//   } = useAuth();
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleRequestOTP = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await forgotPassword(email);
//       setStep(2);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send OTP");
//     }
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await resetPassword({
//         email,
//         otp,
//         newPassword,
//       });
//       setStep(3);
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP or password");
//     }
//   };

//   const renderStep1 = () => (
//     <form onSubmit={handleRequestOTP} className="mt-8 space-y-6">
//       <div>
//         <label htmlFor="email" className="sr-only">
//           Email address
//         </label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           required
//           className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div>
//         <button
//           type="submit"
//           disabled={isForgotPasswordLoading}
//           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           {isForgotPasswordLoading ? "Sending OTP..." : "Send OTP"}
//         </button>
//       </div>
//     </form>
//   );

//   const renderStep2 = () => (
//     <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
//       <div>
//         <label htmlFor="otp" className="sr-only">
//           OTP Code
//         </label>
//         <input
//           id="otp"
//           name="otp"
//           type="text"
//           required
//           className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//           placeholder="Enter OTP code"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="newPassword" className="sr-only">
//           New Password
//         </label>
//         <input
//           id="newPassword"
//           name="newPassword"
//           type="password"
//           required
//           className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//           placeholder="Enter new password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="confirmPassword" className="sr-only">
//           Confirm New Password
//         </label>
//         <input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           required
//           className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//           placeholder="Confirm new password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />
//       </div>

//       <div>
//         <button
//           type="submit"
//           disabled={isResettingPassword}
//           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           {isResettingPassword ? "Resetting password..." : "Reset Password"}
//         </button>
//       </div>
//     </form>
//   );

//   const renderStep3 = () => (
//     <div className="mt-8 space-y-6">
//       <div className="rounded-md bg-green-50 p-4">
//         <div className="text-sm text-green-700">
//           Password has been reset successfully!
//         </div>
//       </div>
//       <div className="text-center">
//         <Link
//           to="/login"
//           className="font-medium text-indigo-600 hover:text-indigo-500"
//         >
//           Return to login
//         </Link>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             {step === 1
//               ? "Reset your password"
//               : step === 2
//               ? "Enter OTP and new password"
//               : "Password reset successful"}
//           </h2>
//         </div>

//         {error && (
//           <div className="rounded-md bg-red-50 p-4">
//             <div className="text-sm text-red-700">{error}</div>
//           </div>
//         )}

//         {step === 1 && renderStep1()}
//         {step === 2 && renderStep2()}
//         {step === 3 && renderStep3()}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

const App = () => {
  return <div></div>;
};

export default App;
