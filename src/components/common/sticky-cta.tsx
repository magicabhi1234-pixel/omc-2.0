"use client";

export default function StickyCTA() {
  const openPopup = () => {
    window.dispatchEvent(new Event("openLeadPopup"));
  };

  return (
    <button
      onClick={openPopup}
      className="
        fixed
        right-0
        top-1/2
        z-50
        -translate-y-1/2
        cursor-pointer
        rounded-l-lg
        bg-[#0B3B68]
        px-3
        py-5
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:bg-[#082d52]
      "
      aria-label="Enquire Now"
    >
      <span
        className="
          block
          [writing-mode:vertical-rl]
          text-base
          font-bold
          tracking-wide
        "
      >
        Enquire Now
      </span>
    </button>
  );
}