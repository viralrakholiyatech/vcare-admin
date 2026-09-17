import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiSearch } from 'react-icons/fi';
import Layout from '../../components/Layout';
import EditIcon from '../../../public/images/edit-icon.svg';
import DeleteIcon from '../../../public/images/delete-icon.svg';

const parseDate = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const parsed = new Date(val).getTime();
  if (!isNaN(parsed)) return parsed;
  const parts = String(val).split(/[-/]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
      if (!isNaN(d)) return d;
    }
  }
  return 0;
};

const Projects = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load Projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/getproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });

      const text = await response.text();
      let result = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("Could not parse JSON response:", text);
      }
      console.log('Projects list response:', result);

      if (response.ok && !result.error && result.data) {
        const projectList = Array.isArray(result.data) ? result.data : [result.data];

        const sortedList = [...projectList].sort((a, b) => {
          const dateA = parseDate(a.publish_date || a.date || a.created_at || a.created_date || a.updated_at);
          const dateB = parseDate(b.publish_date || b.date || b.created_at || b.created_date || b.updated_at);
          if (dateB !== dateA && dateA !== 0 && dateB !== 0) {
            return dateB - dateA;
          }
          return (Number(b.id) || 0) - (Number(a.id) || 0);
        });

        setData(
          sortedList.map((item) => ({
            id: item.id,
            name: item.title,
            alias: item.alias,
            date: item.publish_date || item.date || item.created_at || '',
            img: item.image
              ? item.image.startsWith('http')
                ? item.image
                : `https://www.vcaretechnologies.net/public/frontend/images/projects/${item.image}`
              : 'https://dummyimage.com/600x400/000/fff',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete Project
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this project!',
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

      const response = await fetch('/api/deleteproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id }),
      });

      const text = await response.text();
      let resData = {};
      try {
        resData = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("Could not parse JSON response:", text);
      }

      if (response.ok && !resData.error && resData.status !== false) {
        setData((prev) => prev.filter((row) => row.id !== id));

        Swal.fire({
          title: 'Deleted!',
          text: resData.messages || resData.message || 'Project has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#431f0f',
        });
      } else {
        throw new Error(
          resData.messages || resData.message || 'Failed to delete project'
        );
      }
    } catch (error) {
      console.error('Delete Project Error:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Something went wrong while deleting the project.',
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
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Image',
      cell: (row) => (
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
      name: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/project/edit/${row.id}`}
            className="h-9 w-9 cursor-pointer flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <img src={EditIcon} alt="edit" className="w-full" />
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="h-9 w-9 cursor-pointer flex items-center justify-center p-1.5 rounded-full hover:bg-red-50 transition-all duration-200"
          >
            <img src={DeleteIcon} alt="delete" className="w-full" />
          </button>
        </div>
      ),
      width: '140px',
    },
  ];

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.name?.toLowerCase().includes(query) ||
      item.alias?.toLowerCase().includes(query) ||
      String(item.id).includes(query)
    );
  });

  return (
    <Layout>
      <div className="main-page-card border border-[#E9EEF2] bg-white rounded-lg lg:p-4 p-3">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="lg:text-[24px] text-[22px] font-semibold text-[#151515]">
            Projects
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-[260px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-8 py-3 text-[14px] border border-[#E9EEF2] rounded-md focus:outline-none focus:border-[#431f0f] bg-[#F9FAFB] placeholder:text-[#9AA2AC]"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA2AC] text-[16px]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-[14px] cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <Link
              to="/admin/project/add"
              className="user-detail-link item relative lg:p-[12px] p-[10px] rounded-md text-white font-medium lg:text-[16px] text-[14px] bg-[#431f0f] flex items-center gap-4 w-auto shrink-0 transition-all duration-500 hover:bg-[#32170b]"
            >
              Add Project
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <DataTable
            columns={columns}
            data={filteredData}
            progressPending={loading}
            pagination
            paginationPerPage={100}
            paginationRowsPerPageOptions={[100, 200, 500]}
            responsive
            highlightOnHover
            pointerOnHover
            noDataComponent={
              <div className="py-6 text-gray-500">
                {searchQuery ? 'No matching projects found' : 'No projects found'}
              </div>
            }
          />
        </div>

      </div>
    </Layout>
  );
};

export default Projects;