import {
  AlertCircle,
  Clock,
  MapPin,
  User2,
  PenTool as Tools,
} from "lucide-react";

const Karigar = ({
  karigars,
  setSelectedKarigar,
  setShowForm,
  renderRatingStars,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {karigars.map((karigar) => (
        <div
          key={karigar.id}
          className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 border border-white/10 hover:border-white/30 group"
          onClick={() => {
            setSelectedKarigar(karigar);
            setShowForm(true);
          }}
        >
          <div className="flex items-start flex-wrap gap-4">
            <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
              <User2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-auto sm:flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-1">
                    {karigar.name}
                  </h3>
                  <p className="text-white/80 flex items-center gap-2">
                    <Tools className="w-4 h-4" /> {karigar.specialty}
                  </p>
                </div>
                <span className="px-4 py-2 text-center  bg-green-500/20 text-green-400 rounded-full text-sm">
                  {karigar.availability}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-6">
                  <p className="text-white/90 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {karigar.experience}
                  </p>
                  <p className="text-white/90 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {karigar.completedJobs}{" "}
                    jobs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <p className="text-white/80">{karigar.location}</p>
                </div>

                <div className="flex items-start justify-between sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center mt-4">
                  {renderRatingStars(karigar.rating)}
                  <span className="text-white/90 font-semibold">
                    {karigar.charges}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Karigar;
