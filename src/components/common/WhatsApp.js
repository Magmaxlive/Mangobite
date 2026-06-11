"use client";

import { FloatingWhatsApp } from "react-floating-whatsapp";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function WhatsApp() {
  const { cartOpen } = useCart()
  if (cartOpen) return null
  return (
    <>
      <Link
        href="/shop"
        className="bg-primary hover:bg-secondary text-white transition-colors duration-200"
        style={{
          position: "fixed",
          bottom: "84px",
          right: "24px",
          zIndex: 9999,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "10px",
          textDecoration: "none",
          lineHeight: "1.4",
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        SHOP<br/>NOW
      </Link>

      <FloatingWhatsApp
        phoneNumber="64277224561"
        accountName="Mangobite"
        chatMessage="Hi 👋 How can we help you?"
        avatar="/images/icon.png"
        buttonStyle={{
          width: "50px",
          height: "50px",
          bottom: "20px",
          right: "24px",
        }}
      />
    </>
  );
}
