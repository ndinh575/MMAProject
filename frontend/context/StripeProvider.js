import React, { createContext, useContext, useEffect } from "react";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";

const StripeContext = createContext();

export const StripeProviderComponent = ({ children }) => {
    const publishableKey = "pk_test_51R2zj3PF5aAiqJ79JLehru95lrOfad6RKTZvSgQehVVuXARv7lIGGTvUqbL1a8za5o8jxfFFEiFqC1JknrWgUIXw00wWUC2FoE"; // Replace with your Stripe publishable key

    return (
        <StripeProvider publishableKey={publishableKey}>
            <StripeContext.Provider value={{}}>
                {children}
            </StripeContext.Provider>
        </StripeProvider>
    );
};

export const useStripeContext = () => useContext(StripeContext);
