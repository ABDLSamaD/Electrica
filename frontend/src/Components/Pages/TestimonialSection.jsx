import axios from "axios";
import { Star, Quote, ThumbsUp, ThumbsDown } from "lucide-react";
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
      if (response.status === 200) {
        setTestimonials(response.data);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleLike = async (reviewId) => {
    try {
      const response = await axios.put(
        `${electricaURL}/api/reviews/like-review/${reviewId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update the testimonials state to reflect the new like/dislike count
        fetchTestimonials();
        setTestimonials(
          testimonials.map((testimonial) => {
            if (testimonial._id === reviewId) {
              return {
                ...testimonial,
                likes: response.data.likes,
              };
            }
            return testimonial;
          })
        );
      } else {
        console.log("Error updating like:");
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

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
          {testimonials.map((testimonial, index) => (
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
              {/* like shown */}
              <div className="flex items-center gap-4 mt-4">
                <span className="text-gray-400 text-sm">
                  {testimonial.likes || 0} likes
                </span>
              </div>
              {/* like option */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => handleLike(testimonial._id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{testimonial.likes || 0}</span>
                </button>
              </div>
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
