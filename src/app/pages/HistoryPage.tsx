import { useNavigate } from "react-router-dom";
import BrewingHistory from "../../components/BrewingHistory";
import { useAppContext } from "../AppContext";
import type { BrewingSession } from "../../types/coffee";

const HistoryPage = () => {
  const navigate = useNavigate();
  const { historyKey, handleBrewAgain } = useAppContext();

  const onBrewAgain = (session: BrewingSession) => {
    handleBrewAgain(session);
    navigate("/");
  };

  return <BrewingHistory key={historyKey} onBrewAgain={onBrewAgain} />;
};

export default HistoryPage;
