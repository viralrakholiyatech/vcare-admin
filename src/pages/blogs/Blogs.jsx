import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import EditIcon from '../../../public/images/edit-icon.svg';
import DeleteIcon from '../../../public/images/delete-icon.svg';

const Blogs = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/getblog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      console.log('Blogs list response:', result);

      if (response.ok && !result.error && result.data) {
        const blogList = Array.isArray(result.data) ? result.data : [result.data];
        setData(
          blogList.map((item) => ({
            id: item.id,
            name: item.title,
            img: item.image
              ? item.image.startsWith('http')
                ? item.image
                : `https://www.vcaretechnologies.net/public/frontend/images/blog/${item.image}`
              : 'https://dummyimage.com/600x400/000/fff',
            status: item.status || 'active',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Update Status
  const updateStatus = (id, newStatus) => {
    setData(prev =>
      prev.map(row =>
        row.id === id
          ? { ...row, status: newStatus }
          : row
      )
    );
  };

  // Delete Blog
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this blog!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#431f0f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');

      const response = await fetch('/api/deleteblog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id }),
      });

      const resData = await response.json();

      if (response.ok && !resData.error && resData.status !== false) {
        // Remove from table
        setData((prev) => prev.filter((row) => row.id !== id));

        Swal.fire({
          title: 'Deleted!',
          text: resData.messages || resData.message || 'Blog has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#431f0f',
        });
      } else {
        throw new Error(
          resData.messages || resData.message || 'Failed to delete blog'
        );
      }
    } catch (error) {
      console.error('Delete Blog Error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong while deleting the blog.',
        icon: 'error',
        confirmButtonColor: '#431f0f',
      });
    }
  };

  const columns = [
    {
      name: 'Sr.No',
      selector: (row, index) => index + 1,
      width: '80px',
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Image',
      cell: row => (
        <div className="py-2">
          <img
            src={row.img}
            alt={row.name}
            className="w-[70px] h-[50px] object-cover rounded-md border border-[#E9EEF2]"
          />
        </div>
      ),
      width: '120px',
    },
    {
      name: 'Status',
      cell: row => (
        <button
          type="button"
          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize transition-all duration-200 ${row.status === 'active'
              ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
              : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
            }`}
        >
          <span
            className={`inline-block w-2 h-2 rounded-full mr-1.5 ${row.status === 'active'
                ? 'bg-green-600'
                : 'bg-red-600'
              }`}
          ></span>
          {row.status}
        </button>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        rowA.status.localeCompare(rowB.status),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/blog/edit/${row.id}`}
            className="h-9 w-9 cursor-pointer flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <img
              src={EditIcon}
              alt="edit"
              className="w-full"
            />
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="h-9 w-9 cursor-pointer flex items-center justify-center p-1.5 rounded-full hover:bg-red-50 transition-all duration-200"
          >
            <img
              src={DeleteIcon}
              alt="delete"
              className="w-full"
            />
          </button>
        </div>
      ),
      width: '140px',
    },
  ];

  return (
    <Layout>
      <div className="main-page-card border border-[#E9EEF2] bg-white rounded-lg lg:p-4 p-3">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="lg:text-[24px] text-[22px] font-semibold text-[#151515]">
            Blogs
          </h2>

          <Link
            to="/admin/blog/add"
            className="user-detail-link item relative lg:p-[12px] p-[10px] rounded-md text-white font-medium lg:text-[16px] text-[14px] bg-[#431f0f] flex items-center gap-4 w-auto transition-all duration-500 hover:bg-[#32170b]"
          >
            Add Blog
          </Link>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={data}
            progressPending={loading}
            pagination
            paginationPerPage={20}
            paginationRowsPerPageOptions={[20, 50, 100]}
            responsive
            highlightOnHover
            pointerOnHover
            noDataComponent={
              <div className="py-6 text-gray-500">
                No blogs found
              </div>
            }
          />
        </div>

      </div>
    </Layout>
  );
};

export default Blogs;