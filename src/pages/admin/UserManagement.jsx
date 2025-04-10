import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { fireDB } from "../../firebase";
import { toast } from "react-toastify";
import Aside from "../../components/Aside";
import Loader from "../../components/Loader";
import { MdDelete, MdCheck } from "react-icons/md";
import { FiEdit } from "react-icons/fi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    role: "user",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const userRef = collection(fireDB, "user");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(userRef);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    setActionInProgress(true);
    try {
      await deleteDoc(doc(fireDB, "user", id));
      toast.success("User deleted.");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user.");
    }
    setActionInProgress(false);
  };

  const handleEditSave = async () => {
    const { firstName, lastName, username, role } = editUser;

    if (!firstName || !lastName || !username || !role) {
      toast.error("All fields are required.");
      return;
    }

    setActionInProgress(true);
    try {
      await updateDoc(doc(fireDB, "user", editId), {
        firstName,
        lastName,
        username,
        role,
      });
      toast.success("User updated.");
      setEditId(null);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user.");
    }
    setActionInProgress(false);
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FFF7F0] font-sans">
      <Aside />
      <main className="flex-1 ml-72 p-10">
        <h2 className="text-3xl font-bold text-[#F59E0B] mb-6">
          User Management
        </h2>

        <input
          type="text"
          placeholder="Search by first or last name..."
          className="border px-4 mb-6 py-2 w-full max-w-sm rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Users Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#F59E0B] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">First Name</th>
                  <th className="px-4 py-3 text-left">Last Name</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-3">
                      {editId === user.id ? (
                        <input
                          type="text"
                          value={editUser.firstName}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              firstName: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleEditSave()
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        user.firstName
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === user.id ? (
                        <input
                          type="text"
                          value={editUser.lastName}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              lastName: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleEditSave()
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        user.lastName
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === user.id ? (
                        <input
                          type="text"
                          value={editUser.username}
                          onChange={(e) =>
                            setEditUser({
                              ...editUser,
                              username: e.target.value,
                            })
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleEditSave()
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        user.username
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === user.id ? (
                        <select
                          value={editUser.role}
                          onChange={(e) =>
                            setEditUser({ ...editUser, role: e.target.value })
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            user.role === "admin"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2 items-center">
                      {editId === user.id ? (
                        <button
                          onClick={handleEditSave}
                          disabled={actionInProgress}
                          className="text-green-600 p-2 border rounded hover:bg-green-100"
                        >
                          <MdCheck />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditId(user.id);
                            setEditUser({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              username: user.username,
                              role: user.role,
                            });
                          }}
                          className="text-blue-600 p-2 border rounded hover:bg-blue-100"
                        >
                          <FiEdit />
                        </button>
                      )}
                      {user.role === "admin" ? (
                        <span
                          className="text-gray-400 p-2 border rounded cursor-not-allowed"
                          title="Admin user cannot be deleted"
                        >
                          <MdDelete />
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setDeleteTargetId(user.id);
                            setShowConfirmModal(true);
                          }}
                          className="text-red-600 p-2 border rounded hover:bg-red-100"
                          disabled={actionInProgress}
                        >
                          <MdDelete />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                {deleteTargetId
                  ? "Are you sure you want to delete this user?"
                  : "Are you sure you want to delete all users?"}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setDeleteTargetId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={async () => {
                    setShowConfirmModal(false);
                    if (deleteTargetId) {
                      await handleDelete(deleteTargetId);
                      setDeleteTargetId(null);
                    }
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
