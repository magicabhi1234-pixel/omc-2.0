"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LeadForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    specialization: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    specialization: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      mobile: "",
      specialization: "",
    };

    let isValid = true;

    if (
      !/^[A-Za-z\s]+$/.test(
        formData.name.trim()
      )
    ) {
      newErrors.name =
        "Please enter a valid name";
      isValid = false;
    }

    if (
      !/^[1-9][0-9]{9}$/.test(
        formData.mobile
      )
    ) {
      newErrors.mobile =
        "Please enter a valid 10-digit mobile number";
      isValid = false;
    }

    if (!formData.specialization) {
      newErrors.specialization =
        "Please select a specialization";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("leads")
      .insert([
        {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          city: formData.city,
          specialization:
            formData.specialization,
        },
      ]);

    if (error) {
      setLoading(false);

      console.log(
        "SUPABASE ERROR:",
        error
      );

      alert(
        `${error.message}\n\n${
          error.details || ""
        }`
      );

      return;
    }

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(formData),
      });

      setLoading(false);

      router.push("/thank-you");
    } catch (emailError) {
      console.error(
        "EMAIL ERROR:",
        emailError
      );

      setLoading(false);

      alert(
        "Lead saved successfully but email sending failed."
      );

      router.push("/thank-you");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Name */}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number *"
          value={formData.mobile}
          onChange={(e) => {
            const value =
              e.target.value.replace(
                /\D/g,
                ""
              );

            setFormData({
              ...formData,
              mobile: value,
            });

            setErrors({
              ...errors,
              mobile: "",
            });
          }}
          maxLength={10}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]"
        />

        {errors.mobile && (
          <p className="mt-1 text-sm text-red-500">
            {errors.mobile}
          </p>
        )}
      </div>

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email Address *"
        value={formData.email}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]"
        required
      />

      {/* City Optional */}
      <input
        type="text"
        name="city"
        placeholder="City (Optional)"
        value={formData.city}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]"
      />

      {/* Specialization */}
      <div>
        <select
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]"
        >
          <option value="">
            Select Specialization *
          </option>

          <option value="Finance Management">
            Finance Management
          </option>

          <option value="Marketing Management">
            Marketing Management
          </option>

          <option value="Operations Management">
            Operations Management
          </option>

          <option value="Information Technology and System Management">
            Information Technology and System Management
          </option>

          <option value="Supply Chain Management">
            Supply Chain Management
          </option>

          <option value="Human Resource Management">
            Human Resource Management
          </option>

          <option value="International Business Management">
            International Business Management
          </option>

          <option value="Retail Management">
            Retail Management
          </option>
        </select>

        {errors.specialization && (
          <p className="mt-1 text-sm text-red-500">
            {errors.specialization}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer rounded-xl bg-[#F47C45] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading
          ? "Submitting..."
          : "Get Free Counselling"}
      </button>

      <p className="text-center text-xs text-slate-500">
        By submitting this form, you agree to
        receive admission assistance and
        counselling support.
      </p>
    </form>
  );
}