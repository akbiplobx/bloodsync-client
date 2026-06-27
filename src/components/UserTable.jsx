"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dropdown,
  Button,
  Avatar,
  Label,
} from "@heroui/react";
import { MoreVertical, ShieldCheck, User, ShieldAlert, Ban, CheckCircle, Award } from "lucide-react";

export function UserTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [updatingId, setUpdatingId] = useState(null);

  const updateUserField = async (userId, field, value) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`User updated successfully! 🎉`);
        setUsers((prev) =>
          prev.map((user) => (user._id === userId ? { ...user, [field]: value } : user))
        );
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (error) {
      toast.error("Something went wrong connecting to server");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full bg-content1  border  rounded-2xl shadow-sm overflow-hidden p-1">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b  text-[11px] font-bold text-default-500 uppercase tracking-wider ">
              <th className="py-4 px-6 w-16 text-center rounded-tl-xl">#</th>
              <th className="py-4 px-6">User Profile</th>
              <th className="py-4 px-6">Email Address</th>
              <th className="py-4 px-6 text-center">Current Role</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center w-24 rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default-100/70  font-medium">
            {users?.map((user, index) => (
              <tr
                key={user._id}
                className="hover:bg-default-50/80 dark:hover:bg-default-100/20 transition-colors duration-200"
              >
                {/* # Index */}
                <td className="py-4 px-6 text-center text-default-400 font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </td>

                {/* User Profile */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={user.name ? user.name.toUpperCase() : "U"}
                      className="w-9 h-9 text-xs font-bold rounded-xl bg-gradient-to-br from-danger-400 to-danger-600 text-white shadow-sm"
                    />
                    <span className="font-semibold ">
                      {user.name || "Unknown User"}
                    </span>
                  </div>
                </td>

                {/* Email Address */}
                <td className="py-4 px-6 text-default-500 font-normal">
                  {user.email}
                </td>

                {/* Current Role */}
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg tracking-wide border ${
                      user.role?.toUpperCase() === "ADMIN"
                        ? "bg-purple-50 text-purple-600   border-purple-100 "
                        : user.role?.toUpperCase() === "VOLUNTEER"
                        ? "bg-blue-50 text-blue-600  border-blue-100 "
                        : "bg-default-50   border-default-200/60 "
                    }`}
                  >
                    {user.role?.toUpperCase() === "ADMIN" && <ShieldCheck size={13} />}
                    {user.role?.toUpperCase() === "VOLUNTEER" && <User size={13} />}
                    {user.role?.toUpperCase() === "DONOR" && <Award size={13} />}
                    {user.role || "DONOR"}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      user.status !== "BLOCKED"
                        ? "bg-emerald-50/60   "
                        : "bg-rose-50/60  "
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.status !== "BLOCKED" ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    {user.status === "BLOCKED" ? "BLOCKED" : "ACTIVE"}
                  </span>
                </td>

                {/* Actions Dropdown — HeroUI v3 API */}
                <td className="py-4 px-6 text-center relative">
                  <Dropdown>
                    <Button
                      aria-label="User Actions"
                      variant=""
                      isIconOnly
                      size="sm"
                      isLoading={updatingId === user._id}
                      className=""
                    >
                      <MoreVertical size={16} />
                    </Button>

                    <Dropdown.Popover placement="bottom end">
                      <Dropdown.Menu
                        onAction={(key) => {
                          if (key === "make-admin") updateUserField(user._id, "role", "admin");
                          if (key === "make-volunteer") updateUserField(user._id, "role", "volunteer");
                          if (key === "make-donor") updateUserField(user._id, "role", "donor");
                          if (key === "toggle-status")
                            updateUserField(
                              user._id,
                              "status",
                              user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED"
                            );
                        }}
                      >
                        <Dropdown.Item id="make-admin" textValue="Make Admin">
                          <div className="flex items-center gap-2">
                            <ShieldAlert size={15} className="text-purple-500" />
                            <Label>Admin</Label>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item id="make-volunteer" textValue="Make Volunteer">
                          <div className="flex items-center gap-2">
                            <User size={15} className="text-blue-500" />
                            <Label>Volunteer</Label>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item id="make-donor" textValue="Make Donor">
                          <div className="flex items-center gap-2">
                            <Award size={15} className="text-default-500" />
                            <Label>Donor</Label>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item
                          id="toggle-status"
                          textValue={user.status === "BLOCKED" ? "Unblock User" : "Block User"}
                          variant={user.status === "BLOCKED" ? undefined : "danger"}
                        >
                          <div className="flex items-center gap-2">
                            {user.status === "BLOCKED" ? (
                              <CheckCircle size={15} className="text-success" />
                            ) : (
                              <Ban size={15} />
                            )}
                            <Label>{user.status === "BLOCKED" ? "Unblock User" : "Block User"}</Label>
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
  );
}