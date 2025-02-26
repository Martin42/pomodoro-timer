import "./App.css";
import Tasks from "./components/Tasks";
import Timer from "./components/Timer";

import { Slide, toast, ToastContainer } from "react-toastify";

function App() {
  const infoToast = (info: string) => {
    toast.info(info, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
      className: "custom-toast",
    });
  };

  const warningToast = (warning: string) => {
    toast.warn(warning, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
      className: "custom-toast",
    });
  };

  return (
    <main>
      <Timer infoToast={infoToast} />
      <Tasks infoToast={infoToast} warningToast={warningToast} />
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        className="custom-toast-wrapper"
      />
    </main>
  );
}

export default App;
