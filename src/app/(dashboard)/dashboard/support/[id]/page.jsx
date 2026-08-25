'use client'

import axios from 'axios'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, use } from 'react'
import { toast } from 'react-hot-toast'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  RiArrowLeftLine,
  RiSendPlane2Line,
  RiUser3Line,
  RiMailLine,
  RiTimeLine,
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH2,
  RiListUnordered,
  RiListOrdered,
  RiDoubleQuotesL,
  RiFormatClear,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiCustomerService2Line,
} from 'react-icons/ri'
import { format } from 'date-fns'

// Custom Tiptap Toolbar Component
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors ${
          editor.isActive('bold') ? 'bg-slate-200 font-bold text-sky-600' : ''
        }`}
        title="Bold"
      >
        <RiBold size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors ${
          editor.isActive('italic') ? 'bg-slate-200 font-bold text-sky-600' : ''
        }`}
        title="Italic"
      >
        <RiItalic size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors ${
          editor.isActive('strike') ? 'bg-slate-200 font-bold text-sky-600' : ''
        }`}
        title="Strikethrough"
      >
        <RiStrikethrough size={16} />
      </button>

      <div className="w-px h-5 bg-slate-300 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 font-bold text-sky-600' : ''
        }`}
        title="Heading"
      >
        <RiH2 size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-slate-200 font-bold text-sky-600' : ''
        }`}
        title="Bullet List"
      >
        <RiListUnordered size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-slate-200 font-bold text-sky-600' : ''
        }`}
        title="Numbered List"
      >
        <RiListOrdered size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors ${
          editor.isActive('blockquote') ? 'bg-slate-200 font-bold text-sky-600' : ''
        }`}
        title="Blockquote"
      >
        <RiDoubleQuotesL size={16} />
      </button>

      <div className="w-px h-5 bg-slate-300 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
        title="Clear Formatting"
      >
        <RiFormatClear size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
        title="Undo"
      >
        <RiArrowGoBackLine size={16} />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
        title="Redo"
      >
        <RiArrowGoForwardLine size={16} />
      </button>
    </div>
  )
}

const SupportReplyPage = ({ params: paramsPromise }) => {
  const params = use(paramsPromise)
  const id = params.id
  const router = useRouter()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [customSubject, setCustomSubject] = useState('')
  const [ticketStatus, setTicketStatus] = useState('pending')

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Dear Customer,</p><p>Thank you for reaching out to Nizam Store. </p><p>Best regards,<br><strong>Customer Support Team</strong></p>',
    immediatelyRender: false,
  })

  const fetchTicket = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/support/${id}`, { withCredentials: true })
      const data = response.data.payload
      setTicket(data)
      setTicketStatus(data.status || 'pending')
      setCustomSubject(`Re: ${data.subject || 'Support Inquiry'}`)
    } catch (error) {
      console.error("Fetch ticket error:", error)
      toast.error(error?.response?.data?.message || 'Support ticket not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchTicket()
  }, [id])

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!editor) return

    const htmlContent = editor.getHTML()
    if (!htmlContent || htmlContent === '<p></p>') {
      toast.error('Please enter reply text before sending')
      return
    }

    setSending(true)
    try {
      const response = await axios.post(
        `/api/support/${id}`,
        {
          replyHtml: htmlContent,
          customSubject: customSubject,
          status: 'replied',
        },
        { withCredentials: true }
      )
      toast.success(response.data.message || 'Reply email sent successfully!')
      setTicketStatus('replied')
      router.push('/dashboard/support')
    } catch (error) {
      console.error("Send reply error:", error)
      toast.error(error?.response?.data?.message || 'Failed to send reply email')
    } finally {
      setSending(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put('/api/support', { support_id: id, status: newStatus }, { withCredentials: true })
      toast.success(response.data.message || `Status updated to ${newStatus}`)
      setTicketStatus(newStatus)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading ticket details...</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 py-20 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
        <RiCustomerService2Line size={48} className="text-slate-300" />
        <h2 className="text-lg font-bold text-slate-700">Support Ticket Not Found</h2>
        <Link
          href="/dashboard/support"
          className="flex items-center gap-2 bg-sky-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-sky-600 transition-colors"
        >
          <RiArrowLeftLine size={18} />
          <span>Back to Support List</span>
        </Link>
      </div>
    )
  }

  const formattedDate = ticket.created_at
    ? format(new Date(ticket.created_at), 'MMMM dd, yyyy • HH:mm')
    : 'N/A'

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 pb-12">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/support"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <RiArrowLeftLine size={18} />
          <span>Back to Support Messages</span>
        </Link>

        {/* Quick Status Update */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ticket Status:
          </span>
          <select
            value={ticketStatus}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider outline-none focus:border-sky-500 cursor-pointer shadow-xs"
          >
            <option value="pending">Pending</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Customer Ticket Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
              {ticket.name ? ticket.name.substring(0, 2).toUpperCase() : 'CU'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{ticket.name || 'Anonymous Customer'}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  <RiMailLine size={14} />
                  {ticket.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RiTimeLine size={14} />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              ticketStatus === 'replied'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : ticketStatus === 'closed'
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {ticketStatus}
          </span>
        </div>

        {/* Original Message */}
        <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Subject: <span className="text-slate-800 normal-case font-semibold">{ticket.subject || 'No Subject'}</span>
          </p>
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-200/60">
            {ticket.message}
          </div>
        </div>
      </div>

      {/* Reply Form with Tiptap Editor */}
      <form onSubmit={handleSendReply} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <RiSendPlane2Line size={20} className="text-sky-500" />
            <span>Compose Response Email</span>
          </div>
          <span className="text-xs text-slate-400">Powered by Brevo Mailer</span>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Email Subject */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Email Subject Line
            </label>
            <input
              type="text"
              required
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-800 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all bg-slate-50/50"
            />
          </div>

          {/* Tiptap Editor Container */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Reply Content (Rich Text)
            </label>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all">
              <MenuBar editor={editor} />
              <EditorContent
                editor={editor}
                className="min-h-[220px] p-4 text-slate-800 text-sm outline-none font-normal leading-relaxed prose max-w-none [&_.is-editor-empty]:before:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <Link
            href="/dashboard/support"
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-sky-200 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RiSendPlane2Line size={18} />
            <span>{sending ? 'Sending Email...' : 'Send Reply via Email'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default SupportReplyPage
