import { createBrowserRouter } from "react-router";
import Chat from "../components/Chat";
import RootLayout from "../Layout/RootLayout";
import Home from "../page/Home/Home";
import EligibilityCalculator from "../page/EligibilityCalculator/EligibilityCalculator";
import FinalWaiver from "../page/FinalWaiver/FinalWaiver";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            { path: "eligibility-calculator", Component: EligibilityCalculator },
            { path: "waiver-calculator", Component: FinalWaiver }
        ]
    },
    {
        path: "/chat",
        element: <Chat></Chat>
    },
]);