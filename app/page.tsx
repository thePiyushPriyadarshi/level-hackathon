"use client";
import Chatbot from "@/components/chat-bot";
import Hero from "@/components/hero-section";
export default function Home() {
  
  return (
    <div >
      <Hero/>

      <Chatbot
        themeColor="#007BFF" 
      />
    </div>
  );
}
