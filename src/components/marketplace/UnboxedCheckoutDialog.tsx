import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Package, Truck, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UnboxedCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle: string;
  productPrice: number;
}

const UnboxedCheckoutDialog = ({
  open,
  onOpenChange,
  productTitle,
  productPrice,
}: UnboxedCheckoutDialogProps) => {
  const [step, setStep] = useState<"details" | "payment" | "confirmation">("details");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [dormAddress, setDormAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderNumber, setOrderNumber] = useState("");
  const { toast } = useToast();

  const deliveryFee = 15;
  const installationFee = 25;
  const total = productPrice + deliveryFee + installationFee;

  const handleNextStep = () => {
    if (step === "details" && (!deliveryDate || !dormAddress)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all delivery details",
        variant: "destructive",
      });
      return;
    }
    
    if (step === "details") {
      setStep("payment");
    } else if (step === "payment") {
      // Generate mock order number
      const orderNum = `UNB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setOrderNumber(orderNum);
      setStep("confirmation");
    }
  };

  const handleClose = () => {
    setStep("details");
    setDeliveryDate("");
    setDormAddress("");
    setPaymentMethod("card");
    setOrderNumber("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Unboxed Service - {step === "details" ? "Delivery Details" : step === "payment" ? "Payment" : "Confirmation"}
          </DialogTitle>
        </DialogHeader>

        {step === "details" && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{productTitle}</h3>
              <p className="text-sm text-muted-foreground">Full-Service Package Includes:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Delivery to your dorm room
                </li>
                <li className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Professional installation & setup
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  30-day warranty included
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dorm-address">Dorm Address *</Label>
                <Input
                  id="dorm-address"
                  placeholder="Building name and room number"
                  value={dormAddress}
                  onChange={(e) => setDormAddress(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="delivery-date">Preferred Delivery Date *</Label>
                <Input
                  id="delivery-date"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Product Price</span>
                <span>${productPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Installation Fee</span>
                <span>${installationFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleNextStep} className="w-full">
              Continue to Payment
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order Summary</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Delivery to: {dormAddress}
              </p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(deliveryDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venmo" id="venmo" />
                  <Label htmlFor="venmo" className="cursor-pointer">Venmo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cashapp" id="cashapp" />
                  <Label htmlFor="cashapp" className="cursor-pointer">Cash App</Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleNextStep} className="w-full">
              Complete Purchase
            </Button>
          </div>
        )}

        {step === "confirmation" && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-green-600 mb-2">Order Confirmed!</h3>
              <p className="text-muted-foreground">
                Your order has been successfully placed
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-lg font-mono font-semibold">{orderNumber}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Delivery Address</p>
                <p className="font-medium">{dormAddress}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Delivery</p>
                <p className="font-medium">{new Date(deliveryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-xl font-semibold">${total.toFixed(2)}</p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>You will receive a confirmation email shortly.</p>
              <p>Our team will contact you 24 hours before delivery.</p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnboxedCheckoutDialog;
