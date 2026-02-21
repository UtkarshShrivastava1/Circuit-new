import { useState } from "react";
import { toast } from "react-toastify";
import {FaEye } from 'react-icons/fa';

type UserRole = "member" | "manager" | "admin";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

const AddMember = () => {
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member" as UserRole,
    dateOfBirth: "",
    phone: "",
    gender: "",
    status: "active" as "active" | "inactive",
    address: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    let newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;
    setAdding(true);
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      if (image) {
        formPayload.append("image", image);
      }

    
      console.log("Form Submitted:", formData);
      toast.success("Member Added Successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "member" as UserRole,
        dateOfBirth: "",
        phone: "",
        gender: "",
        status: "active" as "active" | "inactive",
        address: "",
      });
      setImage(null);
      setPreview(null);
      setErrors({});
    } catch (error) {
      console.log(error);
    } finally {
      setAdding(false);
    }
  };

  // return (
  //   <div className="min-h-screen  flex items-center justify-center p-4">
  //     <form
  //       onSubmit={handleSubmit}
  //       className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6"
  //     >
  //       <h2 className="col-span-full text-2xl font-semibold text-center">
  //         Add Member
  //       </h2>

  //       {/* Name */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Full Name *</label>
  //         <input
  //           type="text"
  //           name="name"
  //           value={formData.name}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         />
  //         {errors.name && (
  //           <span className="text-red-500 text-sm">{errors.name}</span>
  //         )}
  //       </div>

  //       {/* Email */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Email *</label>
  //         <input
  //           type="email"
  //           name="email"
  //           value={formData.email}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         />
  //         {errors.email && (
  //           <span className="text-red-500 text-sm">{errors.email}</span>
  //         )}
  //       </div>

  //       {/* Password */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Password *</label>
  //         <input
  //           type="password"
  //           name="password"
  //           value={formData.password}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         />
  //         {errors.password && (
  //           <span className="text-red-500 text-sm">{errors.password}</span>
  //         )}
  //       </div>

  //       {/* Role */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Role</label>
  //         <select
  //           name="role"
  //           value={formData.role}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         >
  //           <option value="member">Member</option>
  //           <option value="manager">Manager</option>
  //           <option value="admin">Admin</option>
  //         </select>
  //       </div>

  //       {/* DOB */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Date of Birth</label>
  //         <input
  //           type="date"
  //           name="dateOfBirth"
  //           value={formData.dateOfBirth}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         />
  //       </div>

  //       {/* Phone */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Phone</label>
  //         <input
  //           maxLength={10}
  //           type="text"
  //           name="phone"
  //           value={formData.phone}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         />
  //         {errors.phone && (
  //           <span className="text-red-500 text-sm">{errors.phone}</span>
  //         )}
  //       </div>

  //       {/* Gender */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Gender</label>
  //         <select
  //           name="gender"
  //           value={formData.gender}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         >
  //           <option value="">Select</option>
  //           <option value="female">Female</option>
  //           <option value="male">Male</option>
  //           <option value="other">Other</option>
  //         </select>
  //       </div>

  //       {/* Status */}
  //       <div className="flex flex-col">
  //         <label className="font-medium mb-1">Status</label>
  //         <select
  //           name="status"
  //           value={formData.status}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         >
  //           <option value="active">Active</option>
  //           <option value="inactive">Inactive</option>
  //         </select>
  //       </div>

  //       {/* Address */}
  //       <div className="flex flex-col md:col-span-2">
  //         <label className="font-medium mb-1">Address</label>
  //         <textarea
  //           name="address"
  //           value={formData.address}
  //           onChange={handleChange}
  //           className="border p-2 rounded"
  //         />
  //       </div>

   
  //       {/* Image Upload */}
  //       <div className="flex flex-col md:col-span-2">
  //         <label className="font-medium mb-2">Profile Image</label>

  //         <input
  //           type="file"
  //           accept="image/*"
  //           onChange={handleImageChange}
  //           className="hidden"
  //           id="imageUpload"
  //         />

  //         <label
  //           htmlFor="imageUpload"
  //           className="cursor-pointer border-2 border-dashed border-gray-300 
  //   p-6 rounded-lg text-center hover:border-blue-500 transition"
  //         >
  //           <p className="text-gray-600">
  //             {image ? "Change Image" : "Click to Upload Image"}
  //           </p>
         
  //         </label>

  //         {preview && (
  //           <img
  //             src={preview}
  //             alt="Preview"
  //             className="mt-4 w-32 h-32 object-cover rounded-lg border"
  //           />
  //         )}
  //       </div>

  //       <button
  //         type="submit"
  //         disabled={adding}
  //         className="col-span-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
  //       >
  //         {adding ? "Adding..." : "Add Member"}
  //       </button>
  //     </form>
  //   </div>
  // );

return (
  <div className="min-h-screen  flex items-center justify-center p-6">
    <form
      onSubmit={handleSubmit}
      className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-md border border-gray-200 space-y-8"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Add New Member
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the member details below
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password * 
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
           <i className="fa-solid fa-eye" id="eye"></i>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            maxLength={10}
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Profile Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="imageUpload"
        />

        <label
          htmlFor="imageUpload"
          className="flex items-center justify-center border-2 border-dashed 
          border-gray-300 rounded-xl p-8 text-gray-500 cursor-pointer 
          hover:border-indigo-500 hover:text-indigo-600 transition"
        >
          {image ? "Change Image" : "Click to Upload Image"}
        </label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-32 h-32 object-cover rounded-xl border border-gray-300"
          />
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={adding}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium
          hover:bg-indigo-700 transition shadow-sm
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? "Adding..." : "Add Member"}
        </button>
      </div>
    </form>
  </div>
);


};

export default AddMember;
