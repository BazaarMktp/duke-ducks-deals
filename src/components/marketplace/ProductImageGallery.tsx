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
      {/* Main image */}
      <div className="relative rounded-xl overflow-hidden bg-muted">
        <OptimizedImage
          src={images?.[currentImageIndex] || "/placeholder.svg"}
          alt={title}
          className="w-full aspect-square sm:aspect-[4/3] object-cover"
          priority={currentImageIndex === 0}
        />
        {images && images.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-3 right-3 h-9 w-9 bg-background/80 backdrop-blur-sm border-0 shadow-sm hover:bg-background"
                onClick={() => setExpandedImageIndex(currentImageIndex)}
              >
                <Expand size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-2">
              <div className="flex flex-col items-center">
                {images.length > 1 ? (
                  <Carousel className="w-full max-w-3xl">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <OptimizedImage
                            src={image}
                            alt={`${title} ${index + 1}`}
                            className="w-full max-h-[75vh] object-contain mx-auto rounded-lg"
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
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    lazy={false}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        {/* Image counter */}
        {images && images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images && images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageChange(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden transition-all ${
                index === currentImageIndex 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'opacity-60 hover:opacity-100'
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
