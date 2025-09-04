
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/010f2159-7ae2-4e7e-a71a-681407407a54.png" 
        alt="Bazaar Logo" 
        className="h-12 w-auto"
      />
    </Link>
  );
};

export default Logo;
