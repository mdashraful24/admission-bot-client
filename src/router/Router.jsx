import { createBrowserRouter } from "react-router";
import App from "../App";
import Chat from "../components/Chat";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App></App>
    },
    {
        path: "/chat",
        element: <Chat></Chat>
    },
]);