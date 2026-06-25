"use client"; // Required for state management in Next.js App Router

import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Card, Select, Label, ListBox, Button, Spinner } from "@heroui/react";
import { Search, MapPin, UserCheck } from "lucide-react";

// 📂 Importing the JSON data files dynamically
import districtsData from "@/data/districts.json";
import upazilasData from "@/data/upazilas.json";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function SearchDonors() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState(""); // Stores selected District Name
  const [upazila, setUpazila] = useState("");    // Stores selected Upazila Name

  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔍 Find the active district object to get its ID for upazila filtering
  const selectedDistrictObj = useMemo(() => {
    return districtsData.find((d) => d.name === district);
  }, [district]);

  // 🌾 Dynamically filter upazilas based on the selected district's ID
  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrictObj) return [];
    return upazilasData.filter((u) => u.district_id === selectedDistrictObj.id);
  }, [selectedDistrictObj]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!bloodGroup || !district || !upazila) {
      toast.error("Please select all search fields");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const queryParams = new URLSearchParams({
        bloodGroup,
        district,
        upazila,
      }).toString();

      // Native fetch API call
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/donors/search?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setDonors(data);
    } catch (error) {
      toast.error("Could not search donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-background py-16 px-4">
      <div className="mx-auto max-w-6xl">
        
        {/* Page Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Find a Blood Donor
          </h1>
          <p className="mt-4 text-large text-default-500">
            Search active donors by blood group and location instantly.
          </p>
        </div>

        {/* Search Form using HeroUI Compound Select */}
        <form
          onSubmit={handleSearch}
          className="grid gap-4 rounded-2xl bg-content1 p-6 shadow-lg border border-default-100 md:grid-cols-4 items-end"
        >
          {/* Blood Group Select */}
          <Select 
            className="w-full" 
            placeholder="Select Group"
            selectedKey={bloodGroup}
            onSelectionChange={(key) => setBloodGroup(key)}
          >
            <Label>Blood Group</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {bloodGroups.map((group) => (
                  <ListBox.Item id={group} key={group} textValue={group}>
                    {group}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Dynamic District Select */}
          <Select 
            className="w-full" 
            placeholder="Select District"
            selectedKey={district}
            onSelectionChange={(key) => {
              setDistrict(key);
              setUpazila(""); // Reset upazila when district changes
            }}
          >
            <Label>District</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-auto">
                {districtsData.map((dist) => (
                  <ListBox.Item id={dist.name} key={dist.id} textValue={dist.name}>
                    {dist.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Dynamic Upazila Select */}
          <Select 
            className="w-full" 
            placeholder="Select Upazila"
            isDisabled={!district}
            selectedKey={upazila}
            onSelectionChange={(key) => setUpazila(key)}
          >
            <Label>Upazila</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox className="max-h-60 overflow-y-auto">
                {filteredUpazilas.map((upz) => (
                  <ListBox.Item id={upz.name} key={upz.id} textValue={upz.name}>
                    {upz.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Search Button */}
          <Button
            type="submit"
            color="danger"
            size="lg"
            className="w-full font-semibold text-white shadow-md h-[40px]"
            isLoading={loading}
          >
            {!loading && <Search size={18} className="mr-2 inline" />}
            {loading ? "Searching..." : "Search Donors"}
          </Button>
        </form>

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-16 flex flex-col justify-center items-center gap-3">
            <Spinner color="danger" size="lg" />
            <p className="text-default-500">Looking for available donors...</p>
          </div>
        )}

        {/* No Donors Found State */}
        {!loading && hasSearched && donors.length === 0 && (
          <Card className="mt-10 max-w-xl mx-auto border border-default-100 bg-content1/50 backdrop-blur-md">
            <Card.Header>
              <Card.Title className="text-center text-xl text-danger">No Donor Found</Card.Title>
              <Card.Description className="text-center mt-2">
                We couldn't find any active donors matching your criteria. Try changing the blood group or nearby locations.
              </Card.Description>
            </Card.Header>
          </Card>
        )}

        {/* Donors Results Grid */}
        {!loading && donors.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Available Donors ({donors.length})
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor) => (
                <Card
                  key={donor._id}
                  className="border border-default-100 bg-content1 h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <Card.Header className="flex flex-col items-center pt-6 pb-2">
                    <img
                      src={donor.avatar}
                      alt={donor.name}
                      className="h-24 w-24 rounded-full object-cover border-2 border-danger shadow-sm mb-3"
                    />
                    <Card.Title className="text-xl font-bold text-foreground">{donor.name}</Card.Title>
                    <Card.Description className="mt-1 font-semibold text-danger">
                      Blood Group: {donor.bloodGroup}
                    </Card.Description>
                  </Card.Header>

                  <div className="px-6 py-2 flex-grow text-center text-default-500 text-sm flex items-center justify-center gap-1">
                    <MapPin size={16} className="text-danger" />
                    <span>{donor.upazila}, {donor.district}</span>
                  </div>

                  <Card.Footer className="flex justify-center pb-6 pt-2">
                    <span className="px-3 py-1 text-xs font-medium bg-success-50 text-success rounded-full border border-success-200 flex items-center gap-1">
                      <UserCheck size={12} /> Active Donor
                    </span>
                  </Card.Footer>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}