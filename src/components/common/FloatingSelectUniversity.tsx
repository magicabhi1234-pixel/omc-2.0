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
      className="floating-select-university fixed bottom-4 left-[30px] z-[9990] h-[70px] w-[70px] cursor-pointer overflow-hidden rounded-[50px] md:h-[80px] md:w-[80px]"
    >
      <Image
        src="/select_university.png"
        alt="Select University"
        fill
        sizes="(max-width: 767px) 70px, 80px"
        className="object-contain"
      />
    </OpenPopupButton>
  );
}
