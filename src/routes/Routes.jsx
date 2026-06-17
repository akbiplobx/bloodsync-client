import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import MyRequests from "../pages/Dashboard/MyRequests";
import AddPet from "../pages/Dashboard/AddPet";
import MyListings from "../pages/Dashboard/MyListings";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  // ... আপনার মেইন রুটস (Home, All Pets ইত্যাদি)
  
  // ড্যাশবোর্ড রুটস (সম্পূর্ণ প্রাইভেট)
  {
    path: "/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: "my-requests", // ইউজার ভিজিট করবে: /dashboard/my-requests
        element: <MyRequests />
      },
      {
        path: "add-pet", // ইউজার ভিজিট করবে: /dashboard/add-pet
        element: <AddPet />
      },
      {
        path: "my-listings", // ইউজার ভিজিট করবে: /dashboard/my-listings
        element: <MyListings />
      }
    ]
  }
]);

export default router;