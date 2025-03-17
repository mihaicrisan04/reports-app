create policy "Users can delete their own notes"
on public.notes for delete
to authenticated
using (auth.uid() = user_id);