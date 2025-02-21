import React from "react";

const Footer = () => {
  return (
    <div className="text-foreground">
      <div className="container mx-auto px-4 py-2">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Youtube Converter. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
