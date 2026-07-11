import VendorScripts from "./VendorScripts";

export default function SiteLayout({ children }) {
  return (
    <>
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
      <link rel="stylesheet" href="/assets/css/venobox.min.css" />
      <link rel="stylesheet" href="/assets/css/animate.min.css" />
      <link rel="stylesheet" href="/assets/css/keyframe-animation.css" />
      <link rel="stylesheet" href="/assets/css/odometer.min.css" />
      <link rel="stylesheet" href="/assets/css/nice-select.css" />
      <link rel="stylesheet" href="/assets/css/swiper.min.css" />
      <link rel="stylesheet" href="/assets/css/hero.css" />
      <link rel="stylesheet" href="/assets/css/main.css" />
      {children}
      <VendorScripts />
    </>
  );
}
