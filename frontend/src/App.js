import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.scss";

import Context from "./Context";
import Display from "./components/Display";

export default function App() {
  return (
    <Context>
      <Display />
    </Context>
  );
}
