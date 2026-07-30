import Image from "next/image";
import OpenPopupButton from "./open-popup-button";

/**
 * Sitewide floating CTA (bottom-left, fixed) that opens the same lead
 * popup as every other CTA on the site - see OpenPopupButton for the
 * shared "dispatch openLeadPopup" click/keyboard trigger it reuses.
 */
export default function FloatingSelectUniversity() {
  return (
    <OpenPopupButton
      ariaLabel="Select University"
      className="floating-select-university fixed bottom-4 left-[30px] z-[9990] h-[70px] w-[104px] cursor-pointer overflow-hidden sm:h-[85px] sm:w-[127px] md:h-[100px] md:w-[149px]"
    >
      <Image
        src="/select_university.png"
        alt="Select University"
        fill
        sizes="(max-width: 640px) 104px, (max-width: 768px) 127px, 149px"
        className="object-contain"
      />
    </OpenPopupButton>
  );
}
