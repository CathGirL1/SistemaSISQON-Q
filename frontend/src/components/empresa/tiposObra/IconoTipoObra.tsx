import {
  FaHome,
  FaHammer,
  FaBuilding,
  FaFire,
  FaWarehouse,
  FaBorderAll,
  FaHardHat,
} from "react-icons/fa";

type Props = {
  nombre: string;
};

export default function IconoTipoObra({ nombre }: Props) {
  const nombreNormalizado = nombre.toLowerCase();

  if (nombreNormalizado.includes("quincho")) {
    return <FaHome />;
  }

  if (nombreNormalizado.includes("reforma")) {
    return <FaHammer />;
  }

  if (nombreNormalizado.includes("construcción")) {
    return <FaBuilding />;
  }

  if (nombreNormalizado.includes("parrillero")) {
    return <FaFire />;
  }

  if (nombreNormalizado.includes("techo")) {
    return <FaWarehouse />;
  }

  if (nombreNormalizado.includes("cerramiento")) {
    return <FaBorderAll />;
  }

  return <FaHardHat />;
}