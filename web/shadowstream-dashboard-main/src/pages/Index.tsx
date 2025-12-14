import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Problems } from '@/components/landing/Problems';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { PolygonStrip } from '@/components/landing/PolygonStrip';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <Hero />
        <Problems />
        <HowItWorks />
        <Features />
        <PolygonStrip />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
