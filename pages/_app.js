import ContainerBlock from "../components/ContainerBlock";
import "../styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <ContainerBlock>
      <ToastContainer limit={1} />
      <Component {...pageProps} />
    </ContainerBlock>
  );
}

export default MyApp;
