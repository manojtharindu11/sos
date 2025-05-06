import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

const BreadcrumbNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const handleBack = () => {
    navigate(-1); // navigate to previous page
  };

  const generatePath = (index) => {
    return "/" + pathnames.slice(0, index + 1).join("/");
  };

  const breadCrumpItem = (index, path, label) => {
    return (
      <BreadcrumbItem key={index}>
        <BreadcrumbLink onClick={() => navigate(path)}>{label}</BreadcrumbLink>
      </BreadcrumbItem>
    );
  };

  const generateBreadCrumpItems = pathnames.map((name, index) => {
    const path = generatePath(index);
    const label = name.charAt(0).toLowerCase() + name.slice(1);
    return breadCrumpItem(index, path, label);
  });

  return (
    <Breadcrumb mb={4}>
      <BreadcrumbItem>
        <BreadcrumbLink onClick={handleBack}>..</BreadcrumbLink>
      </BreadcrumbItem >

      {generateBreadCrumpItems}
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
