export default function Sponsor() {
  return (
    <div className="sponsor-section pt-180 pb-180">
      <div className="container">
        <div className="sponsor-carousel swiper">
          <div className="swiper-wrapper">
            {[1, 2, 3, 4, 5].map((n) => (
              <div className="swiper-slide" key={n}>
                <div className="sponsor-item">
                  <a href="#">
                    <img src={`/assets/img/sponsor/sponsor-${n}.png`} alt="sponsor" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
