import { FaTools, FaClipboardCheck, FaLightbulb } from "react-icons/fa";
import pipingImage from "../../../assets/piping.jpg";
import concealedFittingImage from "../../../assets/Concealed-wiring.webp";
import panelBoardsImage from "../../../assets/Electrical-panel-board-installation-amp_-maintenance.jpg";

export const stages = [
  {
    id: 1,
    title: "Piping",
    description:
      "Installation of pipes to securely route electrical cables, ensuring proper wiring pathways.",
    detailedDescription:
      "This stage involves careful planning to ensure that the electrical system is both efficient and safe. Our expert team meticulously designs the piping layout, considering factors such as load distribution, future expansion, and ease of maintenance. We use high-quality materials that meet or exceed industry standards, ensuring longevity and reliability of the electrical infrastructure.",
    icon: <FaTools size={40} className="text-orange-500" />,
    image: pipingImage,
  },
  {
    id: 2,
    title: "Concealed Fitting",
    description:
      "Embedding conduits, boxes, and fittings within walls and ceilings for a clean, finished look.",
    detailedDescription:
      "This process not only enhances aesthetics but also protects the wiring from damage. Our skilled technicians employ advanced techniques to seamlessly integrate electrical components into the building structure. We pay special attention to proper insulation and spacing, ensuring optimal performance and minimizing the risk of electrical hazards. This stage sets the foundation for a safe and visually appealing electrical system.",
    icon: <FaClipboardCheck size={40} className="text-orange-500" />,
    image: concealedFittingImage,
  },
  {
    id: 3,
    title: "Panel Boards & Switchboards",
    description:
      "Installation of panel boards, lighting systems, and switchboards, bringing the project to life.",
    detailedDescription:
      "This stage is crucial for ensuring that the electrical supply is managed safely and effectively. Our team of certified electricians installs state-of-the-art panel boards and switchboards, incorporating the latest in circuit protection technology. We meticulously label and organize all components for easy identification and future maintenance. The lighting systems are carefully integrated, balancing energy efficiency with optimal illumination for each space.",
    icon: <FaLightbulb size={40} className="text-orange-500" />,
    image: panelBoardsImage,
  },
];
