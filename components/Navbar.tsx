import React from "react";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 border-y">
      <div className="flex gap-2">
        <h1 className="text-xl font-bold">Youtube Downloader</h1>
        <Badge>Beta</Badge>
      </div>
      <Button>
        <FaGithub color="white" /> Star on GitHub
      </Button>
    </div>
  );
}
