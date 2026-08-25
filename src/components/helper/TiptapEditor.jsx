'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { 
  FaBold, FaItalic, FaStrikethrough, FaListUl, FaListOl, 
  FaQuoteLeft, FaUndo, FaRedo 
} from 'react-icons/fa'

const TiptapEditor = ({ value, onChange, placeholder = 'Write details about the product...' }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content focus:outline-none min-h-[140px] p-4 text-slate-800 text-sm leading-relaxed',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className='w-full border border-slate-200 bg-slate-50/30 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:bg-white transition-all flex flex-col'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-1 p-2 bg-slate-100/80 border-b border-slate-200 text-slate-600 select-none'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer ${editor.isActive('bold') ? 'bg-slate-300 text-slate-900 font-bold' : ''}`}
          title="Bold"
        >
          <FaBold size={13} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer ${editor.isActive('italic') ? 'bg-slate-300 text-slate-900' : ''}`}
          title="Italic"
        >
          <FaItalic size={13} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer ${editor.isActive('strike') ? 'bg-slate-300 text-slate-900' : ''}`}
          title="Strikethrough"
        >
          <FaStrikethrough size={13} />
        </button>

        <div className='w-px h-5 bg-slate-300 mx-1' />

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded hover:bg-slate-200 text-xs font-extrabold transition-colors cursor-pointer ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-300 text-slate-900' : ''}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded hover:bg-slate-200 text-xs font-extrabold transition-colors cursor-pointer ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-300 text-slate-900' : ''}`}
          title="Heading 3"
        >
          H3
        </button>

        <div className='w-px h-5 bg-slate-300 mx-1' />

        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer ${editor.isActive('bulletList') ? 'bg-slate-300 text-slate-900' : ''}`}
          title="Bullet List"
        >
          <FaListUl size={13} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer ${editor.isActive('orderedList') ? 'bg-slate-300 text-slate-900' : ''}`}
          title="Numbered List"
        >
          <FaListOl size={13} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer ${editor.isActive('blockquote') ? 'bg-slate-300 text-slate-900' : ''}`}
          title="Blockquote"
        >
          <FaQuoteLeft size={13} />
        </button>

        <div className='w-px h-5 bg-slate-300 mx-1 ml-auto' />

        <button
          type='button'
          onClick={() => editor.chain().focus().undo().run()}
          className='p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-30'
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <FaUndo size={11} />
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().redo().run()}
          className='p-2 rounded hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-30'
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <FaRedo size={11} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  )
}

export default TiptapEditor
