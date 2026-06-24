"use client";

import React, { useEffect, useState } from "react";
import { 
  Spinner, 
  Button, 
  Chip, 
  Pagination, 
  Modal, 
  Input 
} from "@heroui/react";

export default function FundingHistoryPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/donations`)
      .then((res) => res.json())
      .then((data) => {
        setDonations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const totalAmount = donations.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalPages = Math.ceil(donations.length / itemsPerPage);
  const currentItems = donations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="flex justify-center py-20"><Spinner color="danger" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 md:mb-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Funding History</h1>
        <h2 className="text-lg md:text-2xl font-bold text-green-600">Total: ${totalAmount.toFixed(2)}</h2>

        {/* Modal implementation fixed */}
        <Modal>
          <Button className="bg-red-600 text-white hover:bg-red-700">Give Fund</Button>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Make a Contribution</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <p className="mb-4 text-gray-600">Enter the amount you wish to donate:</p>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    startContent={<span className="text-default-400">$</span>}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <form action="/api/subscription" method="POST">
                    <Button type="submit" className="w-full bg-red-600 text-white" slot="close">
                    Confirm & Pay
                  </Button>
                  </form>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>

      <div className="overflow-x-auto shadow-sm rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b">{item.funderName}</td>
                  <td className="p-4 border-b text-gray-600">{item.transactionId || "N/A"}</td>
                  <td className="p-4 border-b text-gray-600">{new Date(item.fundingDate).toLocaleDateString()}</td>
                  <td className="p-4 border-b font-bold text-green-600">+${item.amount}</td>
                  <td className="p-4 border-b"><Chip color="success" size="sm" variant="flat">SUCCESS</Chip></td>
                  <td className="p-4 border-b"><Button size="sm" variant="light" isIconOnly>💰</Button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage} 
            color="danger"
            variant="flat"
            size="md"
          />
        </div>
      )}
    </div>
  );
}