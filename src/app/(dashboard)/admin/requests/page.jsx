"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Dropdown, Button, Chip, Spinner, Label } from "@heroui/react";
import { MoreVertical, CheckCircle2, XCircle, Clock, Droplet, MapPin, Calendar, Phone, RefreshCw } from "lucide-react";

export default function PublicRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/requests");
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Could not load data from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequests((prev) =>
          prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
        );
        toast.success(`Status updated to ${newStatus}!`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-default-800 dark:text-default-100 flex items-center gap-2">
            <Droplet className="text-danger animate-pulse" size={24} fill="currentColor" />
            Public Blood Requests
          </h1>
          <p className="text-xs text-default-400 font-medium">
            Review emergency blood requests live from "blood-data".
          </p>
        </div>
        <Button isIconOnly variant="flat" radius="lg" size="sm" onPress={fetchRequests} isDisabled={loading}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="w-full h-64 flex justify-center items-center">
          <Spinner color="danger" label="Fetching live data..." />
        </div>

      /* Empty */
      ) : requests.length === 0 ? (
        <div className="w-full h-48 border border-dashed border-default-300 rounded-2xl flex flex-col justify-center items-center text-default-400 bg-content1/50">
          <Droplet size={32} className="mb-2 text-default-300" />
          <p className="text-sm font-medium">No blood requests found in DB</p>
        </div>

      /* Table */
      ) : (
        <div className="w-full bg-content1 text-foreground border border-default-200/60 rounded-2xl shadow-sm overflow-hidden p-1">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-default-200/60 text-[11px] font-bold text-default-500 uppercase tracking-wider bg-default-100/40">
                  <th className="py-4 px-6 w-16 text-center rounded-tl-xl">#</th>
                  <th className="py-4 px-6">Patient Name</th>
                  <th className="py-4 px-6 text-center">Blood Group</th>
                  <th className="py-4 px-6">Hospital & Location</th>
                  <th className="py-4 px-6">Required Info</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center w-24 rounded-tr-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default-100/70 font-medium">
                {requests.map((request, index) => (
                  <tr key={request._id} className="hover:bg-default-50/80 transition-colors duration-200">

                    {/* # */}
                    <td className="py-4 px-6 text-center text-default-400 font-mono text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    {/* Patient Name */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-default-800 dark:text-default-200 block">
                        {request.patientName || "Anonymous"}
                      </span>
                      <span className="text-[11px] text-default-400 flex items-center gap-1 mt-0.5 font-normal">
                        <Phone size={11} /> {request.contactNumber || "N/A"}
                      </span>
                    </td>

                    {/* Blood Group */}
                    <td className="py-4 px-6 text-center">
                      <Chip size="sm" variant="solid" color="danger" className="font-bold text-xs">
                        {request.bloodGroup}
                      </Chip>
                    </td>

                    {/* Hospital & Location */}
                    <td className="py-4 px-6 max-w-xs">
                      <span className="text-default-700 font-semibold line-clamp-1 flex items-start gap-1">
                        <MapPin size={14} className="text-danger shrink-0 mt-0.5" />
                        {request.hospitalName || "Not Specified"}
                      </span>
                      <span className="text-[11px] text-default-400 font-normal pl-4 block line-clamp-1">
                        {request.location}
                      </span>
                    </td>

                    {/* Required Info */}
                    <td className="py-4 px-6">
                      <span className="text-default-600 text-xs flex items-center gap-1 font-normal">
                        <Calendar size={13} /> {request.donationDate || "N/A"}
                      </span>
                      <span className="text-[11px] text-danger font-bold mt-0.5 block">
                        {request.bagsCount || 1} Bag(s) Needed
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          request.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : request.status === "REJECTED"
                            ? "bg-rose-50 text-rose-600 border-rose-100"
                            : "bg-warning-50 text-warning-600 border-warning-100"
                        }`}
                      >
                        {request.status === "APPROVED" ? <CheckCircle2 size={12} /> 
                          : request.status === "REJECTED" ? <XCircle size={12} /> 
                          : <Clock size={12} />}
                        {request.status || "PENDING"}
                      </span>
                    </td>

                    {/* Actions — HeroUI v3 */}
                    <td className="py-4 px-6 text-center relative">
                      <Dropdown>
                        <Button
                          isIconOnly
                          variant="ghost"
                          size="sm"
                          aria-label="Request Actions"
                          isLoading={updatingId === request._id}
                          className="text-default-400"
                        >
                          <MoreVertical size={16} />
                        </Button>

                        <Dropdown.Popover placement="bottom end">
                          <Dropdown.Menu
                            onAction={(key) => {
                              if (key === "approve") updateRequestStatus(request._id, "APPROVED");
                              if (key === "reject") updateRequestStatus(request._id, "REJECTED");
                            }}
                          >
                            <Dropdown.Item id="approve" textValue="Approve">
                              <div className="flex items-center gap-2 text-success">
                                <CheckCircle2 size={15} />
                                <Label>Approve</Label>
                              </div>
                            </Dropdown.Item>

                            <Dropdown.Item id="reject" textValue="Reject" variant="danger">
                              <div className="flex items-center gap-2">
                                <XCircle size={15} />
                                <Label>Reject</Label>
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}