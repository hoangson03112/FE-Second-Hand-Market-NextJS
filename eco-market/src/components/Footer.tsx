import React from "react";

const Footer = React.forwardRef<HTMLDivElement>(function Footer(props, ref) {
  return (
    <div ref={ref} {...props}>
      Footer
    </div>
  );
});
export default Footer;
