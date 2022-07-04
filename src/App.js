import CreateExpense from "./components/expense/CreateExpense";
import {GetExpenses} from "./components/expense/GetExpenses";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function App() {
  return (
      <>
          <CreateExpense BASE_URL={BASE_URL}/>
          <GetExpenses BASE_URL={BASE_URL}/>
      </>
  );
}

export default App;
