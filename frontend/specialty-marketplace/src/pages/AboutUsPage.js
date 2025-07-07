import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";

const AboutUsPage = () => {
  const portfolioUrl = "https://josephdanthikolla.netlify.app/";

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        
        <motion.iframe
          src={portfolioUrl}
          title="Joseph Danthikolla's Portfolio"
          className="w-full h-full border-0" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </main>
    </div>
  );
};

export default AboutUsPage;
