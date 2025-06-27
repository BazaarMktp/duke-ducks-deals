
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/ab5a5857-7332-4da1-b76a-f8de90b92080.png" 
        alt="Bazaar Logo" 
        className="h-16 w-auto"
      />
    </Link>
  );
};

export default Logo;
