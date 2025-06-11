
import { Button } from "@/components/ui/button";

interface ServicesHeaderProps {
  user: any;
  onPostService: () => void;
}

const ServicesHeader = ({ user, onPostService }: ServicesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Services</h1>
      {user && (
        <Button onClick={onPostService}>+ Post Service</Button>
      )}
    </div>
  );
};

export default ServicesHeader;
