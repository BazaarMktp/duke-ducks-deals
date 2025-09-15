
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Expand } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
}

const ProductImageGallery = ({ images, title, currentImageIndex, onImageChange }: ProductImageGalleryProps) => {
  const [expandedImageIndex, setExpandedImageIndex] = useState(0);

  return (
    <div>
      <div className="mb-4 relative">
        <OptimizedImage
          src={images?.[currentImageIndex] || "/placeholder.svg"}
          alt={title}
          className="w-full h-96 object-cover rounded-lg"
          priority={currentImageIndex === 0}
          aspectRatio="video"
        />
        {images && images.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => setExpandedImageIndex(currentImageIndex)}
              >
                <Expand size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              <div className="flex flex-col items-center">
                {images.length > 1 ? (
                  <Carousel className="w-full max-w-3xl">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <OptimizedImage
                            src={image}
                            alt={`${title} ${index + 1}`}
                            className="w-full max-h-[70vh] object-contain mx-auto"
                            lazy={false}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                ) : (
                  <OptimizedImage
                    src={images[0]}
                    alt={`${title} 1`}
                    className="max-w-full max-h-[80vh] object-contain"
                    lazy={false}
                  />
                )}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setExpandedImageIndex(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden ${
                          index === expandedImageIndex ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <OptimizedImage
                          src={image}
                          alt={`${title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          aspectRatio="square"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
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
              <OptimizedImage
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
                aspectRatio="square"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
