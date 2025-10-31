import { useNavigate } from "react-router-dom";
import BrewMethodManager from "../../components/BrewMethodManager";
import { useAppContext } from "../AppContext";

const MethodsPage = () => {
  const navigate = useNavigate();
  const { handleMethodSelected } = useAppContext();

  const onMethodChange = (methodId: string) => {
    handleMethodSelected(methodId);
    navigate("/");
  };

  return <BrewMethodManager onMethodChange={onMethodChange} />;
};

export default MethodsPage;
