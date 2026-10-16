import FaceExpression from "./Feature/expression/pages/FaceExpression";
import { ContextProvider } from "./Feature/expression/useContext";
function App() {
  return (
    <>
      <ContextProvider>
        <FaceExpression />
      </ContextProvider>
    </>
  );
}

export default App;
