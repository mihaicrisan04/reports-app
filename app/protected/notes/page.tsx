import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Your Notes</h1>
        <Link 
          href="/protected/notes/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90"
        >
          Add New Note testing
        </Link>
      </div>
      <div className="grid gap-4">
        {notes?.map((note) => (
          <div key={note.id} className="p-4 border rounded-lg">
            <p>{note.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


