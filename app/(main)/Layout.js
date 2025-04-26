import React from "react";

const MainLayout = async ({ children }) => {
  // Redirect to onboarding

  return <div className="container mx-auto mt-24 mb-32">{children}</div>;
};

export default MainLayout;