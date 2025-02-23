"use client";

import AddToCartButton from "@/components/AddToCartButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Badge from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { checkInStock, findVariant } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { products } from "@wix/stores";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import ProductMedia from "./ProductMedia";
import ProductOptions from "./ProductOptions";
import ProductPrice from "./ProductPrice";

interface ProductDetailsProps {
  product: products.Product;
}
export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0].description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {},
  );

  const selectedVariant = findVariant(product, selectedOptions);
  const inStock = checkInStock(product, selectedOptions);

  const availableQuantity =
    selectedVariant?.stock?.quantity ?? product.stock?.quantity;

  const avaialableQuantityExceeded =
    !!availableQuantity && quantity > availableQuantity;

  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === selectedOptions[option.name || ""],
    );
    return selectedChoice?.media?.items ?? [];
  });

  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia
        media={
          !!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items
        }
      />
      <div className="basis-3/5">
        <div className="space-y-2.5">
          <h1 className="text-3xl font-bold lg:text-4xl"> {product.name}</h1>
          {product.brand && (
            <div className="text-muted-foreground"> {product.brand} </div>
          )}
          {product.ribbon && <Badge classname="block">{product.ribbon}</Badge>}
          {product.description && (
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
              className="prose dark:prose-invert"
            ></div>
          )}
          <ProductPrice product={product} selectedVariant={selectedVariant} />
          <ProductOptions
            product={product}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
          />
          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24"
              disabled={!inStock}
            />
            {!!availableQuantity &&
              (avaialableQuantityExceeded || availableQuantity < 10) && (
                <span className="text-destructive">
                  Only {availableQuantity} left in stock.
                </span>
              )}
          </div>
          {inStock 
          ? (
            <AddToCartButton
            product={product}
            selectedOptions={selectedOptions}
            quantity={quantity}/>
          )
        : (
          "Out of stock"
        )}
          {!!product.additionalInfoSections?.length && (
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <InfoIcon className="size-5" />
                <span>Additional product information</span>
              </span>
              <Accordion type="multiple">
                {product.additionalInfoSections?.map((section) => (
                  <AccordionItem
                    value={section.title || ""}
                    key={section.title}
                  >
                    <AccordionTrigger>{section.title} </AccordionTrigger>
                    <AccordionContent>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: section.description || "",
                        }}
                        className="prose dark:prose-invert text-sm text-muted-foreground"
                      ></div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
