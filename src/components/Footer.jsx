import React from "react";

const Footer = () => {
  return (
    <div>
      <div className="flex bg-[#007FFF] justify-between py-10 2xl:px-40 lg:px-16 items-start">
        <div className="logo flex flex-col items-center">
          <img src="/images/logo.png" alt="" width="250" />
          <button className="bg-[#FA6A02] text-2xl font-semibold h-[55px] px-8 rounded-full fredoka text-white">
            Download App
          </button>
        </div>
        <div className="about-us">
          <h1 className="text-3xl text-white fredoka font-semibold mb-4">
            About Us
          </h1>
          <ul className="text-lg text-white outfit flex flex-col gap-2">
            <li>About</li>
            <li>Policies</li>
            <li>Careers</li>
          </ul>
        </div>
        <div className="Help">
          <h1 className="text-3xl text-white fredoka font-semibold mb-4">
            Help
          </h1>
          <ul className="text-lg text-white outfit flex flex-col gap-2">
            <li>Help Center</li>
            <li>Privacy Settings</li>
          </ul>
        </div>
        <div className="contact-us">
          <h1 className="text-3xl text-white fredoka font-semibold mb-4">
            Contact Us
          </h1>
          <ul className="flex gap-4">
            <li>
              <img
                src="/images/socials/fb.webp"
                alt=""
                width="40"
                loading="lazy"
              />
            </li>
            <li>
              <img
                src="/images/socials/ig.webp"
                alt=""
                width="40"
                loading="lazy"
              />
            </li>
            <li>
              <img
                src="/images/socials/twitter.webp"
                alt=""
                width="40"
                loading="lazy"
              />
            </li>
            <li>
              <img
                src="/images/socials/pinterest.webp"
                alt=""
                width="40"
                loading="lazy"
              />
            </li>
            <li>
              <img src="/images/yt.png" alt="" width="40" loading="lazy" />
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-[#FFD72D]">
        <h1 className="text-center text-[#007FFF] outfit text-xl py-4 font-bold">
          © Toydazzle 2024
        </h1>
      </div>
    </div>
  );
};

export default Footer;
