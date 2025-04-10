import React, { useEffect, useRef, useState } from "react";
import { MdDelete, MdCheck } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { fireDB } from "../../firebase"; // Adjust the path as needed
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Aside from "../../components/Aside";
import useCategories from "../../hooks/useCategories";

const ProductManagement = () => {
  const { categories, loading: loadingCategories } = useCategories();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    tags: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSingleDeleteModal, setShowSingleDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productsPerPage, setProductsPerPage] = useState(10); // default to 10
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);

  // PAGINATION LOGIC
  const filteredProducts = products.filter((prod) => {
    const matchCategory = selectedCategory
      ? prod.category === selectedCategory
      : true;
    const matchSearch = prod.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // FETCHING PRODUCTS
  const productRef = collection(fireDB, "products");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(productRef, orderBy("createdAt", "desc")); // Sort by latest
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      toast.error("Failed to fetch products.");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddProduct = async () => {
    const { name, category, description, price, stock, tags, image } =
      newProduct;

    if (!name || !category || !description || !price || !stock || !image) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setActionInProgress(true);

    try {
      // Upload to backend
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const imageURL = data.imageURL;

      await addDoc(productRef, {
        name,
        category,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        image: imageURL,
        createdAt: serverTimestamp(),
      });

      setNewProduct({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        tags: "",
        image: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Product added successfully.");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to add product.");
      console.error(error);
    }

    setActionInProgress(false);
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditProduct(product);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    const { name, category, price, stock } = editProduct;

    if (!name || !category || !price || !stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setActionInProgress(true);

    try {
      await updateDoc(doc(fireDB, "products", editId), {
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
      });

      setEditId(null);
      setEditProduct({});
      toast.success("Product updated successfully.");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product.");
      console.error(error);
    }

    setActionInProgress(false);
  };

  const handleDelete = async (id) => {
    setActionInProgress(true);
    try {
      await deleteDoc(doc(fireDB, "products", id));
      toast.success("Product deleted.");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error(error);
    }
    setActionInProgress(false);
  };
  const handleDeleteAll = async () => {
    setActionInProgress(true);
    try {
      const data = await getDocs(productRef);

      if (data.empty) {
        toast.info("There are no products to delete.");
        setActionInProgress(false);
        setShowConfirmModal(false);
        return;
      }

      const deletePromises = data.docs.map((docItem) =>
        deleteDoc(doc(fireDB, "products", docItem.id))
      );

      await Promise.all(deletePromises);
      toast.success("All products deleted.");
      setShowConfirmModal(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete all products.");
      console.error(error);
    }
    setActionInProgress(false);
  };

  useEffect(() => {
    document.body.style.overflow =
      showSingleDeleteModal || showConfirmModal ? "hidden" : "auto";
  }, [showSingleDeleteModal, showConfirmModal]);

  return (
    <div className="flex min-h-screen p-10 bg-[#FFF7F0] font-sans">
      <Aside />

      <main className="flex-1 ml-72 ">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-[#F59E0B]">
            Product Management
          </h2>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Delete All Products
          </button>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-md shadow-md mb-10">
          <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="border border-gray-300 px-3 py-2 rounded-md"
            />

            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Price"
              type="number"
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              placeholder="Stocks"
              type="number"
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              name="tags"
              value={newProduct.tags}
              onChange={handleInputChange}
              placeholder="Tags (comma separated)"
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows="3"
              className="border border-gray-300 px-3 py-2 rounded-md col-span-1 md:col-span-2"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="mt-4 bg-[#F59E0B] text-white px-6 py-2 rounded-md hover:bg-[#d97706]"
            disabled={actionInProgress}
          >
            Add Product
          </button>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
            className="px-3 py-2 border border-gray-300 rounded-md w-full max-w-sm"
          />

          <div className="flex items-center gap-7">
            {/* PRODUCTS PER PAGE */}
            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="pageSize" className="font-medium">
                Show:
              </label>
              <select
                id="pageSize"
                value={productsPerPage}
                onChange={(e) => {
                  setProductsPerPage(parseInt(e.target.value));
                  setCurrentPage(1); // reset to first page
                }}
                className="border border-gray-300 px-2 py-1 rounded"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>

            {/* FILTER */}
            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="categoryFilter" className="font-medium">
                Filter by Category:
              </label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1); // Reset to first page
                }}
                className="border border-gray-300 px-3 py-1 rounded-md"
              >
                <option value="">All</option>
                {/* Dynamically generate categories if needed */}
                {loadingCategories ? (
                  <option disabled>Loading...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Product Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[#F59E0B] text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Number</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stocks</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((prod, index) => (
                  <tr key={prod.id} className="border-b">
                    <td className="px-4 py-3 text-center">
                      {indexOfFirstProduct + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {editId === prod.id ? (
                        <input
                          name="name"
                          value={editProduct.name}
                          onChange={handleEditChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleEditSave();
                            }
                          }}
                          className="border border-gray-300 px-2 py-1 rounded-md w-full"
                        />
                      ) : (
                        prod.name
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === prod.id ? (
                        <input
                          name="category"
                          value={editProduct.category}
                          onChange={handleEditChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleEditSave();
                            }
                          }}
                          className="border border-gray-300 px-2 py-1 rounded-md"
                        />
                      ) : (
                        prod.category
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === prod.id ? (
                        <input
                          name="price"
                          type="number"
                          value={editProduct.price}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleEditSave();
                            }
                          }}
                          onChange={handleEditChange}
                          className="border border-gray-300 px-2 py-1 rounded-md"
                        />
                      ) : (
                        `₱${prod.price}`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editId === prod.id ? (
                        <input
                          name="stock"
                          type="number"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleEditSave();
                            }
                          }}
                          value={editProduct.stock}
                          onChange={handleEditChange}
                          className="border border-gray-300 px-2 py-1 rounded-md"
                        />
                      ) : (
                        prod.stock
                      )}
                    </td>
                    <td className="pr-4 py-6 flex space-x-2">
                      {editId === prod.id ? (
                        <button
                          onClick={handleEditSave}
                          className="text-green-600 border p-2 border-green-300 rounded-md hover:bg-green-100"
                          title="Save"
                        >
                          <MdCheck size={20} />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(prod)}
                          className="text-blue-600 border p-2 border-blue-300 rounded-md hover:bg-blue-100"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setProductToDelete(prod);
                          setShowSingleDeleteModal(true);
                        }}
                        className="text-red-600 border p-2 border-red-300 rounded-md hover:bg-red-100"
                        title="Delete"
                        disabled={actionInProgress}
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {currentProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex justify-center items-center mt-6 gap-1 flex-wrap">
              {/* First */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400"
                    : "hover:bg-gray-100"
                }`}
              >
                First
              </button>

              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400"
                    : "hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    // Show only relevant page numbers
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, i, arr) => {
                  const prevPage = arr[i - 1];
                  const showEllipsis = i !== 0 && page - prevPage > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-2">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded ${
                          currentPage === page
                            ? "bg-[#F59E0B] text-white border-[#F59E0B]"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400"
                    : "hover:bg-gray-100"
                }`}
              >
                Next
              </button>

              {/* Last */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400"
                    : "hover:bg-gray-100"
                }`}
              >
                Last
              </button>
            </div>
          </div>
        )}

        {/* Confirm Singe Delete  Modal */}
        {showSingleDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Delete Product</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the product{" "}
                <strong>{productToDelete.name}</strong> ? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSingleDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleDelete(productToDelete.id);
                    setShowSingleDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={actionInProgress}
                >
                  {actionInProgress ? (
                    <div className="flex items-center gap-2">
                      <l-ring
                        size="24"
                        stroke="3"
                        bg-opacity="0"
                        speed="2"
                        color="white"
                      ></l-ring>

                      <h2>Deleting</h2>
                    </div>
                  ) : (
                    "Delete Product"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete All Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">
                Delete All Products
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete all products? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={actionInProgress}
                >
                  {actionInProgress ? (
                    <div className="flex items-center gap-2">
                      <l-ring
                        size="24"
                        stroke="3"
                        bg-opacity="0"
                        speed="2"
                        color="white"
                      ></l-ring>

                      <h2>Deleting</h2>
                    </div>
                  ) : (
                    "Delete All"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
