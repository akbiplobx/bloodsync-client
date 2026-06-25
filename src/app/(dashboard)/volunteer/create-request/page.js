"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { FieldError, Input, Label, TextField, Select, ListBox, TextArea, Button, Card } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from '@/lib/auth-client'; 

export default function CreateRequestPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [userEmail, setUserEmail] = useState("user@example.com");

  // Fetch current user email from active session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };
    fetchUser();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const requestData = Object.fromEntries(formData.entries());
    
    // Attach additional fields for backend tracking
    requestData.requesterEmail = userEmail;
    requestData.status = "Pending";

    console.log("Submitting Blood Request Data:", requestData);

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    try {
      // Generate and attach JWT token for authorization security
      const tokenObj = await authClient.token();
      const tokenData = tokenObj?.token || tokenObj?.data?.token || tokenObj;

      const headers = {
        'content-type': 'application/json'
      };

      if (tokenData) {
        headers.authorization = `Bearer ${tokenData}`;
      }

      // Hit the backend API route to save blood request data
      const res = await fetch(`${serverUrl}/create-request`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
      });

      if (res.ok) {
        toast.success("Blood request created successfully!");
        
        // Redirect user to My Requests list view on success
        setTimeout(() => {
          router.push("/dashboard/my-requests");
        }, 2000);
        
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData?.message || "Server responded with an error.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Cannot connect to server! Did you forget to start your backend?");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="mb-6">
        <h1 className="text-2xl font-black text-black dark:text-white">Create a Blood Request</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Fill out the details below to request urgent blood for a patient in need.
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50" shadow="sm">
        <form onSubmit={onSubmit} className="p-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Patient Name */}
            <div className="md:col-span-2">
              <TextField name="patientName" isRequired>
                <Label>Patient Name</Label>
                <Input placeholder="e.g. John Doe" className="rounded-2xl" />
                <FieldError />
              </TextField>
            </div>

            {/* Blood Group Selection */}
            <div>
              <Select
                name="bloodGroup"
                isRequired
                className="w-full"
                placeholder="Select Blood Group"
              >
                <Label>Required Blood Group</Label>
                <Select.Trigger className="rounded-2xl">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="A+" textValue="A+">A+ <ListBox.ItemIndicator /></ListBox.Item>
                    <ListBox.Item id="A-" textValue="A-">A- <ListBox.ItemIndicator /></ListBox.Item>
                    <ListBox.Item id="B+" textValue="B+">B+ <ListBox.ItemIndicator /></ListBox.Item>
                    <ListBox.Item id="B-" textValue="B-">B- <ListBox.ItemIndicator /></ListBox.Item>
                    <ListBox.Item id="O+" textValue="O+">O+ <ListBox.ItemIndicator /></ListBox.Item>
                    <ListBox.Item id="O-" textValue="O-">O- <ListBox.ItemIndicator /></ListBox.Item>
                    <ListBox.Item id="AB+" textValue="AB+">AB+ <ListBox.ItemIndicator /></ListBox.Item>
                    <ListBox.Item id="AB-" textValue="AB-">AB- <ListBox.ItemIndicator /></ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Bags Count */}
            <TextField name="bagsCount" type="number" isRequired>
              <Label>Number of Bags Needed</Label>
              <Input type="number" min="1" placeholder="e.g. 2" className="rounded-2xl" />
              <FieldError />
            </TextField>

            {/* Hospital Name */}
            <div className="md:col-span-2">
              <TextField name="hospitalName" isRequired>
                <Label>Hospital Name</Label>
                <Input placeholder="e.g. Dhaka Medical College Hospital" className="rounded-2xl" />
                <FieldError />
              </TextField>
            </div>

            {/* Donation Date */}
            <TextField name="donationDate" type="date" isRequired>
              <Label>Donation Date / Deadline</Label>
              <Input type="date" className="rounded-2xl" />
              <FieldError />
            </TextField>

            {/* Contact Number */}
            <TextField name="contactNumber" isRequired>
              <Label>Contact Number</Label>
              <Input placeholder="e.g. +8801XXXXXXXXX" className="rounded-2xl" />
              <FieldError />
            </TextField>

            {/* Location Area */}
            <div className="md:col-span-2">
              <TextField name="location" isRequired>
                <Label>Hospital Location / Full Address</Label>
                <Input placeholder="e.g. Shahbagh, Dhaka" className="rounded-2xl" />
                <FieldError />
              </TextField>
            </div>

            {/* Requester Email (Read Only) */}
            <div className="md:col-span-2">
              <TextField name="requesterEmail" value={userEmail} isReadOnly>
                <Label>Requester Email</Label>
                <Input className="rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500" />
              </TextField>
            </div>

            {/* Medical Description / Details */}
            <div className="md:col-span-2">
              <TextField name="description" isRequired>
                <Label>Additional Info / Reason for Blood</Label>
                <TextArea
                  placeholder="Describe the medical emergency, specific timing, or any particular notes for the donor..."
                  className="rounded-3xl"
                />
                <FieldError />
              </TextField>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isPending}
            className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white font-bold h-12 rounded-xl shadow-md transition-colors duration-200"
          >
            {isPending ? "Creating Request..." : "Post Blood Request"}
          </Button>

        </form>
      </Card>
    </div>
  );
}