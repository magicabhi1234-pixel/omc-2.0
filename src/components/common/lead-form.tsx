"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LeadForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json() as { success?: boolean; message?: string; traceId?: string };
      if (!response.ok || !result.success) {
        console.error("Lead submission failed", { traceId: result.traceId, message: result.message });
        throw new Error(result.message ?? "We couldn't submit your enquiry. Please try again.");
      }

      router.push("/thank-you");
    } catch (error) {
      console.error("Lead submission request failed", error);
      setSubmitError(
        "We couldn't submit your enquiry right now. Please try again or call us directly."
      );
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Name */}
      <div>
        <label className="sr-only" htmlFor="lead-name">Full name</label>
        <input
          id="lead-name"
          type="text"
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]"
        />

        {errors.name && (
          <p id="lead-name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label className="sr-only" htmlFor="lead-mobile">Mobile number</label>
        <input
          id="lead-mobile"
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
          inputMode="numeric"
          autoComplete="tel-national"
          aria-invalid={Boolean(errors.mobile)}
          aria-describedby={errors.mobile ? "lead-mobile-error" : undefined}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]"
        />

        {errors.mobile && (
          <p id="lead-mobile-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.mobile}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="sr-only" htmlFor="lead-email">Email address</label>
        <input id="lead-email" type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} autoComplete="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]" required />
      </div>

      {/* City Optional */}
      <div>
        <label className="sr-only" htmlFor="lead-city">City</label>
        <input id="lead-city" type="text" name="city" placeholder="City (Optional)" value={formData.city} onChange={handleChange} autoComplete="address-level2" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-[#0B3B68]" />
      </div>

      {/* Specialization */}
      <div>
        <label className="sr-only" htmlFor="lead-specialization">Specialization</label>
        <select
          id="lead-specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          aria-invalid={Boolean(errors.specialization)}
          aria-describedby={errors.specialization ? "lead-specialization-error" : undefined}
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
          <p id="lead-specialization-error" className="mt-1 text-sm text-red-600" role="alert">
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

      {submitError && (
        <p className="text-center text-sm text-red-600" role="alert">{submitError}</p>
      )}

      <p className="text-center text-xs text-slate-500">
        By submitting this form, you agree to
        receive admission assistance and
        counselling support.
      </p>
    </form>
  );
}
