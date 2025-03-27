import axios from "axios";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const electricaURL = import.meta.env.VITE_ELECTRICA_API_URL;

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(
        `${electricaURL}/api/reviews/get-reviews`
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        setTestimonials(response.data);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      setTestimonials([])
      console.error("Error fetching testimonials:", error);
    }
  };
  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Client <span className="text-cyan-400">Testimonials</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say
            about their experience with Electrica.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Array.isArray(testimonials) &&
            testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50"
              >
                <Quote className="text-cyan-400 w-10 h-10 mb-4" />
                <p className="text-gray-300 mb-6">{testimonial.message}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {testimonial.occupation}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                {/* like option if want */}
              </div>
            ))}
        </div>
        {/* Add Review Button */}
        <div className="text-center mt-12">
          <Link
            to="/review" // Update this URL to match your review page route
            className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Star className="w-5 h-5 mr-2" />
            Give Us Your Review
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
