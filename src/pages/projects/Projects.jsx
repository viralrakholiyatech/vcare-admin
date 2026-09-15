import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import EditIcon from '../../../public/images/edit-icon.svg';
import DeleteIcon from '../../../public/images/delete-icon.svg';

const Projects = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: 'Trewt',
      img: 'https://dummyimage.com/600x400/000/fff',
      status: 'active',
    },
    {
      id: 2,
      name: 'Riya Patel',
      img: 'https://dummyimage.com/600x400/000/fff',
      status: 'inactive',
    },
  ]);

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
  const handleDelete = async id => {
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
      // Dummy Delete API
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        // Remove from table
        setData(prev => prev.filter(row => row.id !== id));

        Swal.fire({
          title: 'Deleted!',
          text: 'Blog has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#431f0f',
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while deleting the blog.',
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
          className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize transition-all duration-200 ${
            row.status === 'active'
              ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
              : 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200'
          }`}
        >
          <span
            className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
              row.status === 'active'
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
            to={`/admin/project/edit/${row.id}`}
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
            Projects
          </h2>

          <Link
            to="/admin/project/add"
            className="user-detail-link item relative lg:p-[12px] p-[10px] rounded-md text-white font-medium lg:text-[16px] text-[14px] bg-[#431f0f] flex items-center gap-4 w-auto transition-all duration-500 hover:bg-[#32170b]"
          >
            Add Project
          </Link>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 20]}
            responsive
            highlightOnHover
            pointerOnHover
            noDataComponent={
              <div className="py-6 text-gray-500">
                No projects found
              </div>
            }
          />
        </div>

      </div>
    </Layout>
  );
};

export default Projects;