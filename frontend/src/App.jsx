import { ContextProvider } from "./Feature/expression/useContext";
import { AuthProvider } from "./Feature/Auth/auth.context";
import AuthRoute from "./routes";
function App() {
  return (
    <>
      <AuthProvider>
        <ContextProvider>
          <AuthRoute />
        </ContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
