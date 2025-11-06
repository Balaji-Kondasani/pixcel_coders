
import { Check } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
    {
        name: "Hobby",
        description: "For individuals and personal projects.",
        price: "$0",
        priceDetail: "/month",
        buttonText: "Get Started",
        buttonLink: "/auth",
        isPopular: false,
        features: [
            "Unlimited public projects",
            "Real-time collaboration (2 users)",
            "Basic AI code completion",
            "Community support",
        ],
    },
    {
        name: "Pro",
        description: "For professional developers and teams.",
        price: "$15",
        priceDetail: "/month",
        buttonText: "Start 14-day Free Trial",
        buttonLink: "/auth",
        isPopular: true,
        features: [
            "Everything in Hobby, plus:",
            "Unlimited private projects",
            "Advanced AI assistance & debugging",
            "Priority support",
            "Team management features",
        ],
    },
    {
        name: "Enterprise",
        description: "For large organizations and custom needs.",
        price: "Let's Talk",
        priceDetail: "",
        buttonText: "Contact Sales",
        buttonLink: "/contact",
        isPopular: false,
        features: [
            "Everything in Pro, plus:",
            "Custom SSO & security controls",
            "Dedicated account manager",
            "On-premise deployment options",
            "Volume discounts",
        ],
    },
];

const PricingSection = () => {
    return (
        <section className="py-20 md:py-32 bg-black text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold">Choose the Plan That's Right for You</h1>
                    <p className="text-gray-400 mt-4">Start for free, and scale up as you grow. No hidden fees, cancel anytime.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan) => (
                        <div 
                            key={plan.name} 
                            className={`relative flex flex-col p-8 rounded-2xl border ${plan.isPopular ? 'border-blue-500 bg-[#111827]' : 'border-gray-800 bg-[#111111]'}`}
                        >
                            {plan.isPopular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="flex-grow">
                                <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
                                <p className="text-gray-400 mt-2">{plan.description}</p>
                                
                                <div className="mt-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.priceDetail && <span className="text-gray-400 ml-1">{plan.priceDetail}</span>}
                                </div>

                                <Link 
                                    href={plan.buttonLink} 
                                    className={`w-full text-center mt-8 inline-block py-3 px-6 rounded-lg font-semibold transition-colors ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                                >
                                    {plan.buttonText}
                                </Link>

                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
