import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Icon } from '@iconify/react'
import { useEffect } from 'react'

interface TiptapEditorProps {
    value: string;
    onChange: (val: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const btnClass = "p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center text-[var(--text)]"
    const activeClass = "bg-black/10 dark:bg-white/10"

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}
                title="Bold"
            >
                <Icon icon="ph:text-b-bold" className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}
                title="Italic"
            >
                <Icon icon="ph:text-italic-bold" className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`${btnClass} ${editor.isActive('strike') ? activeClass : ''}`}
                title="Strikethrough"
            >
                <Icon icon="ph:text-strikethrough-bold" className="w-4 h-4" />
            </button>
            
            <div className="w-[1px] bg-black/10 dark:bg-white/10 mx-1 my-1" />
            
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
                title="Bullet List"
            >
                <Icon icon="ph:list-bullets-bold" className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
                title="Ordered List"
            >
                <Icon icon="ph:list-numbers-bold" className="w-4 h-4" />
            </button>

            <div className="w-[1px] bg-black/10 dark:bg-white/10 mx-1 my-1" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${btnClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}
                title="Heading 1"
            >
                <Icon icon="ph:text-h-one-bold" className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${btnClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
                title="Heading 2"
            >
                <Icon icon="ph:text-h-two-bold" className="w-4 h-4" />
            </button>
        </div>
    )
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-sm tiptap-editor-content',
            },
        },
    });

    // Handle updates when value changes externally (e.g. edit mode loaded)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className="flex flex-col border rounded-xl overflow-hidden tiptap-container" style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
            <style dangerouslySetInnerHTML={{__html: `
                .tiptap-editor-content p { margin: 0 0 0.5em 0; }
                .tiptap-editor-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 0 0 0.5em 0; }
                .tiptap-editor-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0 0 0.5em 0; }
                .tiptap-editor-content h1 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
                .tiptap-editor-content h2 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
            `}} />
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="cursor-text flex-1" onClick={() => editor?.commands.focus()} />
        </div>
    );
}
