import Link from "next/link";
import React, { ReactNode } from "react";
import { useRouter } from "next/router";

type LinkProps = {
  href: string;
  children: ReactNode;
  activeclass: string;
  linkClassName: string;
};

const ActiveLink = ({ children, linkClassName, ...props }: LinkProps) => {
  const { pathname } = useRouter();
  let className = linkClassName || "";
  let _defaultClass = `${className} text-gray-100`;

  if (pathname === props.href) {
    className = `${className} text-indigo-400 ${props.activeclass}`;
  } else {
    className = _defaultClass;
  }

  return (
    <Link {...props} className={className}>
      {children}
    </Link>
  );
};

export default ActiveLink;
