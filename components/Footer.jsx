import React from "react";

const Footer = () => {
  return (
    <div className="flex justify-center items-center p-4 border-y">
      <p className="text-gray-500">
        &copy; {new Date().getFullYear()} Youtube Downloader. All rights
        reserved.
      </p>
    </div>
  );
};

export default Footer;
