"use client";

export default function BlogCTAButton() {
  const openPopup = () => {
    window.dispatchEvent(new Event("openLeadPopup"));
  };

  return (
    <button
      type="button"
      onClick={openPopup}
      className="mt-6 cursor-pointer rounded-xl bg-[#F47C45] px-6 py-3 font-semibold text-white"
    >
      Get Free Counselling
    </button>
  );
}
