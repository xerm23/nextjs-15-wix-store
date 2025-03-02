import { wixBrowserClient } from "@/lib/wix-client.browser";
import { AddToCardValues, addToCart, getCart, removeCartItem, updateCartItemQuantity, UpdateCartItemQuantityValues } from "@/wix-api/cart";
import { MutationKey, QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { currentCart } from "@wix/ecom";
import { useToast } from "./use-toast";

const queryKey: QueryKey = ["cart"]
export function useCart(initialData: currentCart.Cart | null) {
    return useQuery({
        queryKey,
        queryFn: () => getCart(wixBrowserClient),
        initialData
    });
}

export function useAddItemToCart() {
    const queryClient = useQueryClient();

    const { toast } = useToast();
    return useMutation({
        mutationFn: (values: AddToCardValues) => addToCart(wixBrowserClient, values),
        onSuccess(data) {
            toast({ description: "Item added to cart." })
            queryClient.cancelQueries({ queryKey })
            queryClient.setQueryData(queryKey, data.cart)
        },
        onError(error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to add item to cart. Please try again later."
            })
        }
    });
}

export function useUpdateCartItemQuantity() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const mutationKey: MutationKey = ["useUpdateCartItemQuantity"];
    return useMutation({
        mutationKey,
        mutationFn: (values: UpdateCartItemQuantityValues) => updateCartItemQuantity(wixBrowserClient, values),
        onMutate: async ({ productId, newQuantity }) => {
            await queryClient.cancelQueries({ queryKey });
            const previousState = queryClient.getQueryData<currentCart.Cart>(queryKey);

            queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
                ...oldData,
                lineItems: oldData?.lineItems?.map((item) =>
                    item._id === productId
                        ? { ...item, quantity: newQuantity }
                        : item)
            }));
            return { previousState };
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState);
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to update item quantity. Please try again later."
            });
        },
        onSettled() {
            if (queryClient.isMutating({ mutationKey }) === 1) {
                queryClient.invalidateQueries({ queryKey });
            }
        }
    });
}

export function useRemoveCartItem() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (productId: string) => removeCartItem(wixBrowserClient, productId),
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey });
            const previousState = queryClient.getQueryData<currentCart.Cart>(queryKey);

            queryClient.setQueryData<currentCart.Cart>(queryKey, (oldData) => ({
                ...oldData,
                lineItems: oldData?.lineItems?.filter((item) => item._id !== productId)
            }));
            return { previousState };
        },
        onError(error, variables, context) {
            queryClient.setQueryData(queryKey, context?.previousState);
            console.error(error);
            toast({
                variant: "destructive",
                description: "Failed to update item quantity. Please try again later."
            });
        },
        onSettled() {
            queryClient.invalidateQueries({ queryKey });
        }

    });
}