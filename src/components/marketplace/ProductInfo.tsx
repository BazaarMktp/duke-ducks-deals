
interface ProductInfoProps {
  title: string;
  price: number;
  description: string;
}

const ProductInfo = ({ title, price, description }: ProductInfoProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-3xl font-bold text-green-600 mb-6">${price}</p>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
