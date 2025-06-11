
interface HousingImageGalleryProps {
  images: string[];
  title: string;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
}

const HousingImageGallery = ({ 
  images, 
  title, 
  currentImageIndex, 
  onImageChange 
}: HousingImageGalleryProps) => {
  return (
    <div>
      <div className="mb-4">
        <img
          src={images?.[currentImageIndex] || "/placeholder.svg"}
          alt={title}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>
      {images && images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageChange(index)}
              className={`w-20 h-20 rounded-md overflow-hidden ${
                index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HousingImageGallery;
