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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    // Save Lead To Supabase
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
      // Send Email
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
      <input
        type="text"
        name="name"
        placeholder="Full Name *"
        value={formData.name}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        required
      />

      <input
        type="tel"
        name="mobile"
        placeholder="Mobile Number *"
        value={formData.mobile}
        onChange={handleChange}
        maxLength={10}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address *"
        value={formData.email}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        required
      />

      <input
        type="text"
        name="city"
        placeholder="City *"
        value={formData.city}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        required
      />

      <select
        name="specialization"
        value={formData.specialization}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#0B3B68]"
        required
      >
        <option value="">
          Select Specialization
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