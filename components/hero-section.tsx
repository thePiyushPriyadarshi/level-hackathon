import { useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect } from "react";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Hero = () => {

  const fetchInsights = async (message: string) => {
    const url = `/api/chat`;
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ inputValue: message }),
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(
          `${response.status} ${response.statusText} - ${JSON.stringify(
            responseMessage
          )}`
        );
      }
      return responseMessage;
    } catch (error) {
      console.error("Request Error:", error);
    }
  };

  const [selectedOption, setSelectedOption] = useState("carousel");

  // Data for select box options
  const [ insights , setInsights ] = useState({
    "carousel": "•Carousels gather <b>60% as many likes</b> as reels and <b>75% as many likes</b> as static images.<br/>•Carousels receive <b>70% as many comments</b> as static images and <b>75% as many comments</b> as reels.<br/>•Carousels get equal shares compared to reels but <b>3% fewer shares</b> than static images.",
    "static": "•Static images receive <b>30% more likes</b> than carousels but <b>80% as many likes</b> as reels.<br/>•Static images gather <b>20% more comments</b> than carousels but <b>90% as many comments</b> as reels.<br/> • ⁠Static images get equal shares compared to reels but <b>1.03x more shares</b> than carousels.",
    "reel": "•Reels receive <b>1.3x more likes</b> than carousels and <b>25% more likes</b> than static images overall.<br/>•Reels generate <b>1.3x more comments</b> than static images and <b>1.5x more comments</b> than carousels.<br/>•Reels have <b>5% fewer shares</b> compared to static images and <b>1.03x fewer shares</b> than carousels."
});

  // Data for Pie Chart
  const pieData = {
    labels: ["Carousel", "Reel", "Static"],
    datasets: [
      {
        data: [39, 32, 28], // Example percentages
        backgroundColor: ["#6366F1", "#22D3EE", "#34D399"],
        hoverBackgroundColor: ["#4F46E5", "#0FB6CC", "#059669"],
      },
    ],
  };

  // Data for Bar Chart
  const barData = {
    labels: ["Carousel", "Reel", "Static Image"],
    datasets: [
      {
        label: "Likes",
        data: [7339, 11958, 9582], // Example data
        backgroundColor: "#6366F1",
      },
      {
        label: "Shares",
        data: [1794, 1720, 1725],
        backgroundColor: "#22D3EE",
      },
      {
        label: "Comments",
        data: [2932, 3895, 3534],
        backgroundColor: "#34D399",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };




   // UseEffect to fetch insights on page load
   useEffect(() => {
    const loadInsights = async () => {
      const message = "Fetch insights in % or x of carousel, reel and static. compare them with each other "; // Default message
      const fetchedData = await fetchInsights(message);
      if (fetchedData?.message) {
        //setInsights(fetchedData.message);
      }
    };
    loadInsights();
  }, []); // Empty dependency array ensures it runs only once on page load
 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Social media   {" "}
              <span className="text-indigo-600">Analytics tool</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
               Project build for Hackathon 2024. This project is a social media analytics tool that provides insights on the performance of different post types on social media. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
             
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="flex justify-end">
              <select
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="carousel">Carousel</option>
                <option value="static">Static</option>
                <option value="reel">Reel</option>
              </select>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Comparative Insights
              </h2>
              <div dangerouslySetInnerHTML={{ __html: insights[selectedOption] }}>
               
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Pie Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Post Type Distribution
            </h3>
            <Doughnut data={pieData} />
          </div>

          {/* Bar Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Post Performance
            </h3>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
