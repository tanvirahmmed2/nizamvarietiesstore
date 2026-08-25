'use client'

import NewStaffForm from '@/components/forms/NewStaffForm'
import axios from 'axios'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import {
  RiAddLine,
  RiDeleteBinLine,
  RiArchiveLine,
  RiSearchLine,
  RiShieldUserLine,
  RiUser3Line,
  RiUserFollowLine,
  RiUserUnfollowLine,
  RiTeamLine,
  RiEditLine,
  RiCloseLine,
  RiLockPasswordLine,
  RiCheckLine,
  RiFilter3Line,
} from 'react-icons/ri'

const ROLE_OPTIONS = [
  { value: 'manager', label: 'Manager', color: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' },
  { value: 'sales', label: 'Sales', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { value: 'staff', label: 'Staff', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' },
]

const getRoleBadgeStyle = (role) => {
  switch (role?.toLowerCase()) {
    case 'manager':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'sales':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'staff':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

const RolemanagementPage = () => {
  const [staffs, setStaffs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isNewStaffBox, setIsNewStaffBox] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/staff', { withCredentials: true })
      setStaffs(response.data.payload || [])
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || 'Failed to load staff list')
      setStaffs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  // Change staff role directly
  const handleRoleChange = async (staffId, newRole) => {
    setActionLoadingId(staffId)
    try {
      const response = await axios.put(
        '/api/staff',
        { staff_id: staffId, role: newRole },
        { withCredentials: true }
      )
      toast.success(response.data.message || `Role updated to ${newRole}`)
      setStaffs((prev) =>
        prev.map((item) =>
          item.staff_id === staffId ? { ...item, role: newRole } : item
        )
      )
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update role')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Toggle staff active/inactive status
  const handleToggleStatus = async (staff) => {
    const nextStatus = staff.is_active === false ? true : false
    setActionLoadingId(staff.staff_id)
    try {
      const response = await axios.put(
        '/api/staff',
        { staff_id: staff.staff_id, is_active: nextStatus },
        { withCredentials: true }
      )
      toast.success(
        response.data.message ||
          `Staff ${nextStatus ? 'activated' : 'deactivated'} successfully`
      )
      setStaffs((prev) =>
        prev.map((item) =>
          item.staff_id === staff.staff_id ? { ...item, is_active: nextStatus } : item
        )
      )
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Delete staff member
  const removeStaff = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from staff?`)) return
    setActionLoadingId(id)
    try {
      const response = await axios.delete('/api/staff', {
        data: { id },
        withCredentials: true,
      })
      toast.success(response.data.message || 'Staff member deleted')
      setStaffs((prev) => prev.filter((item) => item.staff_id !== id))
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove staff')
    } finally {
      setActionLoadingId(null)
    }
  }

  // Filtered staffs calculation
  const filteredStaffs = useMemo(() => {
    return staffs.filter((staff) => {
      const matchesSearch =
        staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole =
        roleFilter === 'all' || staff.role?.toLowerCase() === roleFilter.toLowerCase()

      const isStaffActive = staff.is_active !== false
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isStaffActive) ||
        (statusFilter === 'inactive' && !isStaffActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [staffs, searchTerm, roleFilter, statusFilter])

  // Summary Metrics
  const stats = useMemo(() => {
    const total = staffs.length
    const active = staffs.filter((s) => s.is_active !== false).length
    const inactive = total - active
    const managers = staffs.filter(
      (s) => s.role?.toLowerCase() === 'manager'
    ).length
    return { total, active, inactive, managers }
  }, [staffs])

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <RiShieldUserLine size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Role & Staff Management
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage staff profiles, set access roles, and control account active statuses
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsNewStaffBox(true)}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-sky-200 active:scale-95 whitespace-nowrap cursor-pointer"
        >
          <RiAddLine size={20} />
          <span>Add New Staff</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <RiTeamLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Staff
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <RiUserFollowLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Members
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.active}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <RiUserUnfollowLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Deactivated
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.inactive}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <RiShieldUserLine size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Managers
            </p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{stats.managers}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <RiFilter3Line size={16} />
            <span>Filters:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-semibold outline-none focus:border-sky-500 focus:bg-white cursor-pointer transition-all"
          >
            <option value="all">All Roles</option>
            <option value="manager">Manager</option>
            <option value="sales">Sales</option>
            <option value="staff">Staff</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-semibold outline-none focus:border-sky-500 focus:bg-white cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main Staff Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading staff members...</p>
          </div>
        ) : filteredStaffs.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center text-center gap-3 p-6">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <RiArchiveLine size={32} />
            </div>
            <div>
              <p className="text-slate-600 font-semibold">No Staff Found</p>
              <p className="text-slate-400 text-sm mt-1">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'No staff members match the selected search or filter criteria.'
                  : 'Get started by adding a new staff member.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Assigned Role
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaffs.map((staff) => {
                  const isActive = staff.is_active !== false
                  const isBusy = actionLoadingId === staff.staff_id

                  return (
                    <tr
                      key={staff.staff_id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {staff.name ? staff.name.substring(0, 2).toUpperCase() : 'ST'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 text-sm">
                              {staff.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: #{staff.staff_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-600 text-sm font-medium">
                        {staff.email}
                      </td>

                      {/* Editable Role Dropdown */}
                      <td className="py-4 px-6">
                        <select
                          disabled={isBusy}
                          value={staff.role || 'staff'}
                          onChange={(e) => handleRoleChange(staff.staff_id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border outline-none cursor-pointer transition-all ${getRoleBadgeStyle(
                            staff.role
                          )} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-white text-slate-800 font-medium normal-case"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Active/Inactive Status Toggle */}
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleToggleStatus(staff)}
                          className={`group/btn relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          } ${isBusy ? 'opacity-50 cursor-wait' : ''}`}
                          title={`Click to ${isActive ? 'deactivate' : 'activate'} staff`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                            }`}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Edit Modal trigger */}
                          <button
                            disabled={isBusy}
                            onClick={() => setEditingStaff(staff)}
                            className="p-2 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer disabled:opacity-50"
                            title="Edit Staff Details"
                          >
                            <RiEditLine size={18} />
                          </button>

                          {/* Delete trigger */}
                          <button
                            disabled={isBusy}
                            onClick={() => removeStaff(staff.staff_id, staff.name)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                            title="Remove Staff"
                          >
                            <RiDeleteBinLine size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isNewStaffBox && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <NewStaffForm
              onSuccess={() => {
                setIsNewStaffBox(false)
                fetchStaff()
              }}
              onCancel={() => setIsNewStaffBox(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <EditStaffModal
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
          onSuccess={() => {
            setEditingStaff(null)
            fetchStaff()
          }}
        />
      )}
    </div>
  )
}

// Separate Edit Staff Modal Component
const EditStaffModal = ({ staff, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    staff_id: staff.staff_id,
    name: staff.name || '',
    email: staff.email || '',
    role: staff.role || 'staff',
    is_active: staff.is_active !== false,
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = {
        staff_id: formData.staff_id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
        ...(formData.password.trim() ? { password: formData.password.trim() } : {}),
      }
      const response = await axios.put('/api/staff', payload, { withCredentials: true })
      toast.success(response.data.message || 'Staff updated successfully')
      onSuccess()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update staff member')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <RiEditLine size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">Edit Staff Member</h2>
              <p className="text-xs text-slate-400">Update account credentials, role & status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Assigned Role <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 bg-white"
              >
                <option value="manager">Manager</option>
                <option value="sales">Sales</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Account Status</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold flex items-center justify-between cursor-pointer transition-all ${
                  formData.is_active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                <span>{formData.is_active ? 'Active' : 'Inactive'}</span>
                <span
                  className={`w-3 h-3 rounded-full ${
                    formData.is_active ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <RiLockPasswordLine size={16} className="text-slate-400" />
              <span>New Password (optional)</span>
            </label>
            <input
              type="password"
              placeholder="Leave blank to keep existing password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition-colors shadow-sm shadow-sky-200 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Saving...' : 'Update Staff'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RolemanagementPage
