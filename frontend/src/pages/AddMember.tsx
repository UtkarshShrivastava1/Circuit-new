// import { useState } from "react";
// import { toast } from "react-toastify";
// import { FaEye, FaEyeSlash ,FaPen  } from "react-icons/fa";

// type UserRole = "member" | "manager" | "admin";

// interface Errors {
//   name?: string;
//   email?: string;
//   password?: string;
//   phone?: string;
// }

// const AddMember = () => {
//   const [adding, setAdding] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "member" as UserRole,
//     dateOfBirth: "",
//     phone: "",
//     gender: "",
//     status: "active" as "active" | "inactive",
//     address: "",
//   });

//   const [image, setImage] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [errors, setErrors] = useState<Errors>({});
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const validate = () => {
//     let newErrors: Errors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//     }

//     if (!formData.email.includes("@")) {
//       newErrors.email = "Valid email is required";
//     }

//     if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (formData.phone && formData.phone.length < 10) {
//       newErrors.phone = "Phone must be 10 digits";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validate()) return;
//     setAdding(true);
//     try {
//       const formPayload = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         formPayload.append(key, value);
//       });

//       if (image) {
//         formPayload.append("image", image);
//       }

    
//       console.log("Form Submitted:", formData);
//       toast.success("Member Added Successfully");
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         role: "member" as UserRole,
//         dateOfBirth: "",
//         phone: "",
//         gender: "",
//         status: "active" as "active" | "inactive",
//         address: "",
//       });
//       setImage(null);
//       setPreview(null);
//       setErrors({});
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setAdding(false);
//     }
//   };

//   // return (
//   //   <div className="min-h-screen  flex items-center justify-center p-4">
//   //     <form
//   //       onSubmit={handleSubmit}
//   //       className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
//   //     >
//   //       <h2 className="col-span-full text-2xl font-semibold text-center">
//   //         Add Member
//   //       </h2>

//   //       {/* Name */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Full Name *</label>
//   //         <input
//   //           type="text"
//   //           name="name"
//   //           value={formData.name}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         />
//   //         {errors.name && (
//   //           <span className="text-red-500 text-sm">{errors.name}</span>
//   //         )}
//   //       </div>

//   //       {/* Email */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Email *</label>
//   //         <input
//   //           type="email"
//   //           name="email"
//   //           value={formData.email}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         />
//   //         {errors.email && (
//   //           <span className="text-red-500 text-sm">{errors.email}</span>
//   //         )}
//   //       </div>

//   //       {/* Password */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Password *</label>
//   //         <input
//   //           type="password"
//   //           name="password"
//   //           value={formData.password}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         />
//   //         {errors.password && (
//   //           <span className="text-red-500 text-sm">{errors.password}</span>
//   //         )}
//   //       </div>

//   //       {/* Role */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Role</label>
//   //         <select
//   //           name="role"
//   //           value={formData.role}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         >
//   //           <option value="member">Member</option>
//   //           <option value="manager">Manager</option>
//   //           <option value="admin">Admin</option>
//   //         </select>
//   //       </div>

//   //       {/* DOB */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Date of Birth</label>
//   //         <input
//   //           type="date"
//   //           name="dateOfBirth"
//   //           value={formData.dateOfBirth}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         />
//   //       </div>

//   //       {/* Phone */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Phone</label>
//   //         <input
//   //           maxLength={10}
//   //           type="text"
//   //           name="phone"
//   //           value={formData.phone}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         />
//   //         {errors.phone && (
//   //           <span className="text-red-500 text-sm">{errors.phone}</span>
//   //         )}
//   //       </div>

//   //       {/* Gender */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Gender</label>
//   //         <select
//   //           name="gender"
//   //           value={formData.gender}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         >
//   //           <option value="">Select</option>
//   //           <option value="female">Female</option>
//   //           <option value="male">Male</option>
//   //           <option value="other">Other</option>
//   //         </select>
//   //       </div>

//   //       {/* Status */}
//   //       <div className="flex flex-col">
//   //         <label className="font-medium mb-1">Status</label>
//   //         <select
//   //           name="status"
//   //           value={formData.status}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         >
//   //           <option value="active">Active</option>
//   //           <option value="inactive">Inactive</option>
//   //         </select>
//   //       </div>

//   //       {/* Address */}
//   //       <div className="flex flex-col md:col-span-2">
//   //         <label className="font-medium mb-1">Address</label>
//   //         <textarea
//   //           name="address"
//   //           value={formData.address}
//   //           onChange={handleChange}
//   //           className="border p-2 rounded"
//   //         />
//   //       </div>

   
//   //       {/* Image Upload */}
//   //       <div className="flex flex-col md:col-span-2">
//   //         <label className="font-medium mb-2">Profile Image</label>

//   //         <input
//   //           type="file"
//   //           accept="image/*"
//   //           onChange={handleImageChange}
//   //           className="hidden"
//   //           id="imageUpload"
//   //         />

//   //         <label
//   //           htmlFor="imageUpload"
//   //           className="cursor-pointer border-2 border-dashed border-gray-300 
//   //   p-6 rounded-lg text-center hover:border-blue-500 transition"
//   //         >
//   //           <p className="text-gray-600">
//   //             {image ? "Change Image" : "Click to Upload Image"}
//   //           </p>
         
//   //         </label>

//   //         {preview && (
//   //           <img
//   //             src={preview}
//   //             alt="Preview"
//   //             className="mt-4 w-32 h-32 object-cover rounded-lg border"
//   //           />
//   //         )}
//   //       </div>

//   //       <button
//   //         type="submit"
//   //         disabled={adding}
//   //         className="col-span-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//   //       >
//   //         {adding ? "Adding..." : "Add Member"}
//   //       </button>
//   //     </form>
//   //   </div>
//   // );

// return (
//   <div className="min-h-screen  flex items-center justify-center p-6">
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-md border border-gray-200 space-y-8"
//     >
//       {/* Header */}
//       <div className="flex justify-start items-center" >
//         <div >

//         <h2 className="text-2xl font-semibold text-gray-800">
//           Add New Member
//         </h2>
//         <p className="text-sm text-gray-500 mt-1">
//           Fill in the member details below
//         </p>
//         </div>

         
//       </div>

//           <div className="flex flex-col items-center">
//   <label className="block text-sm font-medium text-gray-700 mb-4">
//     Profile Image
//   </label>

//   {/* Hidden input */}
//   <input
//     type="file"
//     accept="image/*"
//     onChange={handleImageChange}
//     className="hidden"
//     id="imageUpload"
//   />

//   {/* Avatar Circle */}
//   <div className="relative w-32 h-32">

//     {/* Clickable Circle */}
//     <label
//       htmlFor="imageUpload"
//       className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300
//       flex items-center justify-center text-sm text-gray-500
//       cursor-pointer hover:border-indigo-500 hover:text-indigo-600
//       transition overflow-hidden"
//     >
//       {preview ? (
//         <img
//           src={preview}
//           alt="Preview"
//           className="w-full h-full object-cover rounded-full"
//         />
//       ) : (
//         <span className="text-center px-4">
//           Click to Upload
//         </span>
//       )}
//     </label>

//     {/* Pencil Icon (only if image exists) */}
//     {preview && (
//       <label
//         htmlFor="imageUpload"
//         className="absolute bottom-2 right-2 bg-indigo-600 hover:bg-indigo-700
//         text-white p-2 rounded-full shadow-md cursor-pointer transition"
//       >
//         <FaPen size={12} />
//       </label>
//     )}

//   </div>
// </div>

//       {/* Grid */}
//       <div className="grid md:grid-cols-2 gap-6">

//         {/* Full Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Full Name *
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//           {errors.name && (
//             <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Email *
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//           )}
//         </div>

//         {/* Password */}
//         {/* <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Password * 
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//            <i className="fa-solid fa-eye" id="eye"><FaEye/></i>
//           {errors.password && (
//             <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//           )}
//         </div> */}

//         <div>
//   <label className="block text-sm font-medium text-gray-700 mb-2">
//     Password *
//   </label>

//   <div className="relative">
//     <input
//       type={showPassword ? "text" : "password"}
//       name="password"
//       value={formData.password}
//       onChange={handleChange}
//       className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 bg-gray-50
//       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//     />

//     {/* Eye Icon */}
//     <button
//       type="button"
//       onClick={() => setShowPassword(!showPassword)}
//       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//     >
//       {showPassword ? <FaEyeSlash /> : <FaEye />}
//     </button>
//   </div>

//   {errors.password && (
//     <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//   )}
//         </div>

//         {/* Role */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Role
//           </label>
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           >
//             <option value="member">Member</option>
//             <option value="manager">Manager</option>
//             <option value="admin">Admin</option>
//           </select>
//         </div>

//         {/* DOB */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Date of Birth
//           </label>
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Phone
//           </label>
//           <input
//             maxLength={10}
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           />
//           {errors.phone && (
//             <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
//           )}
//         </div>

//         {/* Gender */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Gender
//           </label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           >
//             <option value="">Select</option>
//             <option value="female">Female</option>
//             <option value="male">Male</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Status
//           </label>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           >
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//       </div>

//       {/* Address */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Address
//         </label>
//         <textarea
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           rows={3}
//           className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
//           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
//         />
//       </div>

//       {/* Image Upload */}
//       {/* <div>
//         <label className="block text-sm font-medium text-gray-700 mb-3">
//           Profile Image
//         </label>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageChange}
//           className="hidden rounded-full"
//           id="imageUpload"
//         />

//         <label
//           htmlFor="imageUpload"
//           className="flex items-center justify-center border-2 border-dashed 
//           border-gray-300 rounded-xl p-8 text-gray-500 cursor-pointer 
//           hover:border-indigo-500 hover:text-indigo-600 transition"
//         >
//           {image ? "Change Image" : "Click to Upload Image"}
//         </label>

//         {preview && (
//           <img
//             src={preview}
//             alt="Preview"
//             className="mt-4 w-32 h-32 object-cover  border border-gray-300 rounded-full"
//           />
//         )}
//       </div> */}

     

//       {/* Submit Button */}
//       <div className="flex justify-end">
//         <button
//           type="submit"
//           disabled={adding}
//           className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium
//           hover:bg-indigo-700 transition shadow-sm
//           disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {adding ? "Adding..." : "Add Member"}
//         </button>
//       </div>
//     </form>
//   </div>
// );


// };

// export default AddMember;

import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";

type UserRole = "member" | "manager" | "admin";
type Errors = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  emergencyPhone?: string;
  aadhaar?: string;
  pan?: string;
  designation?: string;
};


const AddMember = () => {
  const [adding, setAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [formData, setFormData] = useState({
  // Personal
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  currentAddress: "",
  permanentAddress: "",

  // Emergency
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",

  // Identity
  aadhaar: "",
  pan: "",
  passport: "",

  // Employment
  role: "member" as UserRole,
  designation: "",   // ✅ ADD THIS
  department: "",    // optional but recommended
  joiningDate: "",
  previousCompany: "",

  // Financial
  bankName: "",
  accountNumber: "",
  ifscCode: "",
});

 const validate = () => {
  let newErrors: Errors = {};

  // Name
  if (!formData.name.trim()) {
    newErrors.name = "Name is required";
  }

  // Email
  if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    newErrors.email = "Enter a valid email address";
  }

  // Password
  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  // Phone (Indian 10-digit)
  if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    newErrors.phone = "Enter valid 10-digit Indian mobile number";
  }

  // Emergency Phone
  if (
    formData.emergencyPhone &&
    !/^[6-9]\d{9}$/.test(formData.emergencyPhone)
  ) {
    newErrors.emergencyPhone =
      "Enter valid 10-digit emergency number";
  }

  // Aadhaar (12 digits only)
  if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) {
    newErrors.aadhaar = "Aadhaar must be exactly 12 digits";
  }

  // PAN (ABCDE1234F)
  if (
    formData.pan &&
    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())
  ) {
    newErrors.pan =
      "PAN must be in format ABCDE1234F";
  }

  if (!formData.designation) {
  newErrors.designation = "Designation is required";
}

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!validate()) return;
    setAdding(true);
    console.log(formData);
    toast.success("Employee Registered Successfully");
    setAdding(false);
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-md space-y-10"
      >
        <h2 className="text-2xl font-semibold">Employee Onboarding</h2>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="imageUpload"
            onChange={handleImageChange}
          />

          <div className="relative w-32 h-32">
            <label
              htmlFor="imageUpload"
              className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  Upload Image
                </span>
              )}
            </label>

            {preview && (
              <label
                htmlFor="imageUpload"
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer"
              >
                <FaPen size={12} />
              </label>
            )}
          </div>
        </div>

        {/* ================= PERSONAL INFO ================= */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className={inputStyle}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className={`${inputStyle} pr-12`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            <input
              type="text"
              name="phone"
              placeholder="Contact"
              value={formData.phone}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                if (value.length <= 10) {
                  setFormData((prev) => ({
                    ...prev,
                    phone: value,
                  }));
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            <input
              type="date"
              name="dateOfBirth"
              placeholder="DOB"
              onChange={handleChange}
              className={inputStyle}
            />

            <select
              name="gender"
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>


            <input
              name="email"
              type="designations "
              placeholder="Email"
              onChange={handleChange}
              className={inputStyle}
            />

          </div>



          <textarea
            name="currentAddress"
            placeholder="Current Address"
            onChange={handleChange}
            className={inputStyle}
          />
          <textarea
            name="permanentAddress"
            placeholder="Permanent Address"
            onChange={handleChange}
            className={inputStyle}
          />
        </section>

        {/* ================= EMERGENCY ================= */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">
            Emergency Contact
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <input
              name="emergencyName"
              placeholder="Contact Name"
              onChange={handleChange}
              className={inputStyle}
            />
            

            <input
                    type="text"
                    name="emergencyPhone"
                    placeholder="Contact Phone"
                    value={formData.emergencyPhone}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 10) {
                        setFormData((prev) => ({
                          ...prev,
                          emergencyPhone: value,
                        }));
                      }
                    }}
                    className={inputStyle}
                  />

                  {errors.emergencyPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.emergencyPhone}
                    </p>
                  )}

            <input
              name="emergencyRelation"
              placeholder="Relation"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </section>

        {/* ================= IDENTITY ================= */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">
            Identity & Legal Details
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <input
                name="aadhaar"
                placeholder="Aadhaar Number"
                value={formData.aadhaar}
                maxLength={12}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 12) {
                    setFormData((prev) => ({
                      ...prev,
                      aadhaar: value,
                    }));
                  }
                }}
                className={inputStyle}
              />

              {errors.aadhaar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.aadhaar}
                </p>
              )}


            <input
                  name="pan"
                  placeholder="PAN Number"
                  value={formData.pan}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setFormData((prev) => ({
                      ...prev,
                      pan: value,
                    }));
                  }}
                  className={inputStyle}
                />

                {errors.pan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pan}
                  </p>
                )}


            <input
              name="passport"
              placeholder="Passport Number"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </section>

        {/* ================= EMPLOYMENT ================= */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">
            Employment Details
          </h3>
<div className="grid md:grid-cols-2 gap-6">
            <select
              name="role"
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="member">Member</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>

            {/* Designation */}
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select Designation</option>
              <option value="software-engineer">Software Engineer</option>
              <option value="senior-software-engineer">Senior Software Engineer</option>
              <option value="team-lead">Team Lead</option>
              <option value="project-manager">Project Manager</option>
              <option value="hr-manager">HR Manager</option>
              <option value="ui-ux-designer">UI/UX Designer</option>
              <option value="qa-engineer">QA Engineer</option>
              <option value="devops-engineer">DevOps Engineer</option>
              <option value="intern">Intern</option>
            </select>
{errors.designation && (
  <p className="text-red-500 text-sm mt-1">
    {errors.designation}
  </p>
)}
            {/* Department */}
<select
  name="department"
  value={formData.department}
  onChange={handleChange}
  className={inputStyle}
>
  <option value="">Select Department</option>
  <option value="engineering">Engineering</option>
  <option value="hr">Human Resources</option>
  <option value="finance">Finance</option>
  <option value="marketing">Marketing</option>
  <option value="operations">Operations</option>
</select>

            <input
              type="date"
              name="joiningDate"
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              name="previousCompany"
              placeholder="Previous Company"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </section>

        {/* ================= FINANCIAL ================= */}
        <section className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">
            Financial Details
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <input
              name="bankName"
              placeholder="Bank Name"
              onChange={handleChange}
              className={inputStyle}
            />
            <input
              name="accountNumber"
              placeholder="Account Number"
              onChange={handleChange}
              className={inputStyle}
            />
            <input
              name="ifscCode"
              placeholder="IFSC Code"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>
        </section>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={adding}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            {adding ? "Submitting..." : "Register Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;