"use client";

import Script from "next/script";

export default function VendorScripts() {
  return (
    <>
      <Script src="/assets/js/vendor/jquary-3.6.0.min.js" strategy="beforeInteractive" />
      <Script src="/assets/js/vendor/bootstrap-bundle.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/imagesloaded-pkgd.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/waypoints.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/venobox.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/odometer.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/meanmenu.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/jquery.isotope.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/nice-select.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/easypiechart.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/wow.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/swiper.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/vendor/smooth-scroll.js" strategy="afterInteractive" />
      <Script src="/assets/js/ajax-form.js" strategy="afterInteractive" />
      <Script
        src="/assets/js/main.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && window.jQuery) {
            window.jQuery(window).trigger("load");
          }
        }}
      />
    </>
  );
}
