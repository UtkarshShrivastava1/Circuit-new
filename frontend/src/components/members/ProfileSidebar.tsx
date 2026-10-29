

import { useEffect, useState } from "react";
import type { Member } from "../../type/member";
import {
  Mail,
  User,
  Calendar,
  CheckCircle,
  Edit2Icon,
  SaveIcon,
  MapPin,
  X,
  Loader2,
} from "lucide-react";
import { updateMember } from "@/services/memberService";
import { toast } from "react-toastify";
import { useAuth } from "@/auth/useAuth";
import { uploadImage } from "@/services/uploadService";

interface Props {
  member: Member;
  onUpdate?: (updatedMember: Member) => void;
}

export default function ProfileSidebar({ member, onUpdate }: Props) {
  const { auth } = useAuth();
  const slug = auth?.slug;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Member>(member);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(member);
  }, [member]);

  const handleChange = (field: keyof Member, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setFormData(member);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!slug) {
      toast.error("Organization information is missing");
      return;
    }

    if (!member._id) {
      toast.error("Member ID is missing");
      return;
    }

    if (!formData.name?.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email?.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setIsSaving(true);

      const { _id, ...payload } = formData;
  console.log("Payload being sent:", {
      designation: payload.designation,
      customDesignation: payload.customDesignation,
      department: payload.department,
      customDepartment: payload.customDepartment,
    });

     const response = await updateMember(slug, member._id, payload);

const updatedMember: Member =
  response.data?.user ??
  response.data?.data ??
  response.data;

setFormData(updatedMember);
onUpdate?.(updatedMember);
setIsEditing(false);
toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const imgUrl = await uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        imageUrl: imgUrl,
        imgUrl,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const inputClass =
    "input input-bordered w-full bg-base-100";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-base-content/70";

  const renderInput = (
    label: string,
    field: keyof Member,
    type = "text"
  ) => (
    <div key={field}>
      <label className={labelClass} htmlFor={String(field)}>
        {label}
      </label>
      <input
        id={String(field)}
        type={type}
        value={
          type === "date"
            ? String(formData[field] ?? "").slice(0, 10)
            : String(formData[field] ?? "")
        }
        onChange={(e) => handleChange(field, e.target.value)}
        className={inputClass}
      />
    </div>
  );

  return (
    <div className="w-full shrink-0 md:w-[320px]">
      {/* PROFILE CARD */}
      <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-md">
        {/* COVER */}
        <div className="relative h-28 rounded-t-xl bg-primary">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edit profile"
            title="Edit Profile"
            className="absolute right-3 top-3 rounded-full bg-base-100 p-2 text-base-content shadow hover:opacity-80"
          >
            <Edit2Icon size={16} />
          </button>
        </div>

        {/* AVATAR */}
        <div className="relative -mt-12 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-base-100 bg-base-100 shadow-lg">
            {(formData.imageUrl || formData.imgUrl)?.trim() ? (
              <img
                src={formData.imageUrl || formData.imgUrl}
                alt={formData.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-base-content/40">
                {(formData.name?.[0] || "?").toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* PROFILE DETAILS — VIEW ONLY */}
        <div className="px-6 py-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-base-content">
              {formData.name}
            </h2>

            {formData.role && (
              <span className="mt-1 inline-block rounded-lg bg-primary/20 px-3 py-0.5 text-xs capitalize text-primary">
                {formData.role}
              </span>
            )}
          </div>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-base-content/70">
            Basic Information
          </h3>

          <div className="space-y-4 text-sm">
            {formData.email && (
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-base-content/40" />
                <div className="min-w-0">
                  <p className="text-xs text-base-content/50">Email</p>
                  <p className="break-all font-medium text-base-content">
                    {formData.email}
                  </p>
                </div>
              </div>
            )}

            {formData.joinedAt && (
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Joined At</p>
                  <p className="font-medium text-base-content">
                    {String(formData.joinedAt).slice(0, 10)}
                  </p>
                </div>
              </div>
            )}

            {formData.status && (
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Status</p>
                  <p className="font-medium capitalize text-base-content">
                    {formData.status}
                  </p>
                </div>
              </div>
            )}

            {formData.gender && (
              <div className="flex items-center gap-3">
                <User size={16} className="text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Gender</p>
                  <p className="font-medium capitalize text-base-content">
                    {formData.gender}
                  </p>
                </div>
              </div>
            )}

            {formData.phone && (
              <div className="flex items-center gap-3">
                <User size={16} className="text-base-content/40" />
                <div>
                  <p className="text-xs text-base-content/50">Phone</p>
                  <p className="font-medium text-base-content">
                    {formData.phone}
                  </p>
                </div>
              </div>
            )}

            {formData.address && (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-base-content/40" />
                <div className="min-w-0">
                  <p className="text-xs text-base-content/50">Address</p>
                  <p className="break-words font-medium text-base-content">
                    {formData.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSaving && !isUploading) {
              handleClose();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-5 text-base-content shadow-2xl sm:p-7"
          >
            {/* MODAL HEADER */}
            <div className="mb-6 flex items-center justify-between border-b border-base-300 pb-4">
              <div>
                <h2
                  id="edit-profile-title"
                  className="text-xl font-semibold"
                >
                  Edit Profile
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Update your profile information
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving || isUploading}
                aria-label="Close modal"
                className="rounded-lg p-2 hover:bg-base-200 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* AVATAR UPLOAD */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-base-200">
                {(formData.imageUrl || formData.imgUrl)?.trim() ? (
                  <img
                    src={formData.imageUrl || formData.imgUrl}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold">
                    {(formData.name?.[0] || "?").toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="profile-image"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-base-300 px-3 py-2 text-sm hover:bg-base-200"
                >
                  <Edit2Icon size={14} />
                  {isUploading ? "Uploading..." : "Change Photo"}
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading || isSaving}
                />
                <p className="mt-1 text-xs text-base-content/50">
                  Choose a profile image
                </p>
              </div>
            </div>

            {/* FORM FIELDS */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSave();
              }}
            >
        
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
  {/* PERSONAL INFORMATION */}
  {renderInput("Full Name", "name")}
  {renderInput("Email", "email", "email")}
  {renderInput("Phone", "phone", "tel")}
  {renderInput("Date of Birth", "dateOfBirth", "date")}

  <div>
    <label className={labelClass}>Gender</label>
    <select
      value={formData.gender || ""}
      onChange={(e) => handleChange("gender", e.target.value)}
      className="select select-bordered w-full"
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>

  {/* ADDRESS */}
  {renderInput("Current Address", "currentAddress")}
  {renderInput("Permanent Address", "permanentAddress")}

  {/* EMERGENCY CONTACT */}
  {renderInput("Emergency Contact Name", "emergencyName")}
  {renderInput("Emergency Contact Phone", "emergencyPhone", "tel")}
  {renderInput("Emergency Contact Relation", "emergencyRelation")}

  {/* IDENTITY */}
  {renderInput("Aadhaar Number", "aadhaar")}
  {renderInput("PAN Number", "pan")}
  {renderInput("Passport Number", "passport")}

  {/* EMPLOYMENT */}
  {renderInput("Employee ID", "employeeId")}
  {/* DESIGNATION */}
<div>
  <label className={labelClass}>Designation</label>
  <select
    value={formData.designation || ""}
    onChange={(e) => handleChange("designation", e.target.value)}
    className="select select-bordered w-full"
  >
    <option value="">Select Designation</option>
    <option value="Frontend Developer">Frontend Developer</option>
    <option value="Backend Developer">Backend Developer</option>
    <option value="Full Stack Developer">Full Stack Developer</option>
    <option value="Software Engineer">Software Engineer</option>
    <option value="UI/UX Designer">UI/UX Designer</option>
    <option value="QA Engineer">QA Engineer</option>
    <option value="Project Manager">Project Manager</option>
    <option value="Other">Other</option>
  </select>
</div>

{formData.designation === "Other" && (
  <div>
    <label className={labelClass}>Custom Designation</label>
    <input
      type="text"
      value={formData.customDesignation || ""}
      onChange={(e) =>
        handleChange("customDesignation", e.target.value)
      }
      className={inputClass}
      placeholder="Enter designation"
    />
  </div>
)}

{/* DEPARTMENT */}
<div>
  <label className={labelClass}>Department</label>
  <select
    value={formData.department || ""}
    onChange={(e) => handleChange("department", e.target.value)}
    className="select select-bordered w-full"
  >
    <option value="">Select Department</option>
    <option value="IT">IT</option>
    <option value="HR">HR</option>
    <option value="Finance">Finance</option>
    <option value="Sales">Sales</option>
    <option value="Marketing">Marketing</option>
    <option value="Operations">Operations</option>
    <option value="Other">Other</option>
  </select>
</div>

{formData.department === "Other" && (
  <div>
    <label className={labelClass}>Custom Department</label>
    <input
      type="text"
      value={formData.customDepartment || ""}
      onChange={(e) =>
        handleChange("customDepartment", e.target.value)
      }
      className={inputClass}
      placeholder="Enter department"
    />
  </div>
)}
  
  {renderInput("Joining Date", "joiningDate", "date")}
  {renderInput("Previous Company", "previousCompany")}

  <div>
    <label className={labelClass}>Role</label>
    <input
      value={String(formData.role || "")}
      readOnly
      className={`${inputClass} cursor-not-allowed opacity-70`}
    />
  </div>

  <div>
    <label className={labelClass}>Status</label>
    <select
      value={formData.status || ""}
      onChange={(e) => handleChange("status", e.target.value)}
      className="select select-bordered w-full"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>

  {/* BANK DETAILS */}
  {renderInput("Bank Name", "bankName")}
  {renderInput("Account Number", "accountNumber")}
  {renderInput("IFSC Code", "ifscCode")}
</div>


              {/* MODAL FOOTER */}
              <div className="mt-8 flex justify-end gap-3 border-t border-base-300 pt-5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving || isUploading}
                  className="rounded-lg border border-base-300 px-4 py-2 text-sm hover:bg-base-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-content hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}