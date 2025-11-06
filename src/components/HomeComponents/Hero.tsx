import Link from 'next/link';

const HeroSection = () => {
  return (
    // This main element has a dark background color (#0A0A0A) applied via a Tailwind class.
    // On top of that, an inline style applies a radial gradient for the subtle glow effect.
    <main 
      className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#0A0A0A]" 
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(38, 78, 112, 0.3), transparent 70%)'
      }}
    >
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            The Ultimate <span className="text-blue-500">AI-Powered</span> Coding Playground
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Code, collaborate, and innovate with a community of passionate developers. Our platform combines real-time editing, AI assistance, and gamified challenges to supercharge your skills.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Start Coding for Free
            </Link>
            <Link href="/#features" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out">
              Explore Features
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
